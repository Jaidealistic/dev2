/**
 * CHILD PROGRESS CARD
 *
 * A compact card showing a single linked child's learning overview,
 * designed for the parent dashboard (supports multiple children).
 *
 * Features:
 * - Avatar / initials circle
 * - Overall progress percentage with ring
 * - Lessons completed / total
 * - Current streak
 * - Recent activity summary
 * - Quick link to detailed child view
 *
 * Used by: Parent dashboard, parent/family
 */

'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Flame,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChildProgress {
  childId: string;
  name: string;
  avatar?: string;          // URL – falls back to initials
  overallProgress: number;  // 0 – 100
  lessonsCompleted: number;
  lessonsTotal: number;
  streak: number;           // days
  lastActive?: string;      // ISO date or relative text
  trend: 'up' | 'stable' | 'down';
}

interface ChildProgressCardProps {
  child: ChildProgress;
  /** Where the "View details" link goes */
  detailsHref?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function progressRingStyle(pct: number) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  return {
    strokeDasharray: `${circ}`,
    strokeDashoffset: `${circ - (circ * pct) / 100}`,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChildProgressCard({ child, detailsHref }: ChildProgressCardProps) {
  const href = detailsHref ?? `/parent/family/${child.childId}`;

  return (
    <div className="p-5 bg-white/80 border border-[#d6ddd7] rounded-2xl hover:border-[#c5d8c7] transition-colors">
      <div className="flex items-start gap-4">
        {/* Avatar with progress ring */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            {/* Background ring */}
            <circle
              cx="40" cy="40" r="36"
              fill="none" stroke="#e5e7eb" strokeWidth="4"
            />
            {/* Progress ring */}
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="#7da47f"
              strokeWidth="4"
              strokeLinecap="round"
              style={progressRingStyle(child.overallProgress)}
              className="transition-all duration-700"
            />
          </svg>
          {/* Center avatar / initials */}
          <div className="absolute inset-0 flex items-center justify-center">
            {child.avatar ? (
              <img
                src={child.avatar}
                alt={child.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#e0ede1] flex items-center justify-center">
                <span className="text-lg font-bold text-[#5a8c5c]">
                  {initials(child.name)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900 truncate">{child.name}</h4>
            {child.trend === 'up' && (
              <TrendingUp className="w-4 h-4 text-[#5a8c5c]" aria-hidden="true" />
            )}
          </div>

          <p className="text-2xl font-bold text-[#5a8c5c] mt-0.5">
            {child.overallProgress}%
            <span className="text-xs font-normal text-gray-500 ml-1">overall</span>
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#7da47f]" aria-hidden="true" />
              {child.lessonsCompleted}/{child.lessonsTotal} lessons
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
              {child.streak}-day streak
            </span>
          </div>

          {child.lastActive && (
            <p className="text-xs text-gray-400 mt-1">Last active: {child.lastActive}</p>
          )}
        </div>
      </div>

      {/* Quick link */}
      <Link
        href={href}
        className="mt-4 flex items-center justify-center gap-1 w-full py-2 text-sm font-medium text-[#5a8c5c] hover:text-[#4a7c4c] bg-[#f0f7f0] hover:bg-[#e0ede1] rounded-lg transition-colors"
      >
        View details <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default ChildProgressCard;
