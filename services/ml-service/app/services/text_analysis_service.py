"""
Text analysis service.

Provides:
- Grammar error detection (rule-based, or spaCy if available)
- Vocabulary level estimation (CEFR-like: A1-C2)
- Readability score (Flesch-Kincaid adapted)
- Constructive suggestions
- Simple sentiment detection

Falls back gracefully when spaCy models are not installed.
"""

from __future__ import annotations

import logging
import math
import re
from collections import Counter
from typing import Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Common word lists for vocabulary level estimation
# ---------------------------------------------------------------------------

# Very basic A1 words (first 200 most common)
A1_WORDS = set(
    "a an the i you he she it we they am is are was were be been being "
    "have has had do does did will would shall should can could may might "
    "must need want like go come make take get give say tell know see "
    "think look find use work call try ask put run move live play "
    "and or but if so because when where what who how not no yes "
    "my your his her its our their me him us them this that these those "
    "one two three four five six seven eight nine ten all some any many "
    "much more most very also too just only still even now here there "
    "up down in on at to from by with about between after before "
    "good bad big small new old long short high low right left first last "
    "name day time year way man woman child world life house school "
    "hand head eye face door water food family friend home".split()
)


class TextAnalysisService:
    """Singleton service for text analysis."""

    _instance: Optional["TextAnalysisService"] = None
    _nlp = None

    @classmethod
    def get_instance(cls) -> "TextAnalysisService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self._try_load_spacy()

    def _try_load_spacy(self):
        try:
            import spacy
            self._nlp = spacy.load("en_core_web_sm")
            logger.info("spaCy en_core_web_sm model loaded ✓")
        except Exception:
            logger.warning("spaCy not available – using rule-based analysis")
            self._nlp = None

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def analyze(self, text: str, language: str, learner_level: str) -> dict:
        """Full text analysis. Returns dict matching TextAnalysisResult schema."""
        words = self._tokenise(text)
        unique = set(w.lower() for w in words)

        grammar_errors = self._check_grammar(text)
        vocab_level = self._estimate_vocabulary_level(unique)
        readability = self._readability_score(text)
        sentiment = self._detect_sentiment(text)
        suggestions = self._generate_suggestions(
            grammar_errors, vocab_level, readability, learner_level
        )

        return {
            "grammar_errors": grammar_errors,
            "vocabulary_level": vocab_level,
            "unique_words": len(unique),
            "total_words": len(words),
            "readability_score": round(readability, 1),
            "suggestions": suggestions,
            "sentiment": sentiment,
        }

    # ------------------------------------------------------------------
    # Grammar checking (rule-based)
    # ------------------------------------------------------------------

    def _check_grammar(self, text: str) -> list[dict]:
        """Simple rule-based grammar checks."""
        errors: list[dict] = []

        # Rule: Double spaces
        for m in re.finditer(r"  +", text):
            errors.append({
                "message": "Extra spaces detected",
                "offset": m.start(),
                "length": m.end() - m.start(),
                "suggestion": " ",
                "rule": "extra_spaces",
            })

        # Rule: Sentence doesn't start with capital letter (after period)
        for m in re.finditer(r"\.\s+([a-z])", text):
            errors.append({
                "message": "Sentence should start with a capital letter",
                "offset": m.start(1),
                "length": 1,
                "suggestion": m.group(1).upper(),
                "rule": "capitalisation",
            })

        # Rule: Common confusion – "your" vs "you're"
        for m in re.finditer(r"\byour\s+(going|welcome|right|wrong|the\s+best)\b", text, re.I):
            errors.append({
                "message": "Did you mean \"you're\" (you are)?",
                "offset": m.start(),
                "length": 4,
                "suggestion": "you're",
                "rule": "your_youre",
            })

        # Rule: "a" before vowel sound
        for m in re.finditer(r"\ba\s+([aeiou]\w+)\b", text, re.I):
            errors.append({
                "message": f'Use "an" before "{m.group(1)}" (starts with a vowel sound)',
                "offset": m.start(),
                "length": 1,
                "suggestion": "an",
                "rule": "a_an",
            })

        # Rule: Missing period at end
        stripped = text.strip()
        if stripped and stripped[-1] not in ".!?":
            errors.append({
                "message": "Sentence should end with punctuation",
                "offset": len(stripped) - 1,
                "length": 0,
                "suggestion": ".",
                "rule": "end_punctuation",
            })

        return errors

    # ------------------------------------------------------------------
    # Vocabulary level estimation
    # ------------------------------------------------------------------

    def _estimate_vocabulary_level(self, unique_words: set[str]) -> str:
        """
        Estimate CEFR vocabulary level based on word sophistication.
        """
        if not unique_words:
            return "A1"

        a1_count = sum(1 for w in unique_words if w in A1_WORDS)
        ratio = a1_count / len(unique_words)

        total = len(unique_words)

        # Heuristic: more unique words + fewer common words = higher level
        if total < 10 or ratio > 0.8:
            return "A1"
        elif total < 30 or ratio > 0.6:
            return "A2"
        elif total < 60 or ratio > 0.4:
            return "B1"
        elif total < 100 or ratio > 0.25:
            return "B2"
        elif total < 150:
            return "C1"
        else:
            return "C2"

    # ------------------------------------------------------------------
    # Readability
    # ------------------------------------------------------------------

    def _readability_score(self, text: str) -> float:
        """
        Simplified Flesch Reading Ease score (0-100).
        Higher = easier to read.
        """
        sentences = re.split(r"[.!?]+", text)
        sentences = [s.strip() for s in sentences if s.strip()]
        words = self._tokenise(text)

        if not sentences or not words:
            return 100.0

        avg_sentence_len = len(words) / len(sentences)
        avg_syllables = sum(self._count_syllables(w) for w in words) / len(words)

        score = 206.835 - (1.015 * avg_sentence_len) - (84.6 * avg_syllables)
        return max(0, min(100, score))

    @staticmethod
    def _count_syllables(word: str) -> int:
        word = word.lower()
        vowels = "aeiou"
        count = 0
        prev_vowel = False
        for ch in word:
            is_vowel = ch in vowels
            if is_vowel and not prev_vowel:
                count += 1
            prev_vowel = is_vowel
        if word.endswith("e") and count > 1:
            count -= 1
        return max(count, 1)

    # ------------------------------------------------------------------
    # Sentiment
    # ------------------------------------------------------------------

    def _detect_sentiment(self, text: str) -> str:
        """Very simple keyword-based sentiment detection."""
        positive = {"good", "great", "happy", "love", "like", "nice", "wonderful",
                     "excellent", "amazing", "fun", "enjoy", "beautiful", "best",
                     "thank", "thanks", "awesome", "super", "fantastic"}
        negative = {"bad", "sad", "hate", "angry", "wrong", "terrible", "horrible",
                     "ugly", "worst", "never", "difficult", "hard", "problem", "fail"}

        words = set(re.findall(r"\b\w+\b", text.lower()))
        pos = len(words & positive)
        neg = len(words & negative)

        if pos > neg:
            return "positive"
        elif neg > pos:
            return "negative"
        return "neutral"

    # ------------------------------------------------------------------
    # Suggestions
    # ------------------------------------------------------------------

    def _generate_suggestions(
        self,
        grammar_errors: list,
        vocab_level: str,
        readability: float,
        learner_level: str,
    ) -> list[str]:
        """Generate constructive, encouraging suggestions."""
        suggestions = []

        if grammar_errors:
            suggestions.append(
                f"You have {len(grammar_errors)} grammar point(s) to review — "
                "small fixes that will make your writing clearer!"
            )

        if readability < 30:
            suggestions.append(
                "Try using shorter sentences — it makes your writing easier to follow."
            )

        level_order = ["A1", "A2", "B1", "B2", "C1", "C2"]
        target_map = {"beginner": "A2", "intermediate": "B1", "advanced": "B2"}
        target = target_map.get(learner_level, "A2")

        if vocab_level in level_order:
            idx = level_order.index(vocab_level)
            target_idx = level_order.index(target)
            if idx < target_idx:
                suggestions.append(
                    f"Your vocabulary is at {vocab_level} level. "
                    f"Try adding a few new words to reach {target}!"
                )
            else:
                suggestions.append(
                    f"Great vocabulary range ({vocab_level})! Keep exploring new words."
                )

        if not suggestions:
            suggestions.append("Well done! Your writing is clear and well-structured.")

        return suggestions

    # ------------------------------------------------------------------
    # Tokenisation
    # ------------------------------------------------------------------

    @staticmethod
    def _tokenise(text: str) -> list[str]:
        return re.findall(r"\b\w+\b", text)
