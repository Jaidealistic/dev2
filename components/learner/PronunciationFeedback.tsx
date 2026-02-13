/**
 * PRONUNCIATION FEEDBACK COMPONENT
 *
 * Displays detailed pronunciation evaluation results:
 * - Overall score with colour-coded indicator
 * - Word-level error highlighting
 * - Phoneme-level tips (for specific sounds)
 * - Encouraging, non-shaming feedback (autism/dyslexia friendly)
 * - Listen-again prompt
 * - History of recent attempts
 *
 * Used by: Pronunciation practice page
 */

'use client';

import React from 'react';
import { CheckCircle, AlertCircle, RefreshCw, Star, Volume2 } from 'lucide-react';
import {
  calculatePronunciationScore,
  identifyPronunciationErrors,
  generateFeedback,
} from '@/lib/speech-recognition';
import { speakSlowly } from '@/lib/text-to-speech';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PronunciationFeedbackProps {
  /** What the learner said */
  spoken: string;
  /** What they were supposed to say */
  expected: string;
  /** Language code for TTS playback */
  language?: string;
  /** Score override (if provided by ML service). If omitted, computed locally. */
  score?: number;
  /** Callback when learner clicks "Try Again" */
  onTryAgain?: () => void;
  /** Show attempt history */
  history?: { attempt: number; spoken: string; score: number }[];
}

// ---------------------------------------------------------------------------
// Score → colour mapping
// ---------------------------------------------------------------------------

function scoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-[#7da47f]';
  if (score >= 50) return 'text-amber-500';
  return 'text-orange-500';
}

function scoreBg(score: number): string {
  if (score >= 90) return 'bg-green-50 border-green-200';
  if (score >= 70) return 'bg-[#f0f7f0] border-[#c5d8c7]';
  if (score >= 50) return 'bg-amber-50 border-amber-200';
  return 'bg-orange-50 border-orange-200';
}

function scoreRing(score: number): string {
  if (score >= 90) return 'ring-green-400';
  if (score >= 70) return 'ring-[#7da47f]';
  if (score >= 50) return 'ring-amber-400';
  return 'ring-orange-400';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PronunciationFeedback({
  spoken,
  expected,
  language = 'en-US',
  score: externalScore,
  onTryAgain,
  history,
}: PronunciationFeedbackProps) {
  const score = externalScore ?? calculatePronunciationScore(spoken, expected);
  const feedback = generateFeedback(score);
  const errors = identifyPronunciationErrors(spoken, expected);
  const hasErrors = errors.length > 0;

  return (
    <div className="space-y-4">
      {/* Main score card */}
      <div className={`p-5 rounded-2xl border ${scoreBg(score)}`}>
        <div className="flex items-center gap-4">
          {/* Score circle */}
          <div
            className={`flex-shrink-0 w-16 h-16 rounded-full ring-4 ${scoreRing(score)} flex items-center justify-center bg-white`}
          >
            <span className={`text-2xl font-bold ${scoreColor(score)}`}>{score}</span>
          </div>

          <div className="flex-1">
            <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
              {feedback.emoji} {feedback.message}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              You said: &ldquo;<span className="font-medium">{spoken || '(nothing detected)'}</span>&rdquo;
            </p>
            <p className="text-sm text-gray-600">
              Expected: &ldquo;<span className="font-medium">{expected}</span>&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Word-level error breakdown */}
      {hasErrors && (
        <div className="p-4 bg-white border border-[#d6ddd7] rounded-xl">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Let&apos;s look at the details
          </h4>
          <div className="flex flex-wrap gap-2">
            {expected
              .split(/\s+/)
              .map((word, i) => {
                const error = errors.find(
                  (e) =>
                    e.expected.toLowerCase() === word.toLowerCase() ||
                    (e.type === 'wrong' && i < errors.length),
                );
                const spokenWords = spoken.split(/\s+/);
                const matchesExactly =
                  spokenWords[i]?.toLowerCase() === word.toLowerCase();

                return (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded-lg text-sm font-medium border ${
                      matchesExactly
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                    }`}
                  >
                    {word}
                    {matchesExactly && (
                      <CheckCircle className="w-3 h-3 inline ml-1" />
                    )}
                  </span>
                );
              })}
          </div>
          {errors.some((e) => e.type === 'wrong') && (
            <p className="text-xs text-gray-500 mt-2">
              Red words need more practice. Tap the speaker icon to hear the correct pronunciation.
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {onTryAgain && (
          <button
            onClick={onTryAgain}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7da47f] text-white rounded-full font-medium hover:bg-[#6b946d] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}

        <button
          onClick={() => speakSlowly(expected, language)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#c5d8c7] text-[#5a8c5c] rounded-full font-medium hover:bg-[#f0f7f0] transition-colors"
          aria-label={`Listen to "${expected}" spoken slowly`}
        >
          <Volume2 className="w-4 h-4" />
          Listen Again
        </button>
      </div>

      {/* Attempt history */}
      {history && history.length > 1 && (
        <div className="p-4 bg-gray-50 rounded-xl">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Attempts</h4>
          <div className="space-y-1.5">
            {history.slice(-5).map((h) => (
              <div key={h.attempt} className="flex items-center gap-3 text-sm">
                <span className="text-gray-500 w-6">#{h.attempt}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7da47f] rounded-full"
                    style={{ width: `${h.score}%` }}
                  />
                </div>
                <span className={`font-medium w-10 text-right ${scoreColor(h.score)}`}>
                  {h.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PronunciationFeedback;
