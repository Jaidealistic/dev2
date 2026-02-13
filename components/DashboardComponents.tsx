/**
 * LEARNER DASHBOARD ENHANCEMENTS
 * Components for motivation, break reminders, and resume functionality
 */

import { useState, useEffect } from 'react';
import { Brain, Coffee, Award, Zap, ChevronRight } from 'lucide-react';

interface BreakReminderProps {
  minutesSinceLastBreak?: number;
  userHasADHD?: boolean;
}

export function BreakReminder({ minutesSinceLastBreak = 45, userHasADHD = false }: BreakReminderProps) {
  const [isVisible, setIsVisible] = useState(userHasADHD && minutesSinceLastBreak > 30);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-[#f0f7f0] to-[#e0ede1] border-2 border-[#c5d8c7] rounded-2xl p-6 mb-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
          <Coffee className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Time for a break! ☕</h3>
          <p className="text-gray-700 mb-3">
            You've been learning for {minutesSinceLastBreak} minutes. Take a 5-10 minute break to recharge your brain!
          </p>
          <p className="text-sm text-gray-600">💡 Stretch, get water, step outside—whatever helps you refresh.</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-1"
          aria-label="Dismiss break reminder"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

interface EncouragementMessageProps {
  learnerName?: string;
  currentStreak?: number;
  totalLessonsCompleted?: number;
  strengths?: string[];
}

export function EncouragementMessage({
  learnerName = 'Learner',
  currentStreak = 0,
  totalLessonsCompleted = 0,
  strengths = [],
}: EncouragementMessageProps) {
  const encouragementMessages = [
    `${learnerName}, you're doing amazing! Keep that streak going! 🚀`,
    `Great work on your ${currentStreak} day streak! That takes dedication! 💪`,
    `You've completed ${totalLessonsCompleted} lessons—that's incredible progress! 🎉`,
    strengths.length > 0 ? `Your strength in ${strengths[0]} is showing! Keep building on that! ⭐` : `Every lesson brings you closer to fluency! 🌟`,
    `You're crushing it today, ${learnerName}! Let's keep this momentum! 🔥`,
  ];

  const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <Award className="w-6 h-6 text-green-600 flex-shrink-0" />
        <p className="text-lg font-semibold text-gray-900">{randomMessage}</p>
      </div>
    </div>
  );
}

interface ProgressRingProps {
  progress: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({ progress, total, size = 120, strokeWidth = 6 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / total) * circumference;
  const percentage = Math.round((progress / total) * 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          role="img"
          aria-label={`Progress ring: ${percentage}% complete`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#9db4a0"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
          <div className="text-xs text-gray-600">Progress</div>
        </div>
      </div>
      <p className="text-sm text-gray-600 text-center">
        {progress} of {total} lessons completed
      </p>
    </div>
  );
}

interface ResumeLessonProps {
  lastLesson?: {
    id: string;
    title: string;
    progress: number;
    language: string;
  };
  onResume?: () => void;
}

export function ResumeLessonCard({ lastLesson, onResume }: ResumeLessonProps) {
  if (!lastLesson) return null;

  return (
    <div className="bg-gradient-to-r from-[#f0f7f0] to-[#e0ede1] border-2 border-[#c5d8c7] rounded-3xl p-6 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-[#5a8c5c]" />
            <p className="text-sm font-semibold text-[#5a8c5c] uppercase">RESUME</p>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{lastLesson.title}</h3>
          <p className="text-gray-600 mb-3">{lastLesson.language} • {lastLesson.progress}% complete</p>
          
          {/* Progress bar */}
          <div className="w-full bg-white bg-opacity-50 rounded-full h-2 mb-3">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[#7da47f] to-[#5a8c5c]"
              style={{ width: `${lastLesson.progress}%` }}
              role="progressbar"
              aria-valuenow={lastLesson.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          
          <p className="text-sm text-gray-700">
            Pick up where you left off and keep your momentum going!
          </p>
        </div>
        
        <button
          onClick={onResume}
          className="bg-white text-[#5a8c5c] font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 flex-shrink-0"
          aria-label={`Resume: ${lastLesson.title}`}
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

interface DailyLessonCardProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    language: string;
    duration: number;
    difficulty: string;
  };
  onStart: () => void;
}

export function DailyLessonCard({ lesson, onStart }: DailyLessonCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#9db4a0] to-[#7a8c77] rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm font-semibold uppercase opacity-90 mb-1">📚 Today's Lesson</p>
          <h2 className="text-3xl font-bold mb-2">{lesson.title}</h2>
          <p className="text-white/90">{lesson.description}</p>
        </div>
        <div className="text-5xl flex-shrink-0">✨</div>
      </div>
      
      <div className="flex gap-4 mb-6 py-4 border-t border-white/30 border-b border-white/30">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <div>
            <p className="text-xs opacity-75">Language</p>
            <p className="font-semibold">{lesson.language}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">⏱️</span>
          <div>
            <p className="text-xs opacity-75">Duration</p>
            <p className="font-semibold">{lesson.duration} min</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <div>
            <p className="text-xs opacity-75">Level</p>
            <p className="font-semibold">{lesson.difficulty}</p>
          </div>
        </div>
      </div>
      
      <button
        onClick={onStart}
        className="w-full bg-white text-[#9db4a0] font-bold py-4 px-6 rounded-full hover:bg-gray-100 transition-colors text-lg"
        aria-label={`Start lesson: ${lesson.title}`}
      >
        Start Lesson Now 🚀
      </button>
    </div>
  );
}
