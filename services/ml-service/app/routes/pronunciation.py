"""
Pronunciation evaluation routes.

POST /pronunciation/evaluate
  - Accepts audio file (WAV/MP3) + expected text
  - Returns phoneme-level accuracy, overall score, word-level errors
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from pydantic import BaseModel

from app.services.pronunciation_service import PronunciationService

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------------------------------------------------------------------------
# Response models
# ---------------------------------------------------------------------------

class WordError(BaseModel):
    word: str
    expected: str
    spoken: str
    position: int
    is_correct: bool


class PronunciationResult(BaseModel):
    overall_score: float          # 0 – 100
    fluency_score: float
    accuracy_score: float
    word_errors: list[WordError]
    feedback: str                 # Encouraging text
    spoken_text: str              # What was transcribed
    expected_text: str


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

@router.post("/pronunciation/evaluate", response_model=PronunciationResult)
async def evaluate_pronunciation(
    audio: UploadFile = File(...),
    expected_text: str = Form(...),
    language: str = Form("en-US"),
):
    """
    Evaluate a learner's pronunciation against expected text.

    Parameters
    ----------
    audio : UploadFile
        WAV or MP3 audio recording.
    expected_text : str
        The text the learner was supposed to say.
    language : str
        BCP-47 language code (default: en-US).
    """
    if not audio.content_type or not audio.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="Upload must be an audio file.")

    try:
        audio_bytes = await audio.read()
        service = PronunciationService.get_instance()
        result = await service.evaluate(
            audio_bytes=audio_bytes,
            expected_text=expected_text,
            language=language,
        )
        return result
    except Exception as e:
        logger.exception("Pronunciation evaluation failed")
        raise HTTPException(status_code=500, detail=str(e))
