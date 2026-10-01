"""
RemoveBG AI - FastAPI REST API Endpoints
"""

import time
import io
import zipfile
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Request, status
from fastapi.responses import Response, StreamingResponse
from typing import List

from ..core.config import settings
from ..core.security import check_rate_limit, validate_image_bytes
from ..services.background_removal_service import background_removal_service
from ..models.schemas import HealthResponse, ModelStatusResponse, MetricsResponse

router = APIRouter()

# Server start time for uptime tracking
_start_time = time.time()

# Internal aggregated metrics counter
_metrics = {
    "total_processed": 0,
    "successful_jobs": 0,
    "failed_jobs": 0,
    "total_processing_time_ms": 0.0,
}

@router.post(
    "/remove-background",
    summary="Remove background from single image",
    description="Upload an image (JPG, PNG, WEBP) and receive a high-resolution transparent PNG output powered by open-source AI.",
    responses={
        200: {
            "content": {"image/png": {}},
            "description": "Clean transparent PNG output.",
        }
    },
    dependencies=[Depends(check_rate_limit)]
)
async def remove_background_endpoint(
    request: Request,
    file: UploadFile = File(..., description="Image file (JPG, PNG, or WEBP, max 25MB)")
):
    start_ts = time.time()
    _metrics["total_processed"] += 1

    try:
        content = await file.read()
        # Security validation (signature, magic bytes, dimensions)
        validate_image_bytes(content)

        # Execute AI inference via dedicated service
        transparent_png_bytes = background_removal_service.remove_background(content)

        duration_ms = (time.time() - start_ts) * 1000
        _metrics["successful_jobs"] += 1
        _metrics["total_processing_time_ms"] += duration_ms

        return Response(
            content=transparent_png_bytes,
            media_type="image/png",
            headers={
                "Content-Disposition": f'attachment; filename="removed-background-{file.filename or "image"}.png"',
                "X-Processing-Time-Ms": f"{duration_ms:.1f}",
            }
        )

    except HTTPException:
        _metrics["failed_jobs"] += 1
        raise
    except Exception as e:
        _metrics["failed_jobs"] += 1
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while processing the image: {str(e)}"
        )

@router.post(
    "/batch/remove-background",
    summary="Batch background removal",
    description="Upload up to 20 images and receive a bundled ZIP archive containing all transparent PNG cutouts.",
    dependencies=[Depends(check_rate_limit)]
)
async def batch_remove_background_endpoint(
    request: Request,
    files: List[UploadFile] = File(..., description="List of image files (max 20)")
):
    if len(files) > 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Batch limit exceeded. Maximum 20 files per batch request."
        )

    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for f in files:
            try:
                content = await f.read()
                validate_image_bytes(content)
                cutout_png = background_removal_service.remove_background(content)

                clean_name = f.filename or "image"
                clean_name = clean_name.rsplit(".", 1)[0]
                zip_file.writestr(f"removed-background-{clean_name}.png", cutout_png)
                _metrics["total_processed"] += 1
                _metrics["successful_jobs"] += 1
            except Exception as err:
                _metrics["failed_jobs"] += 1
                # Include error file in zip log
                zip_file.writestr(f"error-{f.filename}.txt", f"Failed: {str(err)}")

    zip_buffer.seek(0)
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": 'attachment; filename="RemoveBG_Batch_Export.zip"'}
    )

@router.get("/health", response_model=HealthResponse, summary="Server Health Check")
async def health_check():
    return HealthResponse(
        status="ok",
        version="1.0.0",
        device=settings.DEVICE,
        uptime_seconds=round(time.time() - _start_time, 1)
    )

@router.get("/model-status", response_model=ModelStatusResponse, summary="AI Model Status")
async def model_status():
    status_info = background_removal_service.get_status()
    return ModelStatusResponse(
        model_name=status_info["model_name"],
        is_loaded=status_info["is_loaded"],
        device=status_info["device"],
        supports_gpu=settings.DEVICE.lower() == "cuda"
    )

@router.get("/metrics", response_model=MetricsResponse, summary="Aggregated Performance Telemetry")
async def get_metrics():
    total = _metrics["total_processed"]
    avg_time = (_metrics["total_processing_time_ms"] / total) if total > 0 else 0.0
    return MetricsResponse(
        total_processed=_metrics["total_processed"],
        successful_jobs=_metrics["successful_jobs"],
        failed_jobs=_metrics["failed_jobs"],
        avg_processing_time_ms=round(avg_time, 1),
        retention_seconds=settings.IMAGE_RETENTION_SECONDS
    )
