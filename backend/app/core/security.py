"""
RemoveBG AI - Security & Validation Layer
"""

import time
import uuid
import os
from fastapi import HTTPException, status, Request
from PIL import Image
import io
from .config import settings

# In-memory sliding rate limiter per client IP
_rate_limit_cache: dict[str, list[float]] = {}

# File signature magic bytes
FILE_SIGNATURES = {
    b"\xff\xd8\xff": "image/jpeg",
    b"\x89PNG\r\n\x1a\n": "image/png",
    b"RIFF": "image/webp",  # followed by WEBP
}

def check_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    
    # Initialize or filter timestamps within the last 60 seconds
    timestamps = _rate_limit_cache.get(client_ip, [])
    timestamps = [t for t in timestamps if now - t < 60]
    
    if len(timestamps) >= settings.RATE_LIMIT_PER_MINUTE:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Maximum {settings.RATE_LIMIT_PER_MINUTE} requests per minute."
        )
    
    timestamps.append(now)
    _rate_limit_cache[client_ip] = timestamps

def validate_image_bytes(content: bytes) -> str:
    """
    Validates file signature, size, and image integrity.
    Never trusts Content-Type or user-supplied filenames.
    """
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum size limit of {settings.MAX_FILE_SIZE / (1024 * 1024):.1f} MB."
        )

    # Check magic bytes
    detected_mime = None
    for sig, mime in FILE_SIGNATURES.items():
        if content.startswith(sig):
            if sig == b"RIFF" and len(content) >= 12 and content[8:12] != b"WEBP":
                continue
            detected_mime = mime
            break

    if not detected_mime:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported or corrupt image format. Allowed formats: JPG, PNG, WEBP."
        )

    # Validate image dimensions using Pillow safely
    try:
        with Image.open(io.BytesIO(content)) as img:
            w, h = img.size
            if w * h > settings.MAX_IMAGE_PIXELS:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Image resolution ({w}x{h} = {w*h} pixels) exceeds maximum allowed limit of {settings.MAX_IMAGE_PIXELS} pixels."
                )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to parse image data. The file appears to be corrupted."
        )

    return detected_mime

def get_safe_temp_path(extension: str = "png") -> str:
    """
    Generates an unguessable safe filepath inside the sandboxed TEMP_DIR.
    Guarantees no path traversal possible.
    """
    os.makedirs(settings.TEMP_DIR, exist_ok=True)
    safe_id = uuid.uuid4().hex
    return os.path.join(settings.TEMP_DIR, f"{safe_id}.{extension}")
