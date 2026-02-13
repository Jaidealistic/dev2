/**
 * SESSION END SUMMARY PAGE
 * 
 * Displays after lesson completion with:
 * - Strength-based summary (what went well)
 * - Optional badge/reward (low stimulation)
 * - What's next preview
 * - Progress automatically saved
 * - Encouragement message
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Award, 
  TrendingUp, 
  Clock, 
  Target, 
  Sparkles, 
  ChevronRight, 
  Home,
  BookOpen,
  Star
} from 'lucide-react';

interface LessonSummary {
  lessonId: string;
  lessonTitle: string;
  score: number;
  duration: number; // seconds
  sectionsCompleted: number;
  totalSections: number;
  strengths: string[];
  newBadges: {
    id: string;
    name: string;
    icon: string;
    description: string;
  }[];
  nextLesson?: {
    id: string;
    title: string;
    description: string;
    estimatedDuration: number;
  };
  encouragementMessage: string;
}

export default function LessonCompletePage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;

  const [summary, setSummary] = useState<LessonSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);

  useEffect(() => {
    loadSummary();
  }, [lessonId]);

  useEffect(() => {
    if (summary && summary.newBadges.length > 0) {
      // Trigger badge animation after brief delay
      setTimeout(() => {
        setShowBadgeAnimation(true);
      }, 500);
    }
  }, [summary]);

  async function loadSummary() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/learner/lessons/${lessonId}/summary`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load summary');
      }

      const data = await response.json();
      
      // Mock data for now
      const mockSummary: LessonSummary = {
        lessonId,
        lessonTitle: 'Spanish Greetings',
        score: 85,
        duration: 1260, // 21 minutes
        sectionsCompleted: 5,
        totalSections: 5,
        strengths: [
          'Excellent pronunciation of "Buenos días"',
          'Quick recognition of greeting vocabulary',
          'Strong performance on listening comprehension',
          'Confident participation in speech practice'
        ],
        newBadges: [
          {
            id: 'first-lesson',
            name: 'First Steps',
            icon: '🎓',
            description: 'Completed your first lesson!'
          }
        ],
        nextLesson: {
          id: 'lesson-2',
          title: 'Introducing Yourself',
          description: 'Learn how to introduce yourself and ask others their names in Spanish.',
          estimatedDuration: 15
        },
        encouragementMessage: 'You showed great persistence today! Your pronunciation is improving with each practice session.'
      };

      setSummary(mockSummary);
    } catch (error) {
      console.error('Error loading summary:', error);
      alert('Failed to load lesson summary. Redirecting to dashboard...');
      router.push('/learner/dashboard');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f1eb]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#9db4a0] border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const minutes = Math.floor(summary.duration / 60);
  const seconds = summary.duration % 60;
  const scorePercentage = summary.score;

  return (
    <div className="min-h-screen bg-[#f5f1eb] py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Celebration Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <Sparkles className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Lesson Complete! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            {summary.lessonTitle}
          </p>
        </div>

        {/* Encouragement Message */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-3xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <Star className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Great Job Today!
              </h2>
              <p className="text-lg text-gray-700">
                {summary.encouragementMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Score */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-[#9db4a0]" />
              <p className="text-sm font-medium text-gray-600">Score</p>
            </div>
            <p className="text-4xl font-bold text-gray-900">{scorePercentage}%</p>
          </div>

          {/* Time Spent */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-[#9db4a0]" />
              <p className="text-sm font-medium text-gray-600">Time Spent</p>
            </div>
            <p className="text-4xl font-bold text-gray-900">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
          </div>

          {/* Sections Completed */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-[#9db4a0]" />
              <p className="text-sm font-medium text-gray-600">Sections</p>
            </div>
            <p className="text-4xl font-bold text-gray-900">
              {summary.sectionsCompleted}/{summary.totalSections}
            </p>
          </div>
        </div>

        {/* Strengths - What Went Well */}
        <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-7 h-7 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">What You Did Well</h2>
          </div>
          <div className="space-y-3">
            {summary.strengths.map((strength, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-green-50 rounded-2xl border border-green-200">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  ✓
                </div>
                <p className="text-lg text-gray-800 pt-1">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Badges - Optional, Low Stimulation */}
        {summary.newBadges.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 border-2 border-yellow-200 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-7 h-7 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">New Badge Earned</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summary.newBadges.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`bg-white rounded-2xl p-6 border-2 border-yellow-300 transition-all duration-500 ${
                    showBadgeAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-3">{badge.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{badge.name}</h3>
                    <p className="text-gray-600">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's Next */}
        {summary.nextLesson && (
          <div className="bg-gradient-to-r from-[#9db4a0] to-[#7a8c77] rounded-3xl p-8 text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">What's Next?</h2>
            <div className="bg-white bg-opacity-20 rounded-2xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{summary.nextLesson.title}</h3>
                  <p className="text-white text-opacity-90 mb-3">{summary.nextLesson.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{summary.nextLesson.estimatedDuration} minutes</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/learner/lessons/${summary.nextLesson!.id}`)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-[#9db4a0] rounded-full font-bold hover:bg-opacity-90 transition-all flex-shrink-0"
                >
                  Start Now
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/learner/dashboard')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 rounded-full font-bold text-gray-700 hover:bg-gray-50 transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
          
          {summary.nextLesson && (
            <button
              onClick={() => router.push(`/learner/lessons/${summary.nextLesson!.id}`)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#9db4a0] hover:bg-[#8ca394] text-white rounded-full font-bold transition-all"
            >
              Continue Learning
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
