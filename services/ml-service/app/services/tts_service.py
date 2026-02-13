"""
Text-to-Speech service.

Uses pyttsx3 (offline) as the default engine.
Can be upgraded to Google Cloud TTS or Azure TTS for production.

Falls back to returning a silent WAV if no TTS engine is available,
so the API contract is always fulfilled.
"""

from __future__ import annotations

import io
import logging
import struct
import wave
from typing import Optional

logger = logging.getLogger(__name__)


class TTSService:
    """Singleton TTS service."""

    _instance: Optional["TTSService"] = None
    _engine = None

    @classmethod
    def get_instance(cls) -> "TTSService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self._try_load_engine()

    def _try_load_engine(self):
        """Try to initialise a TTS engine."""
        try:
            import pyttsx3  # type: ignore
            self._engine = pyttsx3.init()
            logger.info("pyttsx3 TTS engine loaded ✓")
        except Exception:
            logger.warning("pyttsx3 not available – TTS will return silent WAV")
            self._engine = None

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def synthesize(
        self,
        text: str,
        language: str = "en-US",
        speed: float = 1.0,
        voice: Optional[str] = None,
    ) -> bytes:
        """
        Synthesise speech audio from text.

        Returns WAV bytes.
        """
        if self._engine is not None:
            return self._synthesize_pyttsx3(text, language, speed, voice)

        # Google Cloud TTS integration placeholder
        # return await self._synthesize_google(text, language, speed, voice)

        # Fallback: generate a short silent WAV
        logger.info("TTS unavailable – returning silent WAV placeholder")
        return self._silent_wav(duration_sec=1.0)

    # ------------------------------------------------------------------
    # pyttsx3 synthesis
    # ------------------------------------------------------------------

    def _synthesize_pyttsx3(
        self, text: str, language: str, speed: float, voice: Optional[str]
    ) -> bytes:
        """Synthesise using pyttsx3 (saves to temp file then reads bytes)."""
        import tempfile, os

        # Configure speed
        rate = self._engine.getProperty("rate")
        self._engine.setProperty("rate", int(rate * speed))

        # Try to set voice for language
        voices = self._engine.getProperty("voices")
        lang_prefix = language.lower().replace("-", "_")
        for v in voices:
            if lang_prefix in v.id.lower() or language.split("-")[0] in v.id.lower():
                self._engine.setProperty("voice", v.id)
                break

        if voice:
            self._engine.setProperty("voice", voice)

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp_path = tmp.name

        try:
            self._engine.save_to_file(text, tmp_path)
            self._engine.runAndWait()
            with open(tmp_path, "rb") as f:
                return f.read()
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

    # ------------------------------------------------------------------
    # Silent WAV fallback
    # ------------------------------------------------------------------

    @staticmethod
    def _silent_wav(duration_sec: float = 1.0, sample_rate: int = 16000) -> bytes:
        """Generate a silent WAV file of given duration."""
        n_samples = int(sample_rate * duration_sec)
        buf = io.BytesIO()
        with wave.open(buf, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(sample_rate)
            wf.writeframes(b"\x00\x00" * n_samples)
        return buf.getvalue()
