"""
Text analysis routes.

POST /text/analyze
  - Accepts learner text + language
  - Returns grammar errors, vocabulary level, readability, suggestions
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.text_analysis_service import TextAnalysisService

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class TextAnalysisRequest(BaseModel):
    text: str
    language: str = "en"
    learner_level: str = "beginner"  # beginner | intermediate | advanced


class GrammarIssue(BaseModel):
    message: str
    offset: int
    length: int
    suggestion: str
    rule: str


class TextAnalysisResult(BaseModel):
    grammar_errors: list[GrammarIssue]
    vocabulary_level: str           # A1, A2, B1, B2, C1, C2
    unique_words: int
    total_words: int
    readability_score: float        # 0 – 100  (Flesch-like)
    suggestions: list[str]          # Encouraging improvement tips
    sentiment: str                  # positive | neutral | negative


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

@router.post("/text/analyze", response_model=TextAnalysisResult)
async def analyze_text(req: TextAnalysisRequest):
    """
    Analyse learner-written text for grammar, vocabulary, and readability.
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text must not be empty.")

    try:
        service = TextAnalysisService.get_instance()
        result = await service.analyze(
            text=req.text,
            language=req.language,
            learner_level=req.learner_level,
        )
        return result
    except Exception as e:
        logger.exception("Text analysis failed")
        raise HTTPException(status_code=500, detail=str(e))
