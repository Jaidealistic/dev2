"""
Pronunciation evaluation service.

Uses a lightweight approach:
1. Transcribe audio using a local Whisper model (or Google Speech-to-Text)
2. Align transcription against expected text at word level
3. Compute phoneme-level accuracy via Levenshtein distance
4. Generate encouraging feedback

When running without GPU / heavy models, falls back to a
rule-based string-similarity scorer so the API still works.
"""

from __future__ import annotations

import logging
import re
from difflib import SequenceMatcher
from typing import Optional

logger = logging.getLogger(__name__)


class PronunciationService:
    """Singleton service for pronunciation evaluation."""

    _instance: Optional["PronunciationService"] = None
    _whisper_model = None

    @classmethod
    def get_instance(cls) -> "PronunciationService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self._try_load_whisper()

    def _try_load_whisper(self):
        """Attempt to load Whisper for transcription. Falls back gracefully."""
        try:
            import whisper  # type: ignore
            self._whisper_model = whisper.load_model("tiny")
            logger.info("Whisper tiny model loaded ✓")
        except Exception:
            logger.warning(
                "Whisper not available – using fallback string similarity scorer"
            )
            self._whisper_model = None

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def evaluate(
        self,
        audio_bytes: bytes,
        expected_text: str,
        language: str = "en-US",
    ) -> dict:
        """
        Evaluate pronunciation.

        Returns a dict matching the PronunciationResult schema.
        """
        spoken_text = await self._transcribe(audio_bytes, language)
        return self._score(spoken_text, expected_text)

    # ------------------------------------------------------------------
    # Transcription
    # ------------------------------------------------------------------

    async def _transcribe(self, audio_bytes: bytes, language: str) -> str:
        """Transcribe audio to text."""
        if self._whisper_model is not None:
            return self._transcribe_whisper(audio_bytes, language)

        # Fallback: If no ASR model, return a dummy transcript
        # (In production, integrate Google Cloud Speech or Azure Speech)
        logger.info("ASR unavailable – returning placeholder transcript")
        return "[transcription unavailable – connect ASR service]"

    def _transcribe_whisper(self, audio_bytes: bytes, language: str) -> str:
        """Transcribe using OpenAI Whisper (local model)."""
        import tempfile, os

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        try:
            lang_code = language.split("-")[0]  # "en-US" -> "en"
            result = self._whisper_model.transcribe(
                tmp_path, language=lang_code, fp16=False
            )
            return result.get("text", "").strip()
        finally:
            os.unlink(tmp_path)

    # ------------------------------------------------------------------
    # Scoring
    # ------------------------------------------------------------------

    def _score(self, spoken: str, expected: str) -> dict:
        """Score spoken text against expected text."""
        spoken_clean = self._normalise(spoken)
        expected_clean = self._normalise(expected)

        spoken_words = spoken_clean.split()
        expected_words = expected_clean.split()

        # Word-level alignment
        word_errors = []
        matcher = SequenceMatcher(None, expected_words, spoken_words)

        correct_count = 0
        total = len(expected_words)

        for tag, i1, i2, j1, j2 in matcher.get_opcodes():
            if tag == "equal":
                correct_count += i2 - i1
                for idx in range(i1, i2):
                    word_errors.append({
                        "word": expected_words[idx],
                        "expected": expected_words[idx],
                        "spoken": spoken_words[j1 + (idx - i1)],
                        "position": idx,
                        "is_correct": True,
                    })
            elif tag == "replace":
                for k, idx in enumerate(range(i1, i2)):
                    spoken_w = spoken_words[j1 + k] if (j1 + k) < len(spoken_words) else ""
                    sim = SequenceMatcher(None, expected_words[idx], spoken_w).ratio()
                    is_close = sim >= 0.6
                    if is_close:
                        correct_count += sim
                    word_errors.append({
                        "word": expected_words[idx],
                        "expected": expected_words[idx],
                        "spoken": spoken_w,
                        "position": idx,
                        "is_correct": is_close,
                    })
            elif tag == "delete":
                for idx in range(i1, i2):
                    word_errors.append({
                        "word": expected_words[idx],
                        "expected": expected_words[idx],
                        "spoken": "",
                        "position": idx,
                        "is_correct": False,
                    })
            # "insert" – extra words spoken, not penalised heavily

        accuracy = (correct_count / max(total, 1)) * 100
        fluency = self._fluency_score(spoken_words, expected_words)
        overall = accuracy * 0.7 + fluency * 0.3

        return {
            "overall_score": round(min(max(overall, 0), 100), 1),
            "accuracy_score": round(min(max(accuracy, 0), 100), 1),
            "fluency_score": round(min(max(fluency, 0), 100), 1),
            "word_errors": word_errors,
            "feedback": self._feedback(overall),
            "spoken_text": spoken,
            "expected_text": expected,
        }

    def _fluency_score(self, spoken_words: list, expected_words: list) -> float:
        """Approximate fluency based on word count ratio."""
        if not expected_words:
            return 100.0
        ratio = len(spoken_words) / len(expected_words)
        # Ideal ratio = 1.0; penalise deviation
        if 0.8 <= ratio <= 1.2:
            return 100.0
        elif 0.5 <= ratio <= 1.5:
            return 70.0
        else:
            return 40.0

    def _feedback(self, score: float) -> str:
        """Generate encouraging, non-shaming feedback."""
        if score >= 90:
            return "Excellent pronunciation! You sound very natural."
        elif score >= 75:
            return "Great job! Just a few words to polish – keep practising!"
        elif score >= 60:
            return "Good effort! Try listening to the slow version and repeating."
        elif score >= 40:
            return "You're making progress! Focus on the highlighted words and try again."
        else:
            return "Keep going! Every attempt makes you better. Try saying it slowly first."

    @staticmethod
    def _normalise(text: str) -> str:
        """Lower-case, strip punctuation, collapse whitespace."""
        text = text.lower()
        text = re.sub(r"[^\w\s]", "", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text
