"""
RemoveBG AI - Dedicated Self-Hosted AI Background Removal Service
Loads the open-source neural network once at application startup and reuses it across requests.
"""

import io
import logging
from PIL import Image
from ..core.config import settings

logger = logging.getLogger("removebg.service")

class BackgroundRemovalService:
    def __init__(self):
        self._session = None
        self._is_loaded = False
        self._model_name = settings.MODEL_NAME

    def load_model(self):
        """
        Preloads the model weights into memory/VRAM once at server initialization.
        """
        if self._is_loaded:
            return

        logger.info(f"Loading open-source AI segmentation model: {self._model_name} on device: {settings.DEVICE}...")
        try:
            # We use rembg / onnxruntime wrapper which manages open-source U2-Net / RMBG models
            from rembg import new_session
            
            # Map device configuration
            providers = None
            if settings.DEVICE.lower() == "cuda":
                providers = ['CUDAExecutionProvider', 'CPUExecutionProvider']
            else:
                providers = ['CPUExecutionProvider']

            # Create reusable ONNX inference session
            # If RMBG model is specified or default u2net
            model_key = "u2net" if "u2" in self._model_name.lower() else "bria-rmbg"
            try:
                self._session = new_session(model_name=model_key, providers=providers)
            except Exception as e:
                logger.warning(f"Could not load custom model key {model_key}, falling back to standard u2net: {e}")
                self._session = new_session(model_name="u2net", providers=providers)

            self._is_loaded = True
            logger.info("AI Model successfully initialized in memory.")
        except Exception as e:
            logger.error(f"Failed to load AI model: {e}")
            raise RuntimeError(f"Could not load background removal AI model: {e}")

    def remove_background(self, image_bytes: bytes) -> bytes:
        """
        Primary interface:
        Takes raw image bytes, runs inference on the preloaded model session,
        and returns clean transparent PNG bytes.
        """
        if not self._is_loaded or self._session is None:
            self.load_model()

        try:
            from rembg import remove

            input_img = Image.open(io.BytesIO(image_bytes))
            
            # Execute inference using preloaded session
            output_img = remove(
                input_img,
                session=self._session,
                alpha_matting=True,
                alpha_matting_foreground_threshold=240,
                alpha_matting_background_threshold=10,
                alpha_matting_erode_size=10
            )

            # Export transparent PNG into in-memory buffer
            output_buffer = io.BytesIO()
            output_img.save(output_buffer, format="PNG", optimize=True)
            return output_buffer.getvalue()

        except Exception as e:
            logger.error(f"Error during background removal inference: {e}")
            raise RuntimeError(f"AI segmentation failed: {str(e)}")

    def get_status(self) -> dict:
        return {
            "model_name": self._model_name,
            "is_loaded": self._is_loaded,
            "device": settings.DEVICE,
        }

# Singleton instance
background_removal_service = BackgroundRemovalService()
