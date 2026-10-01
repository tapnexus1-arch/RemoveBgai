"""
RemoveBG AI - FastAPI Application Entrypoint
"""

import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .core.cleanup import start_cleanup_daemon
from .services.background_removal_service import background_removal_service
from .api.endpoints import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup:
    # 1. Preload AI model into memory/VRAM once (reused across requests)
    try:
        background_removal_service.load_model()
    except Exception as e:
        print(f"Warning: Model pre-load deferred: {e}")

    # 2. Spawn background storage cleanup worker
    cleanup_task = asyncio.create_task(start_cleanup_daemon(interval_seconds=60))

    yield

    # Shutdown:
    cleanup_task.cancel()

app = FastAPI(
    title="RemoveBG AI API",
    description="High-performance open-source AI background removal service.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API endpoints
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
