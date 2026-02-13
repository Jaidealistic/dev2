'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getParentDashboard, getToken, logout } from '@/lib/api';
import { Users, BookOpen, Clock, Flame, Award, LogOut, UserPlus, GraduationCap } from 'lucide-react';

interface ChildData {
  studentId: string;
  name: string;
  gradeLevel: string;
  currentStreak: number;
  totalLessons: number;
  completedLessons: number;
  goalProgress: number;
  wordsLearned: number;
  learningLanguages: string[];
  recentActivity: string;
  lastActive: string;
}

interface DashData {
  parentName: string;
  children: ChildData[];
  weeklyReport: { totalMinutes: number; lessonsCompleted: number; newWordsLearned: number };
}

export default function ParentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) { router.push('/login'); return; }
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const result = await getParentDashboard();
    setLoading(false);
    if ('error' in result) { setError(result.error); return; }
    setData(result);
  }

  const handleLogout = () => { logout(); router.push('/login'); };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] via-[#f0ede6] to-[#e8e4db] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[#7da47f] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] via-[#f0ede6] to-[#e8e4db] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Failed to load dashboard'}</p>
          <button onClick={fetchData} className="px-6 py-2.5 bg-[#7da47f] text-white rounded-xl hover:bg-[#6b946d] transition-all">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] via-[#f0ede6] to-[#e8e4db]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#f0ede6]/80 backdrop-blur-md border-b border-[#d6ddd7]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Parent Dashboard</h1>
              <p className="text-xs text-slate-400">Welcome, {data.parentName}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Weekly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 rounded-2xl p-5 border border-[#d6ddd7] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f0f7f0] rounded-xl flex items-center justify-center"><Clock className="w-5 h-5 text-[#5a8c5c]" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{data.weeklyReport.totalMinutes}</p>
                <p className="text-xs text-slate-400">Minutes Practiced</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 rounded-2xl p-5 border border-[#d6ddd7] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f0f7f0] rounded-xl flex items-center justify-center"><GraduationCap className="w-5 h-5 text-[#7da47f]" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{data.weeklyReport.lessonsCompleted}</p>
                <p className="text-xs text-slate-400">Lessons Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 rounded-2xl p-5 border border-[#d6ddd7] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f0f7f0] rounded-xl flex items-center justify-center"><Award className="w-5 h-5 text-[#5a8c5c]" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{data.weeklyReport.newWordsLearned}</p>
                <p className="text-xs text-slate-400">Words Learned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            <Users className="w-5 h-5 inline mr-2 text-[#5a8c5c]" />
            My Children ({data.children.length})
          </h2>
          <Link
            href="/parent/onboarding"
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-[#5a8c5c] hover:bg-[#f0f7f0] rounded-xl transition-all font-medium"
          >
            <UserPlus className="w-4 h-4" /> Link More
          </Link>
        </div>

        {data.children.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-12 border border-[#d6ddd7] shadow-sm text-center">
            <Users className="w-16 h-16 mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No children linked yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              Ask your child for their Student ID (e.g., LXF-A3K9) after they complete their onboarding.
            </p>
            <Link href="/parent/onboarding" className="inline-flex items-center gap-2 px-6 py-3 bg-[#7da47f] text-white font-semibold rounded-xl hover:bg-[#6b946d] transition-all">
              <UserPlus className="w-4 h-4" /> Link a Child
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {data.children.map((child) => (
              <div key={child.studentId} className="bg-white/80 rounded-2xl p-6 border border-[#d6ddd7] shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#f0f7f0] rounded-xl flex items-center justify-center text-[#5a8c5c] font-bold text-lg">
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{child.name}</h3>
                      <p className="text-xs text-slate-400">
                        <span className="font-mono">{child.studentId}</span>
                        {child.gradeLevel && ` • ${child.gradeLevel}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 rounded-lg">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold text-orange-600">{child.currentStreak} day streak</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-500">Overall Progress</span>
                    <span className="font-semibold text-slate-700">{child.goalProgress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#7da47f] to-[#5a8c5c] rounded-full transition-all" style={{ width: `${child.goalProgress}%` }} />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">{child.completedLessons}/{child.totalLessons}</p>
                    <p className="text-xs text-slate-400">Lessons</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">{child.wordsLearned}</p>
                    <p className="text-xs text-slate-400">Words Learned</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-lg font-bold text-slate-900">{child.learningLanguages.length}</p>
                    <p className="text-xs text-slate-400">Languages</p>
                  </div>
                </div>

                {/* Languages */}
                <div className="mt-3 flex gap-2">
                  {child.learningLanguages.map((lang) => (
                    <span key={lang} className="px-3 py-1 bg-[#f0f7f0] text-[#5a8c5c] text-xs font-medium rounded-lg">{lang}</span>
                  ))}
                </div>

                {/* Recent activity */}
                <p className="mt-3 text-xs text-slate-400">{child.recentActivity}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}