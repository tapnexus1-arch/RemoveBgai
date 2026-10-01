"""
RemoveBG AI - Automatic File Cleaner
Ensures zero persistent storage by purging any temporary file older than IMAGE_RETENTION_SECONDS.
"""

import os
import time
import asyncio
import logging
from .config import settings

logger = logging.getLogger("removebg.cleanup")

def purge_expired_files():
    temp_dir = settings.TEMP_DIR
    if not os.path.exists(temp_dir):
        return

    now = time.time()
    retention_cutoff = now - settings.IMAGE_RETENTION_SECONDS
    deleted_count = 0

    try:
        for filename in os.listdir(temp_dir):
            file_path = os.path.join(temp_dir, filename)
            if os.path.isfile(file_path):
                file_mtime = os.path.getmtime(file_path)
                if file_mtime < retention_cutoff:
                    try:
                        os.remove(file_path)
                        deleted_count += 1
                    except Exception as e:
                        logger.warning(f"Failed to delete temp file {file_path}: {e}")

        if deleted_count > 0:
            logger.info(f"Purged {deleted_count} expired temporary files (TTL: {settings.IMAGE_RETENTION_SECONDS}s).")
    except Exception as e:
        logger.error(f"Error during temporary directory scan: {e}")

async def start_cleanup_daemon(interval_seconds: int = 60):
    """
    Background async task that periodically purges expired files.
    """
    logger.info(f"Starting automatic storage cleanup worker (Interval: {interval_seconds}s, Retention: {settings.IMAGE_RETENTION_SECONDS}s)")
    while True:
        try:
            purge_expired_files()
        except Exception as e:
            logger.error(f"Cleanup daemon encountered error: {e}")
        await asyncio.sleep(interval_seconds)
