"""Health check endpoint."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/api/ml/health")
async def health_check():
    return {
        "status": "ok",
        "service": "linguaaccess-ml",
        "version": "0.1.0",
    }
