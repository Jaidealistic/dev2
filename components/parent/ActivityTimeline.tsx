/**
 * ACTIVITY TIMELINE COMPONENT
 *
 * Shows a chronological feed of the child's recent learning activities
 * so parents can follow along without hovering.
 *
 * Features:
 * - Grouped by day (Today / Yesterday / Date)
 * - Activity icons per type (lesson, quiz, practice, achievement)
 * - Relative timestamps ("2 h ago")
 * - Expandable detail on click
 * - "Load more" pagination
 * - Empty state illustration
 *
 * Used by: Parent dashboard
 */

'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  BookOpen,
  Trophy,
  Mic,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  Loader2,
  Calendar,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ActivityEvent {
  id: string;
  type: 'lesson_completed' | 'lesson_started' | 'quiz_taken' | 'pronunciation_practice' | 'achievement_earned';
  title: string;
  description?: string;
  score?: number;
  timestamp: string; // ISO
  childName?: string;
}

interface ActivityTimelineProps {
  /** Pre-loaded activities (if not provided, will fetch from API) */
  activities?: ActivityEvent[];
  /** Maximum events to render initially */
  initialLimit?: number;
  /** Child ID to fetch activities for */
  childId?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TYPE_META: Record<
  ActivityEvent['type'],
  { icon: React.ElementType; label: string; color: string }
> = {
  lesson_completed: { icon: BookOpen, label: 'Lesson completed', color: '#7da47f' },
  lesson_started: { icon: BookOpen, label: 'Lesson started', color: '#9db4a0' },
  quiz_taken: { icon: Trophy, label: 'Quiz taken', color: '#5a8c5c' },
  pronunciation_practice: { icon: Mic, label: 'Pronunciation practice', color: '#7da47f' },
  achievement_earned: { icon: Award, label: 'Achievement earned', color: '#d4a843' },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

// ---------------------------------------------------------------------------
// MOCK DATA (used when API does not have activity data yet)
// ---------------------------------------------------------------------------

function generateMockActivities(): ActivityEvent[] {
  const now = Date.now();
  return [
    {
      id: '1',
      type: 'lesson_completed',
      title: 'Greetings – Hello & Goodbye',
      description: 'Score: 85 / 100. Completed all steps.',
      score: 85,
      timestamp: new Date(now - 1000 * 60 * 45).toISOString(),
    },
    {
      id: '2',
      type: 'pronunciation_practice',
      title: 'Vowel sounds practice',
      description: 'Practised 12 words. Average accuracy: 78 %.',
      score: 78,
      timestamp: new Date(now - 1000 * 60 * 120).toISOString(),
    },
    {
      id: '3',
      type: 'achievement_earned',
      title: 'First Steps Badge',
      description: 'Completed the first lesson!',
      timestamp: new Date(now - 1000 * 60 * 150).toISOString(),
    },
    {
      id: '4',
      type: 'lesson_started',
      title: 'Numbers 1-10',
      timestamp: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
    },
    {
      id: '5',
      type: 'quiz_taken',
      title: 'Colours Quiz',
      description: 'Scored 90 / 100.',
      score: 90,
      timestamp: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
    },
  ];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ActivityTimeline({
  activities: externalActivities,
  initialLimit = 10,
  childId,
}: ActivityTimelineProps) {
  const [activities, setActivities] = useState<ActivityEvent[]>(externalActivities ?? []);
  const [loading, setLoading] = useState(!externalActivities);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (externalActivities) return;
    // Attempt to fetch from API — fall back to mock data
    (async () => {
      try {
        const res = await fetch(
          childId ? `/api/parent/children/${childId}/activities` : '/api/parent/activities',
        );
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities ?? data ?? []);
        } else {
          setActivities(generateMockActivities());
        }
      } catch {
        setActivities(generateMockActivities());
      } finally {
        setLoading(false);
      }
    })();
  }, [childId, externalActivities]);

  // Group by day
  const grouped = useMemo(() => {
    const sorted = [...activities].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    const visible = showAll ? sorted : sorted.slice(0, initialLimit);
    const groups: { label: string; events: ActivityEvent[] }[] = [];
    let currentLabel = '';

    for (const evt of visible) {
      const dl = dayLabel(evt.timestamp);
      if (dl !== currentLabel) {
        currentLabel = dl;
        groups.push({ label: dl, events: [] });
      }
      groups[groups.length - 1].events.push(evt);
    }
    return { groups, total: sorted.length };
  }, [activities, showAll, initialLimit]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="p-6 bg-white/80 border border-[#d6ddd7] rounded-2xl">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#7da47f]" />
          Activity Timeline
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#7da47f]" />
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="p-6 bg-white/80 border border-[#d6ddd7] rounded-2xl text-center">
        <Calendar className="w-10 h-10 text-[#9db4a0] mx-auto mb-2" />
        <p className="font-semibold text-gray-900">No activity yet</p>
        <p className="text-sm text-gray-600 mt-1">
          Activities will appear here once your child starts learning.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/80 border border-[#d6ddd7] rounded-2xl">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#7da47f]" />
        Activity Timeline
      </h3>

      {grouped.groups.map((group) => (
        <div key={group.label} className="mb-4 last:mb-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            {group.label}
          </p>

          <div className="space-y-2">
            {group.events.map((evt) => {
              const meta = TYPE_META[evt.type];
              const Icon = meta.icon;
              const isExpanded = expanded.has(evt.id);

              return (
                <button
                  key={evt.id}
                  onClick={() => toggleExpand(evt.id)}
                  className="w-full text-left p-3 bg-[#f8f6f2] hover:bg-[#f0f7f0] border border-[#d6ddd7] rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${meta.color}22` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: meta.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{evt.title}</p>
                      <p className="text-xs text-gray-500">{meta.label}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {evt.score !== undefined && (
                        <span className="text-xs font-semibold text-[#5a8c5c]">{evt.score}%</span>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {relativeTime(evt.timestamp)}
                      </span>
                      {evt.description && (
                        isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )
                      )}
                    </div>
                  </div>

                  {isExpanded && evt.description && (
                    <p className="text-sm text-gray-600 mt-2 pl-11">{evt.description}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!showAll && grouped.total > initialLimit && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-3 py-2 text-sm font-medium text-[#5a8c5c] hover:text-[#4a7c4c] transition-colors"
        >
          Show all {grouped.total} activities
        </button>
      )}
    </div>
  );
}

export default ActivityTimeline;
