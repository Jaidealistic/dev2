/**
 * HOMESCHOOL HUB - Parent Teaching Dashboard
 * 
 * Features from homeschool_support_documentation.md:
 * - Weekly schedule view for all children
 * - Lesson planning and management
 * - Teaching guides and resources
 * - Portfolio documentation
 * - NIOS compliance tracking
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AccessibilityToolbar } from '@/components/AccessibilityToolbar';
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  FileText,
  Download,
  Play,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function HomeschoolHub() {
  const router = useRouter();
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(getMonday(new Date()));

  useEffect(() => {
    fetchSchedule();
  }, [currentWeek]);

  async function fetchSchedule() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const weekStr = currentWeek.toISOString().split('T')[0];
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parent/homeschool/schedule?week=${weekStr}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch schedule');
      }

      const data = await response.json();
      setScheduleData(data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function changeWeek(delta: number) {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (delta * 7));
    setCurrentWeek(newDate);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f1eb]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#9db4a0] border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Homeschool Hub</h1>
              <p className="text-gray-600">Manage your homeschool schedule and teaching</p>
            </div>
            <Link
              href="/parent/dashboard"
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-full font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <button className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <BookOpen className="w-8 h-8 text-[#9db4a0] mb-3" aria-hidden="true" />
            <h3 className="font-bold text-gray-900 mb-1">Teaching Guides</h3>
            <p className="text-sm text-gray-600">Access lesson plans</p>
          </button>

          <button className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <FileText className="w-8 h-8 text-blue-500 mb-3" aria-hidden="true" />
            <h3 className="font-bold text-gray-900 mb-1">Portfolio</h3>
            <p className="text-sm text-gray-600">Document progress</p>
          </button>

          <button className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <Download className="w-8 h-8 text-green-500 mb-3" aria-hidden="true" />
            <h3 className="font-bold text-gray-900 mb-1">Resources</h3>
            <p className="text-sm text-gray-600">Printables & materials</p>
          </button>

          <button className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow">
            <Users className="w-8 h-8 text-[#7da47f] mb-3" aria-hidden="true" />
            <h3 className="font-bold text-gray-900 mb-1">Co-op</h3>
            <p className="text-sm text-gray-600">Community groups</p>
          </button>
        </div>

        {/* Weekly Schedule */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-7 h-7 text-[#9db4a0]" aria-hidden="true" />
              Weekly Schedule
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => changeWeek(-1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-medium"
              >
                ← Previous Week
              </button>
              <span className="font-medium text-gray-700">
                {currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} -{' '}
                {new Date(currentWeek.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <button
                onClick={() => changeWeek(1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-medium"
              >
                Next Week →
              </button>
            </div>
          </div>

          {/* Schedule Grid */}
          {scheduleData && scheduleData.schedule && scheduleData.schedule.length > 0 ? (
            <div className="space-y-6">
              {scheduleData.schedule.map((childSchedule: any) => (
                <div key={childSchedule.childId} className="border-2 border-gray-200 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {childSchedule.childName}
                  </h3>

                  {childSchedule.lessons.length > 0 ? (
                    <div className="space-y-3">
                      {childSchedule.lessons.map((lesson: any) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between bg-gray-50 rounded-xl p-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#9db4a0] rounded-full flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white" aria-hidden="true" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Lesson #{lesson.lessonId}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(lesson.scheduledDate).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
                            ) : (
                              <button className="px-4 py-2 bg-[#9db4a0] hover:bg-[#8ca394] text-white rounded-full text-sm font-medium">
                                <Play className="w-4 h-4 inline mr-1" aria-hidden="true" />
                                Start Teaching
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" aria-hidden="true" />
                      <p className="text-gray-600">No lessons scheduled this week</p>
                      <button className="mt-4 px-6 py-2 bg-[#9db4a0] hover:bg-[#8ca394] text-white rounded-full font-medium">
                        Schedule Lessons
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
              <p className="text-lg text-gray-600 mb-4">No children linked yet</p>
              <Link
                href="/parent/children/link"
                className="inline-block px-6 py-3 bg-[#9db4a0] hover:bg-[#8ca394] text-white rounded-full font-medium"
              >
                Link a Child
              </Link>
            </div>
          )}
        </div>

        {/* Teaching Resources */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Teaching Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Start with engagement</p>
                  <p className="text-sm text-gray-600">Begin each lesson with a hook to capture interest</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Take breaks</p>
                  <p className="text-sm text-gray-600">15-minute sessions work best for learners with ADHD</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Use multi-sensory approaches</p>
                  <p className="text-sm text-gray-600">Combine visual, auditory, and kinesthetic activities</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Training</h3>
            <div className="space-y-3">
              <div className="border-2 border-gray-200 rounded-xl p-4">
                <p className="font-medium text-gray-900 mb-1">Teaching Reading with Dyslexia</p>
                <p className="text-sm text-gray-600 mb-2">Live workshop - March 15, 2026</p>
                <button className="text-sm text-[#9db4a0] hover:text-[#8ca394] font-medium">
                  Register →
                </button>
              </div>
              <div className="border-2 border-gray-200 rounded-xl p-4">
                <p className="font-medium text-gray-900 mb-1">ADHD-Friendly Schedules</p>
                <p className="text-sm text-gray-600 mb-2">Video course - 4 modules</p>
                <button className="text-sm text-[#9db4a0] hover:text-[#8ca394] font-medium">
                  Start Course →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Accessibility Toolbar */}
      <AccessibilityToolbar />
    </div>
  );
}
