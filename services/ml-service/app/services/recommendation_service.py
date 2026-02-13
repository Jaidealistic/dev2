"""
Lesson recommendation service.

Uses a rule-based approach (collaborative filtering lite):
1. Prioritise in-progress lessons (continue learning)
2. Suggest lessons at the learner's current level
3. Try to address weaknesses (challenges)
4. Bias toward learner's preferred learning style
5. Avoid recently-completed high-score lessons

Can be replaced with a proper ML model (matrix factorisation,
content-based filtering) once enough user data is collected.
"""

from __future__ import annotations

import logging
from typing import Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Mock lesson catalogue (in production, fetch from backend API / DB)
# ---------------------------------------------------------------------------

LESSON_CATALOGUE = [
    {"id": "lesson-1", "title": "Greetings – Hello & Goodbye", "language": "english", "level": "beginner", "skills": ["vocabulary", "pronunciation"], "style": "auditory"},
    {"id": "lesson-2", "title": "Numbers 1-10", "language": "english", "level": "beginner", "skills": ["vocabulary", "reading"], "style": "visual"},
    {"id": "lesson-3", "title": "Colours and Shapes", "language": "english", "level": "beginner", "skills": ["vocabulary", "reading"], "style": "visual"},
    {"id": "lesson-4", "title": "Family Members", "language": "english", "level": "beginner", "skills": ["vocabulary", "listening"], "style": "auditory"},
    {"id": "lesson-5", "title": "Common Verbs (eat, drink, go)", "language": "english", "level": "beginner", "skills": ["grammar", "vocabulary"], "style": "reading"},
    {"id": "lesson-6", "title": "Simple Sentences", "language": "english", "level": "beginner", "skills": ["grammar", "writing"], "style": "reading"},
    {"id": "lesson-7", "title": "Asking Questions", "language": "english", "level": "intermediate", "skills": ["grammar", "pronunciation"], "style": "auditory"},
    {"id": "lesson-8", "title": "Describing People", "language": "english", "level": "intermediate", "skills": ["vocabulary", "writing"], "style": "visual"},
    {"id": "lesson-9", "title": "Past Tense", "language": "english", "level": "intermediate", "skills": ["grammar"], "style": "reading"},
    {"id": "lesson-10", "title": "Shopping Dialogue", "language": "english", "level": "intermediate", "skills": ["listening", "pronunciation"], "style": "kinesthetic"},
    {"id": "lesson-11", "title": "Tamil Letters – Vowels", "language": "tamil", "level": "beginner", "skills": ["reading", "writing"], "style": "visual"},
    {"id": "lesson-12", "title": "Tamil Letters – Consonants", "language": "tamil", "level": "beginner", "skills": ["reading", "writing"], "style": "visual"},
    {"id": "lesson-13", "title": "Tamil Greetings", "language": "tamil", "level": "beginner", "skills": ["vocabulary", "pronunciation"], "style": "auditory"},
    {"id": "lesson-14", "title": "Tamil Numbers", "language": "tamil", "level": "beginner", "skills": ["vocabulary", "reading"], "style": "visual"},
    {"id": "lesson-15", "title": "Tamil Family Words", "language": "tamil", "level": "beginner", "skills": ["vocabulary"], "style": "visual"},
    {"id": "lesson-16", "title": "Tamil Simple Sentences", "language": "tamil", "level": "intermediate", "skills": ["grammar", "writing"], "style": "reading"},
]


class RecommendationService:
    """Singleton recommendation engine."""

    _instance: Optional["RecommendationService"] = None

    @classmethod
    def get_instance(cls) -> "RecommendationService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def recommend(self, profile, progress: list, limit: int = 5) -> dict:
        """
        Generate ordered lesson recommendations.

        Parameters
        ----------
        profile : LearnerProfile (Pydantic model)
        progress : list[LessonProgress]
        limit : int
        """
        progress_map = {p.lesson_id: p for p in progress}

        # Filter lessons by language
        candidates = [
            l for l in LESSON_CATALOGUE
            if l["language"] == profile.language.lower()
        ]

        scored: list[dict] = []

        for lesson in candidates:
            lid = lesson["id"]
            prog = progress_map.get(lid)
            score, reason = self._score_lesson(lesson, prog, profile)
            scored.append({
                "lesson_id": lid,
                "score": round(score, 3),
                "reason": reason,
                "_raw_score": score,
            })

        # Sort descending by score
        scored.sort(key=lambda x: x["_raw_score"], reverse=True)

        recommendations = []
        for i, item in enumerate(scored[:limit]):
            recommendations.append({
                "lesson_id": item["lesson_id"],
                "score": item["score"],
                "reason": item["reason"],
                "priority": i + 1,
            })

        return {
            "recommendations": recommendations,
            "strategy": f"Rule-based: {profile.language} {profile.level}, "
                        f"style={profile.learning_style}, "
                        f"{len(profile.challenges)} challenge area(s)",
        }

    # ------------------------------------------------------------------
    # Scoring logic
    # ------------------------------------------------------------------

    def _score_lesson(self, lesson: dict, prog, profile) -> tuple[float, str]:
        """
        Score a lesson for recommendation priority.

        Returns (score: 0-1, reason: str).
        """
        score = 0.5  # base
        reasons: list[str] = []

        # --- Status-based scoring ---
        if prog is None or prog.status == "NOT_STARTED":
            score += 0.1
            reasons.append("Not yet attempted")
        elif prog.status == "IN_PROGRESS":
            score += 0.3
            reasons.append("Continue where you left off")
        elif prog.status == "COMPLETED":
            if prog.score is not None and prog.score < 75:
                score += 0.15
                reasons.append("Practice to improve your score")
            else:
                score -= 0.4  # Already mastered
                reasons.append("Already completed well")

        # --- Level matching ---
        level_match = lesson["level"] == profile.level.lower()
        if level_match:
            score += 0.15
            reasons.append("Matches your level")
        else:
            score -= 0.05

        # --- Learning style match ---
        if lesson.get("style") == profile.learning_style.lower():
            score += 0.1
            reasons.append(f"Suits your {profile.learning_style} learning style")

        # --- Challenge areas ---
        lesson_skills = set(lesson.get("skills", []))
        challenges = set(s.lower() for s in profile.challenges)
        overlap = lesson_skills & challenges
        if overlap:
            score += 0.2
            reasons.append(f"Helps with {', '.join(overlap)}")

        # --- Strengths (lower priority – already good) ---
        strengths = set(s.lower() for s in profile.strengths)
        strength_overlap = lesson_skills & strengths
        if strength_overlap and not overlap:
            score -= 0.05

        # Pick the most relevant reason
        reason = reasons[0] if reasons else "Recommended for you"

        return max(0, min(1, score)), reason
