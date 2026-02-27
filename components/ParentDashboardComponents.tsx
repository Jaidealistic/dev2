/**
 * PARENT DASHBOARD COMPONENTS
 * 
 * Reusable components for parent dashboard:
 * - Progress Summary Card
 * - Strengths & Challenges Snapshot
 * - Time Spent Tracker
 * - Missed Session Alert
 * - Suggested Activities Card
 */

'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  Lightbulb,
  Target,
  CheckCircle,
  Star
} from 'lucide-react';

interface Child {
  id: string;
  name: string;
  avatar: string;
}

interface ProgressSummaryProps {
  child: Child;
  period: 'daily' | 'weekly';
  stats: {
    lessonsCompleted: number;
    timeSpent: number; // minutes
    averageScore: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export function ProgressSummaryCard({ child, period, stats }: ProgressSummaryProps) {
  const trendIcon = stats.trend === 'up' ? TrendingUp : stats.trend === 'down' ? TrendingDown : Target;
  const trendColor = stats.trend === 'up' ? 'text-green-600' : stats.trend === 'down' ? 'text-orange-600' : 'text-gray-600';
  const periodLabel = period === 'daily' ? 'Today' : 'This Week';

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#9db4a0] flex items-center justify-center text-white text-lg font-bold">
            {child.avatar}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{child.name}</h3>
            <p className="text-sm text-gray-600">{periodLabel}'s Progress</p>
          </div>
        </div>
        {React.createElement(trendIcon, { className: `w-8 h-8 ${trendColor}` })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-[#f0f7f0] rounded-2xl">
          <p className="text-3xl font-bold text-gray-900">{stats.lessonsCompleted}</p>
          <p className="text-sm text-gray-600">Lessons</p>
        </div>
        <div className="text-center p-4 bg-[#f0f7f0] rounded-2xl">
          <p className="text-3xl font-bold text-gray-900">{stats.timeSpent}m</p>
          <p className="text-sm text-gray-600">Time</p>
        </div>
        <div className="text-center p-4 bg-[#f0f7f0] rounded-2xl">
          <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
          <p className="text-sm text-gray-600">Score</p>
        </div>
      </div>
    </div>
  );
}

interface StrengthsChallengesProps {
  child: Child;
  strengths: string[];
  challenges: string[];
}

export function StrengthsChallengesSnapshot({ child, strengths, challenges }: StrengthsChallengesProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {child.name}'s Strengths & Challenges
      </h3>

      {/* Strengths */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-green-600" aria-hidden="true" />
          <h4 className="font-semibold text-gray-900">Strengths</h4>
        </div>
        <div className="space-y-2">
          {strengths.map((strength, idx) => (
            <div key={idx} className="flex items-start gap-2 p-3 bg-green-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-gray-800">{strength}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-orange-600" aria-hidden="true" />
          <h4 className="font-semibold text-gray-900">Areas to Work On</h4>
        </div>
        <div className="space-y-2">
          {challenges.map((challenge, idx) => (
            <div key={idx} className="flex items-start gap-2 p-3 bg-orange-50 rounded-xl">
              <Target className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-gray-800">{challenge}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface TimeTrackerProps {
  child: Child;
  timeSpent: number; // minutes this week
  recommended: number; // recommended minutes per week
}

export function TimeSpentTracker({ child, timeSpent, recommended }: TimeTrackerProps) {
  const percentage = Math.min((timeSpent / recommended) * 100, 100);
  const isOnTrack = timeSpent >= recommended;
  const remaining = recommended - timeSpent;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{child.name}'s Time</h3>
          <p className="text-sm text-gray-600">This week</p>
        </div>
        <Clock className="w-8 h-8 text-[#9db4a0]" aria-hidden="true" />
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-semibold text-gray-900">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all ${
              isOnTrack ? 'bg-green-500' : 'bg-orange-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-[#f0f7f0] rounded-2xl">
          <p className="text-sm text-gray-600 mb-1">Time Spent</p>
          <p className="text-2xl font-bold text-gray-900">{timeSpent} min</p>
        </div>
        <div className="p-4 bg-[#f0f7f0] rounded-2xl">
          <p className="text-sm text-gray-600 mb-1">{isOnTrack ? 'Extra Time' : 'Remaining'}</p>
          <p className="text-2xl font-bold text-gray-900">
            {isOnTrack ? `+${timeSpent - recommended}` : remaining} min
          </p>
        </div>
      </div>

      {/* Status Message */}
      <div className={`mt-4 p-4 rounded-2xl ${
        isOnTrack ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'
      }`}>
        <p className={`text-sm font-medium ${
          isOnTrack ? 'text-green-900' : 'text-orange-900'
        }`}>
          {isOnTrack 
            ? `🎉 ${child.name} met this week's goal!` 
            : `${remaining} minutes more to reach this week's goal`
          }
        </p>
      </div>
    </div>
  );
}

interface MissedSessionAlertProps {
  child: Child;
  missedDays: number;
  lastActivity: string; // e.g., "3 days ago"
  scheduledTime?: string;
}

export function MissedSessionAlert({ child, missedDays, lastActivity, scheduledTime }: MissedSessionAlertProps) {
  if (missedDays === 0) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl p-6 shadow-sm border-2 border-orange-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-orange-600" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {child.name} hasn't practiced recently
          </h3>
          <p className="text-gray-700 mb-3">
            Last activity: <span className="font-semibold">{lastActivity}</span>
            {missedDays > 1 && ` (${missedDays} days ago)`}
          </p>
          {scheduledTime && (
            <p className="text-sm text-gray-600 mb-4">
              📅 Scheduled learning time: {scheduledTime}
            </p>
          )}
          <Link
            href={`/parent/children/${child.id}/encourage`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium text-sm"
          >
            Send Encouragement
          </Link>
        </div>
      </div>
    </div>
  );
}

interface SuggestedActivity {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  difficulty: 'easy' | 'medium' | 'challenging';
  type: 'speaking' | 'listening' | 'reading' | 'writing' | 'game';
}

interface SuggestedActivitiesProps {
  child: Child;
  activities: SuggestedActivity[];
}

export function SuggestedActivitiesCard({ child, activities }: SuggestedActivitiesProps) {
  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    challenging: 'bg-orange-100 text-orange-700',
  };

  const typeIcons: { [key: string]: string } = {
    speaking: '🗣️',
    listening: '👂',
    reading: '📖',
    writing: '✍️',
    game: '🎮',
  };

  return (
    <div className="bg-gradient-to-br from-[#f0f7f0] to-[#e0ede1] rounded-3xl p-6 shadow-sm border-2 border-[#c5d8c7]">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="w-7 h-7 text-blue-600" aria-hidden="true" />
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Home Activities for {child.name}
          </h3>
          <p className="text-sm text-gray-600">Based on recent learning</p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-2xl p-5 border border-blue-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{typeIcons[activity.type]}</span>
                <div>
                  <h4 className="font-bold text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[activity.difficulty]}`}>
                  {activity.difficulty}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span>{activity.duration} min</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-medium">
                Start Activity
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
