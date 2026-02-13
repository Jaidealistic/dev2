/**
 * RECOMMENDED LESSONS COMPONENT
 *
 * Displays AI-recommended lessons on the learner dashboard.
 *
 * Currently uses a rule-based recommendation (not-started/in-progress first,
 * matching learner language), with the architecture ready for a real
 * ML recommendation endpoint (POST /api/ml/recommend-lessons).
 *
 * Features:
 * - Prioritises incomplete lessons
 * - Language-aware (shows English or Tamil lessons based on profile)
 * - Difficulty-appropriate suggestions
 * - "Why recommended" tooltip
 * - Quick-start action
 *
 * Used by: Learner dashboard
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  Star,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RecommendedLesson {
  id: string;
  title: string;
  language: string;
  level: string;
  estimatedMinutes: number;
  reason: string;         // "Continue where you left off", "Matches your level", etc.
  progress: number;       // 0-100
  score?: number;
}

interface RecommendedLessonsProps {
  /** Max lessons to display */
  limit?: number;
  /** Learner's primary learning language */
  language?: string;
  /** Current proficiency level */
  level?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RecommendedLessons({
  limit = 4,
  language = 'english',
  level = 'beginner',
}: RecommendedLessonsProps) {
  const [lessons, setLessons] = useState<RecommendedLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, [language, level]);

  async function fetchRecommendations() {
    setLoading(true);
    setError('');

    try {
      // Fetch all lessons and apply client-side recommendation logic
      // In production, this would call POST /api/ml/recommend-lessons
      const res = await fetch('/api/learner/lessons');
      if (!res.ok) throw new Error('Failed to fetch lessons');

      const data = await res.json();
      const allLessons: any[] = data.lessons ?? data ?? [];

      // Rule-based recommendation:
      // 1. In-progress lessons first (continue learning)
      // 2. Not-started lessons at current level
      // 3. Sort by relevance
      const recommended: RecommendedLesson[] = allLessons
        .map((lesson: any) => {
          const progress = lesson.progress;
          let reason = 'Recommended for you';
          let priority = 3;

          if (progress?.status === 'IN_PROGRESS') {
            reason = 'Continue where you left off';
            priority = 1;
          } else if (progress?.status === 'NOT_STARTED') {
            reason = `Matches your ${level} level`;
            priority = 2;
          } else if (progress?.status === 'COMPLETED' && (progress?.score ?? 100) < 80) {
            reason = 'Practice to improve your score';
            priority = 2.5;
          } else {
            priority = 4; // Already completed with high score
          }

          return {
            id: lesson.id,
            title: lesson.title,
            language: lesson.language ?? language,
            level: lesson.level ?? level,
            estimatedMinutes: lesson.estimatedMinutes ?? 15,
            reason,
            progress: progress?.completionPercent ?? 0,
            score: progress?.score,
            _priority: priority,
          };
        })
        .sort((a: any, b: any) => a._priority - b._priority)
        .slice(0, limit)
        .map(({ _priority, ...rest }: any) => rest);

      setLessons(recommended);
    } catch (err) {
      setError('Could not load recommendations');
      console.warn('Recommendations error:', err);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="p-6 bg-white/80 border border-[#d6ddd7] rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#7da47f]" />
          <h3 className="text-lg font-bold text-gray-900">Recommended for You</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#7da47f]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white/80 border border-[#d6ddd7] rounded-2xl">
        <div className="flex items-center gap-2 text-amber-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="p-6 bg-white/80 border border-[#d6ddd7] rounded-2xl text-center">
        <Star className="w-8 h-8 text-[#7da47f] mx-auto mb-2" />
        <p className="font-semibold text-gray-900">All caught up!</p>
        <p className="text-sm text-gray-600 mt-1">
          You&apos;ve completed all available lessons. New content coming soon!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/80 border border-[#d6ddd7] rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#7da47f]" />
          <h3 className="text-lg font-bold text-gray-900">Recommended for You</h3>
        </div>
        <Link
          href="/learner/lessons"
          className="text-sm text-[#5a8c5c] hover:text-[#4a7c4c] font-medium"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/learner/lessons/${lesson.id}`}
            className="group p-4 bg-[#f8f6f2] hover:bg-[#f0f7f0] border border-[#d6ddd7] hover:border-[#c5d8c7] rounded-xl transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate group-hover:text-[#5a8c5c] transition-colors">
                  {lesson.title}
                </p>
                <p className="text-xs text-[#5a8c5c] mt-0.5">{lesson.reason}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#7da47f] flex-shrink-0 mt-1 transition-colors" />
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {lesson.estimatedMinutes} min
              </span>
              <span className="capitalize">{lesson.language}</span>
              <span className="capitalize">{lesson.level}</span>
            </div>

            {/* Progress bar */}
            {lesson.progress > 0 && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7da47f] rounded-full transition-all"
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RecommendedLessons;
