"""
Text-to-speech routes.

POST /tts/speak
  - Accepts text + language + speed
  - Returns audio bytes (WAV)
"""

from __future__ import annotations

import io
import logging
from typing import Optional

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.services.tts_service import TTSService

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------------------------------------------------------------------------
# Request model
# ---------------------------------------------------------------------------

class TTSRequest(BaseModel):
    text: str
    language: str = "en-US"
    speed: float = 1.0        # 0.5 = slow, 1.0 = normal, 1.5 = fast
    voice: Optional[str] = None  # specific voice name if available


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

@router.post("/tts/speak")
async def synthesize_speech(req: TTSRequest):
    """
    Convert text to speech audio (WAV format).

    Returns an audio/wav stream.
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text must not be empty.")

    try:
        service = TTSService.get_instance()
        audio_bytes = await service.synthesize(
            text=req.text,
            language=req.language,
            speed=req.speed,
            voice=req.voice,
        )
        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/wav",
            headers={"Content-Disposition": 'inline; filename="speech.wav"'},
        )
    except Exception as e:
        logger.exception("TTS synthesis failed")
        raise HTTPException(status_code=500, detail=str(e))
