"""
RemoveBG AI - Core Backend Configuration
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "RemoveBG AI"
    APP_ENV: str = os.getenv("APP_ENV", "production")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # AI Model & Acceleration
    MODEL_NAME: str = os.getenv("MODEL_NAME", "briaai/RMBG-1.4")
    MODEL_PATH: str = os.getenv("MODEL_PATH", "")
    DEVICE: str = os.getenv("DEVICE", "cpu")  # "cpu" or "cuda"
    
    # Limits & Constraints
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", str(25 * 1024 * 1024)))  # 25 MB
    MAX_IMAGE_PIXELS: int = int(os.getenv("MAX_IMAGE_PIXELS", str(16_000_000)))  # 16 Megapixels (4000x4000)
    MAX_CONCURRENT_JOBS: int = int(os.getenv("MAX_CONCURRENT_JOBS", "4"))
    
    # Privacy & Automatic Cleanup
    IMAGE_RETENTION_SECONDS: int = int(os.getenv("IMAGE_RETENTION_SECONDS", "300"))  # 5 minutes
    TEMP_DIR: str = os.getenv("TEMP_DIR", "/tmp/removebg_ai")
    
    # Security & Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    ADMIN_SECRET: str = os.getenv("ADMIN_SECRET", "admin123")
    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
