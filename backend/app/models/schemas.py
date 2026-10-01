"""
RemoveBG AI - Pydantic Request & Response Schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, List

class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    device: str
    uptime_seconds: float

class ModelStatusResponse(BaseModel):
    model_name: str
    is_loaded: bool
    device: str
    supports_gpu: bool

class MetricsResponse(BaseModel):
    total_processed: int
    successful_jobs: int
    failed_jobs: int
    avg_processing_time_ms: float
    retention_seconds: int

class BatchItemResult(BaseModel):
    filename: str
    status: str
    error: Optional[str] = None
    size_bytes: int
