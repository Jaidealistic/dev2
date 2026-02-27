/**
 * STRENGTHS & CHALLENGES REPORT
 *
 * A parent-facing component that summarises the child's strong areas
 * and areas that need more practice, in a positive, strengths-first
 * tone (never deficit-focused).
 *
 * Features:
 * - Strengths section with green badges
 * - Challenges section with amber "working on it" badges
 * - Language-by-language breakdown
 * - Visual skill radar (simplified bar chart)
 * - Encouraging copy throughout
 * - Fetches from API or uses mock data
 *
 * Used by: Parent dashboard, parent/portfolio
 */

'use client';

import React, { useEffect, useState } from 'react';
import {
  Star,
  TrendingUp,
  Target,
  Loader2,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SkillArea {
  name: string;
  score: number;       // 0 – 100
  trend: 'up' | 'stable' | 'new';
  category: 'strength' | 'challenge' | 'emerging';
}

interface StrengthsChallengesProps {
  /** Child ID to fetch data for */
  childId?: string;
  /** Pre-loaded skill areas */
  skills?: SkillArea[];
  /** Override child name display */
  childName?: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

function generateMockSkills(): SkillArea[] {
  return [
    { name: 'Vocabulary', score: 85, trend: 'up', category: 'strength' },
    { name: 'Listening Comprehension', score: 78, trend: 'up', category: 'strength' },
    { name: 'Reading', score: 72, trend: 'stable', category: 'strength' },
    { name: 'Pronunciation', score: 55, trend: 'up', category: 'challenge' },
    { name: 'Grammar', score: 48, trend: 'new', category: 'challenge' },
    { name: 'Writing', score: 40, trend: 'new', category: 'emerging' },
  ];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SkillBar({ skill }: { skill: SkillArea }) {
  const barColor =
    skill.category === 'strength'
      ? '#7da47f'
      : skill.category === 'challenge'
      ? '#d4a843'
      : '#9db4a0';

  const trendIcon =
    skill.trend === 'up' ? (
      <TrendingUp className="w-3.5 h-3.5 text-[#5a8c5c]" aria-hidden="true" />
    ) : skill.trend === 'new' ? (
      <Sparkles className="w-3.5 h-3.5 text-[#9db4a0]" aria-hidden="true" />
    ) : null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 w-40 flex-shrink-0 truncate">{skill.name}</span>
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${skill.score}%`, backgroundColor: barColor }}
        />
      </div>
      <span className="text-xs font-semibold w-10 text-right text-gray-600">{skill.score}%</span>
      <span className="w-5">{trendIcon}</span>
    </div>
  );
}

function BadgeList({
  skills,
  color,
  bgColor,
}: {
  skills: SkillArea[];
  color: string;
  bgColor: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((s) => (
        <span
          key={s.name}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
          style={{ color, backgroundColor: bgColor }}
        >
          {s.name}
          {s.trend === 'up' && <TrendingUp className="w-3 h-3" aria-hidden="true" />}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StrengthsChallengesReport({
  childId,
  skills: externalSkills,
  childName,
}: StrengthsChallengesProps) {
  const [skills, setSkills] = useState<SkillArea[]>(externalSkills ?? []);
  const [loading, setLoading] = useState(!externalSkills);

  useEffect(() => {
    if (externalSkills) return;
    (async () => {
      try {
        const res = await fetch(
          childId
            ? `/api/parent/children/${childId}/strengths`
            : '/api/parent/child-strengths',
        );
        if (res.ok) {
          const data = await res.json();
          setSkills(data.skills ?? []);
        } else {
          setSkills(generateMockSkills());
        }
      } catch {
        setSkills(generateMockSkills());
      } finally {
        setLoading(false);
      }
    })();
  }, [childId, externalSkills]);

  const strengths = skills.filter((s) => s.category === 'strength');
  const challenges = skills.filter((s) => s.category === 'challenge');
  const emerging = skills.filter((s) => s.category === 'emerging');

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="p-6 bg-white/80 border border-[#d6ddd7] rounded-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-[#7da47f]" aria-hidden="true" />
          Strengths & Growth Areas
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#7da47f]" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/80 border border-[#d6ddd7] rounded-2xl">
      <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
        <Star className="w-5 h-5 text-[#7da47f]" aria-hidden="true" />
        Strengths & Growth Areas
      </h3>
      {childName && (
        <p className="text-sm text-gray-500 mb-4">
          Here&apos;s how {childName} is progressing across different skills.
        </p>
      )}
      {!childName && (
        <p className="text-sm text-gray-500 mb-4">
          A snapshot of your child&apos;s skill development.
        </p>
      )}

      {/* ---- Skill bars ---- */}
      <div className="space-y-3 mb-6">
        {skills.map((s) => (
          <SkillBar key={s.name} skill={s} />
        ))}
      </div>

      {/* ---- Strengths badges ---- */}
      {strengths.length > 0 && (
        <div className="mb-4">
          <p className="flex items-center gap-1 text-sm font-semibold text-[#5a8c5c] mb-2">
            <Target className="w-4 h-4" aria-hidden="true" /> Strengths
          </p>
          <BadgeList skills={strengths} color="#3d6e3f" bgColor="#e0ede1" />
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            These areas are going really well! Continued practice will keep them strong.
          </p>
        </div>
      )}

      {/* ---- Challenges (framed positively) ---- */}
      {challenges.length > 0 && (
        <div className="mb-4">
          <p className="flex items-center gap-1 text-sm font-semibold text-amber-700 mb-2">
            <Lightbulb className="w-4 h-4" aria-hidden="true" /> Working On
          </p>
          <BadgeList skills={challenges} color="#92690e" bgColor="#fef3c7" />
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            These skills are improving with practice — progress is what matters most!
          </p>
        </div>
      )}

      {/* ---- Emerging ---- */}
      {emerging.length > 0 && (
        <div>
          <p className="flex items-center gap-1 text-sm font-semibold text-[#9db4a0] mb-2">
            <Sparkles className="w-4 h-4" aria-hidden="true" /> Just Getting Started
          </p>
          <BadgeList skills={emerging} color="#5a8c5c" bgColor="#f0f7f0" />
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            Brand-new areas — every expert started as a beginner!
          </p>
        </div>
      )}
    </div>
  );
}

export default StrengthsChallengesReport;
