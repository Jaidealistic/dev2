"""
LinguaAccess ML Service – FastAPI Application

Endpoints
---------
POST /api/ml/pronunciation/evaluate   – Evaluate pronunciation from audio
POST /api/ml/text/analyze              – Analyse learner text (grammar, vocabulary)
POST /api/ml/recommend-lessons         – AI-recommended lesson ordering
POST /api/ml/tts/speak                 – Text-to-speech synthesis
GET  /api/ml/health                    – Health check
"""

from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import pronunciation, text_analysis, recommendations, tts, health

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("linguaaccess-ml")

# ---------------------------------------------------------------------------
# Lifespan – lazy-load heavy models on startup
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Warm up models when the service starts."""
    logger.info("Starting LinguaAccess ML service …")

    # Import model loaders; they cache on first call
    from app.services.pronunciation_service import PronunciationService
    from app.services.text_analysis_service import TextAnalysisService

    # Pre-warm (optional – can be skipped in dev for faster startup)
    if os.getenv("PRELOAD_MODELS", "false").lower() == "true":
        logger.info("Pre-loading ML models …")
        PronunciationService.get_instance()
        TextAnalysisService.get_instance()
        logger.info("Models loaded ✓")
    else:
        logger.info("Models will load on first request (set PRELOAD_MODELS=true to pre-load)")

    yield  # app is now serving requests

    logger.info("Shutting down ML service …")


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------

app = FastAPI(
    title="LinguaAccess ML Service",
    description="NLP, Speech, and Recommendation engine for LinguaAccess language learning platform",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS – allow the Next.js frontend (localhost:3001) and backend (localhost:5000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv(
        "CORS_ORIGINS", "http://localhost:3000,http://localhost:3001,http://localhost:5000"
    ).split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Register route modules
# ---------------------------------------------------------------------------

app.include_router(health.router, tags=["Health"])
app.include_router(pronunciation.router, prefix="/api/ml", tags=["Pronunciation"])
app.include_router(text_analysis.router, prefix="/api/ml", tags=["Text Analysis"])
app.include_router(recommendations.router, prefix="/api/ml", tags=["Recommendations"])
app.include_router(tts.router, prefix="/api/ml", tags=["TTS"])
