"""
Lesson recommendation routes.

POST /recommend-lessons
  - Accepts learner profile + progress history
  - Returns ordered list of recommended lesson IDs with reasons
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.recommendation_service import RecommendationService

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class LessonProgress(BaseModel):
    lesson_id: str
    status: str           # NOT_STARTED | IN_PROGRESS | COMPLETED
    score: float | None = None
    completion_percent: float = 0
    attempts: int = 0


class LearnerProfile(BaseModel):
    learner_id: str
    language: str = "english"
    level: str = "beginner"
    learning_style: str = "visual"   # visual | auditory | reading | kinesthetic
    strengths: list[str] = []
    challenges: list[str] = []


class RecommendationRequest(BaseModel):
    profile: LearnerProfile
    progress: list[LessonProgress] = []
    limit: int = 5


class RecommendedLesson(BaseModel):
    lesson_id: str
    score: float          # recommendation confidence 0 – 1
    reason: str           # human-readable "why"
    priority: int         # 1 = highest


class RecommendationResult(BaseModel):
    recommendations: list[RecommendedLesson]
    strategy: str         # brief description of approach used


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

@router.post("/recommend-lessons", response_model=RecommendationResult)
async def recommend_lessons(req: RecommendationRequest):
    """
    Generate personalised lesson recommendations for a learner.
    """
    try:
        service = RecommendationService.get_instance()
        result = await service.recommend(
            profile=req.profile,
            progress=req.progress,
            limit=req.limit,
        )
        return result
    except Exception as e:
        logger.exception("Recommendation failed")
        raise HTTPException(status_code=500, detail=str(e))
