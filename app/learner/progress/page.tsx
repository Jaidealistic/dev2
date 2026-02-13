/**
 * LEARNER PROGRESS PAGE
 * 
 * Detailed progress analytics showing:
 * - Overall statistics (total time, avg score, lessons completed)
 * - Lesson-by-lesson progress table
 * - Competency tracking
 * - Visual progress charts
 * 
 * Accessibility: WCAG AAA compliant
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AccessibilityToolbar } from '@/components/AccessibilityToolbar';
import {
  TrendingUp,
  Clock,
  Target,
  Award,
  BookOpen,
  ArrowLeft,
  BarChart3,
  CheckCircle,
  Star,
  Loader2,
  Calendar,
} from 'lucide-react';

interface ProgressData {
  competencies: any[];
  lessonProgress: any[];
  analytics: {
    totalTime: number;
    avgScore: number;
    totalLessons: number;
    masteredLessons: number;
  };
}

export default function ProgressPage() {
  const router = useRouter();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'competencies'>('overview');

  useEffect(() => {
    fetchProgress();
  }, []);

  async function fetchProgress() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/learner/progress`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch progress');

      const data = await response.json();
      setProgressData(data);
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError('Failed to load progress data.');
    } finally {
      setIsLoading(false);
    }
  }

  function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f1eb]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-[#9db4a0] mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const analytics = progressData?.analytics || { totalTime: 0, avgScore: 0, totalLessons: 0, masteredLessons: 0 };
  const lessonProgress = progressData?.lessonProgress || [];
  const competencies = progressData?.competencies || [];

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Header */}
      <header role="banner" className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">Lexfix</Link>
          <nav role="navigation" aria-label="Main navigation" className="flex gap-6">
            <Link href="/learner/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</Link>
            <Link href="/learner/lessons" className="text-gray-700 hover:text-gray-900 font-medium">My Lessons</Link>
            <Link href="/learner/progress" className="text-[#9db4a0] hover:text-[#8ca394] font-medium" aria-current="page">Progress</Link>
            <Link href="/learner/settings" className="text-gray-700 hover:text-gray-900 font-medium">Settings</Link>
            <Link href="/logout" className="text-gray-700 hover:text-gray-900 font-medium">Logout</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8" role="main">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/learner/dashboard" className="p-2 rounded-full hover:bg-gray-200" aria-label="Back to dashboard">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
            <p className="text-gray-600 mt-1">Track your learning journey and achievements</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 text-center">
            <p className="text-red-700 text-lg mb-4">{error}</p>
            <button onClick={fetchProgress} className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700">
              Try Again
            </button>
          </div>
        )}

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-gray-600 font-medium">Total Lessons</span>
            </div>
            <p className="text-4xl font-bold text-gray-900">{analytics.totalLessons}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-gray-600 font-medium">Mastered</span>
            </div>
            <p className="text-4xl font-bold text-yellow-600">{analytics.masteredLessons}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-gray-600 font-medium">Avg Score</span>
            </div>
            <p className="text-4xl font-bold text-green-600">{analytics.avgScore}%</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#f0f7f0] p-3 rounded-full">
                <Clock className="w-6 h-6 text-[#5a8c5c]" />
              </div>
              <span className="text-gray-600 font-medium">Total Time</span>
            </div>
            <p className="text-4xl font-bold text-[#5a8c5c]">{formatDuration(analytics.totalTime)}</p>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#9db4a0]" />
            Overall Progress
          </h2>
          <div className="space-y-4">
            {/* Mastery Rate */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Mastery Rate</span>
                <span className="font-medium">
                  {analytics.totalLessons > 0 ? Math.round((analytics.masteredLessons / analytics.totalLessons) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all"
                  style={{ width: `${analytics.totalLessons > 0 ? (analytics.masteredLessons / analytics.totalLessons) * 100 : 0}%` }}
                  role="progressbar"
                  aria-valuenow={analytics.totalLessons > 0 ? Math.round((analytics.masteredLessons / analytics.totalLessons) * 100) : 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Mastery rate"
                />
              </div>
            </div>

            {/* Average Score */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Average Score</span>
                <span className="font-medium">{analytics.avgScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-[#9db4a0] to-[#6b9d6b] transition-all"
                  style={{ width: `${analytics.avgScore}%` }}
                  role="progressbar"
                  aria-valuenow={analytics.avgScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Average score"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6" role="tablist">
          {[
            { id: 'overview', label: 'Recent Activity', icon: TrendingUp },
            { id: 'lessons', label: 'All Lessons', icon: BookOpen },
            { id: 'competencies', label: 'Competencies', icon: Award },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#9db4a0] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div role="tabpanel">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              {lessonProgress.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-500">No activity yet. Start your first lesson!</p>
                  <Link
                    href="/learner/lessons"
                    className="inline-block mt-4 px-6 py-3 bg-[#9db4a0] text-white rounded-full hover:bg-[#8ca394]"
                  >
                    Browse Lessons
                  </Link>
                </div>
              ) : (
                lessonProgress.slice(0, 10).map((progress: any, idx: number) => (
                  <div key={progress.id || idx} className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        progress.status === 'MASTERED' ? 'bg-yellow-100' :
                        progress.status === 'COMPLETED' ? 'bg-green-100' :
                        'bg-blue-100'
                      }`}>
                        {progress.status === 'MASTERED' ? <Star className="w-5 h-5 text-yellow-600" /> :
                         progress.status === 'COMPLETED' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                         <BookOpen className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Lesson: {progress.lessonId}</p>
                        <div className="flex gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Score: {progress.score || 0}%
                          </span>
                          {progress.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDuration(progress.duration)}
                            </span>
                          )}
                          {progress.lastAccessedAt && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(progress.lastAccessedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      progress.status === 'MASTERED' ? 'bg-yellow-100 text-yellow-700' :
                      progress.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      progress.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {progress.status?.replace('_', ' ') || 'Unknown'}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'lessons' && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Lesson</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Score</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Attempts</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {lessonProgress.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No lessons attempted yet.
                      </td>
                    </tr>
                  ) : (
                    lessonProgress.map((progress: any, idx: number) => (
                      <tr key={progress.id || idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Link href={`/learner/lessons/${progress.lessonId}`} className="text-[#9db4a0] hover:text-[#8ca394] font-medium">
                            {progress.lessonId}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            progress.status === 'MASTERED' ? 'bg-yellow-100 text-yellow-700' :
                            progress.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                            progress.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {progress.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium">{progress.score || 0}%</td>
                        <td className="px-6 py-4">{progress.attemptCount || 1}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {progress.lastAccessedAt ? formatDate(progress.lastAccessedAt) : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'competencies' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Competency Tracking</h2>
              {competencies.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-500">Competencies will appear as you complete lessons.</p>
                </div>
              ) : (
                competencies.map((comp: any, idx: number) => (
                  <div key={comp.id || idx} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900">{comp.competencyName || comp.skill || `Competency ${idx + 1}`}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        comp.masteryLevel === 'MASTERED' ? 'bg-yellow-100 text-yellow-700' :
                        comp.masteryLevel === 'PROFICIENT' ? 'bg-green-100 text-green-700' :
                        comp.masteryLevel === 'DEVELOPING' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {comp.masteryLevel || 'In Progress'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-[#9db4a0] to-[#6b9d6b]"
                        style={{ width: `${comp.score || comp.progress || 0}%` }}
                        role="progressbar"
                        aria-valuenow={comp.score || comp.progress || 0}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <AccessibilityToolbar />
    </div>
  );
}
