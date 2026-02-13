FROM python:3.11-slim

WORKDIR /app

# System deps for audio processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY pyproject.toml .
RUN pip install --no-cache-dir \
    fastapi==0.104.1 \
    uvicorn==0.24.0 \
    python-multipart==0.0.6 \
    numpy==1.24.3 \
    scipy==1.11.4 \
    pydantic==2.5.0 \
    python-dotenv==1.0.0 \
    soundfile==0.12.1 \
    requests==2.31.0

# Copy app code
COPY app/ app/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
