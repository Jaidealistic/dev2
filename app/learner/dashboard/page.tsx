/**
 * LEARNER DASHBOARD — Calm, Therapeutic Design
 *
 * - Balanced two-column layout (equal split)
 * - Per-language tabs: streaks, lessons, progress, milestones separated per language
 * - "+" button to add a new language
 * - Focus Mode: single learning action, reduced elements
 * - WCAG AAA, dyslexia-friendly, ADHD-safe
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getLearnerDashboard,
  addLearnerLanguage,
} from '@/lib/api';
import {
  BookOpen,
  ChevronRight,
  Target,
  Clock,
  CheckCircle,
  Eye,
  EyeOff,
  Globe,
  ArrowRight,
  Plus,
  X,
  Flame,
  Award,
} from 'lucide-react';

export default function LearnerDashboard() {
  const mainRef = useRef<HTMLElement>(null);
  const router = useRouter();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string>('');
  const [focusMode, setFocusMode] = useState(false);
  const [showAddLang, setShowAddLang] = useState(false);
  const [addingLang, setAddingLang] = useState(false);

  useEffect(() => {
    mainRef.current?.focus();
    fetchDashboardData();
    const saved = localStorage.getItem('lexfix-focus-mode');
    if (saved === 'true') setFocusMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('lexfix-focus-mode', String(focusMode));
  }, [focusMode]);

  async function fetchDashboardData() {
    try {
      const result = await getLearnerDashboard();
      if ('error' in result) {
        if (result.error?.includes('Unauthorized')) {
          router.push('/login');
          return;
        }
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }

      const data = result;
      setDashboardData(data);

      // Set initial active language to first learning language
      if (!activeLanguage && data.learningLanguages?.length > 0) {
        setActiveLanguage(data.learningLanguages[0]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('We could not load your dashboard right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddLanguage(language: string) {
    setAddingLang(true);
    try {
      const result = await addLearnerLanguage(language);
      if (!result.success) {
        alert(result.error || 'Could not add language');
        return;
      }
      setShowAddLang(false);
      setActiveLanguage(language);
      await fetchDashboardData();
    } catch (err) {
      console.error('Error adding language:', err);
    } finally {
      setAddingLang(false);
    }
  }

  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#faf9f7]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-[3px] border-[#d4dcd5] border-t-[#7a9b7e] rounded-full animate-spin mx-auto" />
          <p className="text-[#6b6b6b] text-base" style={{ lineHeight: '1.8' }}>
            Loading your learning space...
          </p>
        </div>
      </div>
    );
  }

  /* ─── Error ─── */
  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#faf9f7]">
        <div className="text-center max-w-sm space-y-4">
          <p className="text-[#6b6b6b] text-base" style={{ lineHeight: '1.8' }}>
            {error || 'Something went wrong.'}
          </p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-[#7a9b7e] text-white rounded-xl text-sm font-medium hover:bg-[#6b8c6f]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  /* ─── Data extraction ─── */
  const learnerName = dashboardData.learnerName || 'Learner';
  const learningLanguages: string[] = dashboardData.learningLanguages || [];
  const availableLanguages: string[] = dashboardData.availableLanguages || [];
  const perLanguage: Record<string, any> = dashboardData.perLanguage || {};

  // Current language stats
  const langStats = perLanguage[activeLanguage] || {};
  const currentStreak = langStats.currentStreak || 0;
  const totalLessons = langStats.totalLessons || 0;
  const completedLessons = langStats.completedLessons || 0;
  const wordsLearned = langStats.wordsLearned || 0;
  const practiceMinutes = langStats.totalPracticeMinutes || 0;
  const currentGoal = langStats.currentGoal || `Complete your first ${activeLanguage} lesson`;
  const goalProgress = langStats.goalProgress || 0;
  const recentLessons = langStats.recentLessons || [];
  const achievements = langStats.achievements || [];
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const earnedCount = achievements.filter((a: any) => a.earned).length;

  const nextLesson = recentLessons.find((l: any) => l.status === 'in-progress')
    || recentLessons.find((l: any) => l.status !== 'completed');

  const recommendedByLang: Record<string, any> = {
    English: { id: 'l-1', title: 'Greetings & Introductions', language: 'English', duration: '15 min', description: 'Learn common greetings and introductions' },
    Tamil: { id: 'l-9', title: 'Tamil Alphabets – Uyir', language: 'Tamil', duration: '20 min', description: 'Learn the foundational vowel letters of Tamil script' },
  };
  const recommendedLesson = recommendedByLang[activeLanguage] || recommendedByLang['English'];

  /* ══════════════════════════════════════════
     FOCUS MODE — single action, minimal UI
     ══════════════════════════════════════════ */
  if (focusMode) {
    const focusLesson = nextLesson || recommendedLesson;
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <header className="border-b border-[#e8e5e0]">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold text-[#2d2d2d]">Lexfix</Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFocusMode(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#6b6b6b] hover:bg-[#f0ede8] border border-transparent hover:border-[#e8e5e0]"
                aria-label="Exit focus mode"
              >
                <EyeOff className="w-4 h-4" />
                <span>Exit Focus Mode</span>
              </button>
              <Link href="/logout" className="text-sm text-[#8a8a8a] hover:text-[#6b6b6b]">Sign out</Link>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-6 py-12" ref={mainRef} tabIndex={-1}>
          <div className="mb-12">
            <h1 className="text-2xl font-semibold text-[#2d2d2d] mb-2" style={{ lineHeight: '1.4' }}>
              Welcome back, {learnerName}
            </h1>
            <p className="text-[#6b6b6b]" style={{ lineHeight: '1.8' }}>
              Take your time. There is no rush.
            </p>
          </div>

          {/* Language selector in focus mode */}
          {learningLanguages.length > 1 && (
            <div className="flex items-center gap-2 mb-8">
              <span className="text-xs text-[#8a8a8a] mr-1">Language:</span>
              {learningLanguages.map((lang: string) => (
                <button
                  key={lang}
                  onClick={() => setActiveLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeLanguage === lang
                    ? 'bg-[#7a9b7e] text-white'
                    : 'bg-[#f0ede8] text-[#6b6b6b] hover:bg-[#e8e5e0]'
                    }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}

          {/* Progress for active language */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#6b6b6b]">{activeLanguage} progress</span>
              <span className="text-sm text-[#6b6b6b]">{completedLessons} of {totalLessons} lessons</span>
            </div>
            <div className="w-full h-2 bg-[#e8e5e0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7a9b7e] rounded-full"
                style={{ width: `${progressPercent}%`, transition: 'width 0.6s ease' }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${activeLanguage} progress: ${progressPercent}%`}
              />
            </div>
          </div>

          {/* Single learning action */}
          {focusLesson && (
            <div className="bg-white rounded-2xl p-8 border border-[#e8e5e0] mb-8" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <p className="text-sm text-[#8a8a8a] mb-2">
                {nextLesson?.status === 'in-progress' ? 'Continue where you left off' : 'Suggested next step'}
              </p>
              <h2 className="text-xl font-semibold text-[#2d2d2d] mb-3" style={{ lineHeight: '1.5' }}>
                {focusLesson.title}
              </h2>
              {focusLesson.description && (
                <p className="text-[#6b6b6b] mb-6" style={{ lineHeight: '1.8' }}>{focusLesson.description}</p>
              )}
              <div className="flex items-center gap-4 mb-6 text-sm text-[#8a8a8a]">
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" />{focusLesson.language}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{focusLesson.duration || '15 min'}</span>
              </div>
              <Link
                href={`/learner/lessons/${focusLesson.lessonId || focusLesson.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#7a9b7e] text-white rounded-xl text-sm font-medium hover:bg-[#6b8c6f]"
              >
                {nextLesson?.status === 'in-progress' ? 'Continue learning' : 'Begin lesson'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {currentStreak > 0 && (
            <p className="text-sm text-[#8a8a8a] text-center" style={{ lineHeight: '1.8' }}>
              You have been learning {activeLanguage} for {currentStreak} {currentStreak === 1 ? 'day' : 'days'} in a row. Well done.
            </p>
          )}

          <div className="mt-16 pt-8 border-t border-[#e8e5e0] flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/learner/lessons" className="text-[#7a9b7e] hover:text-[#5d7e61]">All lessons</Link>
            <Link href="/learner/progress" className="text-[#7a9b7e] hover:text-[#5d7e61]">Progress</Link>
            <Link href="/learner/profile" className="text-[#7a9b7e] hover:text-[#5d7e61]">Profile</Link>
            <Link href="/learner/settings" className="text-[#7a9b7e] hover:text-[#5d7e61]">Settings</Link>
          </div>
        </main>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     FULL DASHBOARD — balanced, per-language
     ══════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header role="banner" className="bg-white border-b border-[#e8e5e0] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold text-[#2d2d2d]">Lexfix</Link>
          <nav role="navigation" aria-label="Main navigation" className="flex items-center gap-1">
            {[
              { href: '/learner/dashboard', label: 'Dashboard', active: true },
              { href: '/learner/lessons', label: 'Lessons', active: false },
              { href: '/learner/progress', label: 'Progress', active: false },
              { href: '/learner/profile', label: 'Profile', active: false },
              { href: '/learner/settings', label: 'Settings', active: false },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${item.active
                  ? 'bg-[#f0f4f0] text-[#5d7e61]'
                  : 'text-[#6b6b6b] hover:bg-[#f5f3ef] hover:text-[#2d2d2d]'
                  }`}
                {...(item.active ? { 'aria-current': 'page' as const } : {})}
              >
                {item.label}
              </Link>
            ))}
            <div className="w-px h-5 bg-[#e8e5e0] mx-2" />
            <Link href="/logout" className="px-3 py-2 rounded-lg text-sm text-[#8a8a8a] hover:text-[#c27171] hover:bg-red-50/50">
              Sign out
            </Link>
          </nav>
        </div>
      </header>

      {/* Language tabs + Focus toggle */}
      <div className="bg-[#faf9f7] border-b border-[#f0ede8]">
        <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8a8a8a] mr-1">Language:</span>
            {learningLanguages.map((lang: string) => (
              <button
                key={lang}
                onClick={() => setActiveLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeLanguage === lang
                  ? 'bg-[#7a9b7e] text-white'
                  : 'bg-[#f0ede8] text-[#6b6b6b] hover:bg-[#e8e5e0]'
                  }`}
              >
                {lang}
              </button>
            ))}

            {/* Add language button */}
            {availableLanguages.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowAddLang(!showAddLang)}
                  className="w-7 h-7 rounded-lg bg-[#f0ede8] text-[#6b6b6b] hover:bg-[#e8e5e0] flex items-center justify-center transition-colors"
                  aria-label="Add a language"
                  title="Add a language"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                {showAddLang && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl border border-[#e8e5e0] shadow-lg p-3 z-20 min-w-[180px]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-[#2d2d2d]">Add a language</p>
                      <button onClick={() => setShowAddLang(false)} className="text-[#8a8a8a] hover:text-[#6b6b6b]">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {availableLanguages.map((lang: string) => (
                      <button
                        key={lang}
                        onClick={() => handleAddLanguage(lang)}
                        disabled={addingLang}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#2d2d2d] hover:bg-[#f0f4f0] transition-colors disabled:opacity-50"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setFocusMode(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[#6b6b6b] hover:bg-[#f0ede8] border border-[#e8e5e0]"
            aria-label="Enter focus mode"
          >
            <Eye className="w-3.5 h-3.5" />
            Focus Mode
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main
        ref={mainRef}
        role="main"
        tabIndex={-1}
        className="max-w-5xl mx-auto px-6 py-10"
        aria-label="Dashboard main content"
      >
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#2d2d2d] mb-1" style={{ lineHeight: '1.4' }}>
            Welcome back, {learnerName}
          </h1>
          <p className="text-[#6b6b6b]" style={{ lineHeight: '1.8' }}>
            Your {activeLanguage} learning overview. Take it at your own pace.
          </p>
        </div>

        {/* ═══ Stats Row — 4 equal cards ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Streak */}
          <div className="bg-white rounded-xl p-4 border border-[#f0ede8]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-[#c4956a]" aria-hidden="true" />
              <span className="text-xs font-medium text-[#6b6b6b]">Streak</span>
            </div>
            <p className="text-2xl font-semibold text-[#2d2d2d]">{currentStreak}</p>
            <p className="text-xs text-[#8a8a8a] mt-1">{currentStreak === 1 ? 'day' : 'days'} in a row</p>
          </div>

          {/* Lessons */}
          <div className="bg-white rounded-xl p-4 border border-[#f0ede8]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-[#7a9b7e]" aria-hidden="true" />
              <span className="text-xs font-medium text-[#6b6b6b]">Lessons</span>
            </div>
            <p className="text-2xl font-semibold text-[#2d2d2d]">{completedLessons}<span className="text-base text-[#8a8a8a]">/{totalLessons}</span></p>
            <p className="text-xs text-[#8a8a8a] mt-1">completed</p>
          </div>

          {/* Words */}
          <div className="bg-white rounded-xl p-4 border border-[#f0ede8]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-[#7a97b0]" aria-hidden="true" />
              <span className="text-xs font-medium text-[#6b6b6b]">Words</span>
            </div>
            <p className="text-2xl font-semibold text-[#2d2d2d]">{wordsLearned}</p>
            <p className="text-xs text-[#8a8a8a] mt-1">words learned</p>
          </div>

          {/* Practice time */}
          <div className="bg-white rounded-xl p-4 border border-[#f0ede8]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#9b8ab0]" aria-hidden="true" />
              <span className="text-xs font-medium text-[#6b6b6b]">Practice</span>
            </div>
            <p className="text-2xl font-semibold text-[#2d2d2d]">{practiceMinutes}</p>
            <p className="text-xs text-[#8a8a8a] mt-1">minutes total</p>
          </div>
        </div>

        {/* ═══ Suggested lesson — full width, prominent CTA ═══ */}
        <section className="bg-white rounded-xl p-5 border border-[#f0ede8] mb-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 className="text-sm font-semibold text-[#2d2d2d] mb-3">Suggested for you</h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-[#2d2d2d] mb-1" style={{ lineHeight: '1.5' }}>
                {recommendedLesson.title}
              </h3>
              <p className="text-sm text-[#6b6b6b] mb-2" style={{ lineHeight: '1.7' }}>
                {recommendedLesson.description}
              </p>
              <div className="flex gap-3 text-xs text-[#8a8a8a]">
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" />{recommendedLesson.language}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{recommendedLesson.duration}</span>
              </div>
            </div>
            <Link
              href={`/learner/lessons/${recommendedLesson.id}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7a9b7e] text-white rounded-xl text-sm font-medium hover:bg-[#6b8c6f] flex-shrink-0"
            >
              Start lesson
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ═══ Two-column layout — BALANCED ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ─── LEFT COLUMN ─── */}
          <div className="space-y-6">
            {/* Goal progress */}
            <section className="bg-white rounded-xl p-5 border border-[#f0ede8]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-2.5 mb-4">
                <Target className="w-[18px] h-[18px] text-[#7a97b0]" aria-hidden="true" />
                <span className="text-sm font-semibold text-[#2d2d2d]">Current Goal</span>
              </div>
              <p className="text-sm text-[#6b6b6b] mb-3" style={{ lineHeight: '1.7' }}>{currentGoal}</p>
              <div className="mb-2">
                <div className="w-full h-2 bg-[#f0ede8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7a97b0] rounded-full"
                    style={{ width: `${goalProgress}%`, transition: 'width 0.6s ease' }}
                    role="progressbar"
                    aria-valuenow={goalProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${activeLanguage} goal progress: ${goalProgress}%`}
                  />
                </div>
              </div>
              <p className="text-xs text-[#8a8a8a]">{goalProgress}% complete</p>
            </section>

            {/* Milestones — compact 2x2 grid */}
            <section className="bg-white rounded-xl p-5 border border-[#f0ede8]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-[#2d2d2d]">{activeLanguage} Milestones</h2>
                <span className="text-xs text-[#8a8a8a]">{earnedCount}/{achievements.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {achievements.map((a: any) => (
                  <div
                    key={a.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg ${a.earned ? 'bg-[#f0f4f0]' : 'bg-[#faf9f7]'}`}
                  >
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${a.earned ? 'bg-[#7a9b7e] text-white' : 'bg-[#e8e5e0] text-[#8a8a8a]'
                      }`}>
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-medium leading-tight ${a.earned ? 'text-[#2d2d2d]' : 'text-[#8a8a8a]'}`}>{a.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Speaking practice */}
            <section className="bg-white rounded-xl p-5 border border-[#f0ede8]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h2 className="text-sm font-semibold text-[#2d2d2d] mb-2">Speaking practice</h2>
              <p className="text-sm text-[#6b6b6b] mb-4" style={{ lineHeight: '1.7' }}>
                Practice {activeLanguage} pronunciation at your own pace with speech recognition.
              </p>
              <Link
                href="/learner/practice/pronunciation"
                className="inline-flex items-center gap-1.5 text-sm text-[#7a9b7e] hover:text-[#5d7e61] font-medium"
              >
                Open practice
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </section>
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="space-y-6">
            {/* Recent lessons */}
            <section aria-labelledby="recent-lessons-heading">
              <div className="flex justify-between items-center mb-4">
                <h2 id="recent-lessons-heading" className="text-sm font-semibold text-[#2d2d2d]">
                  Recent {activeLanguage} Lessons
                </h2>
                <Link
                  href={`/learner/lessons?lang=${activeLanguage}`}
                  className="text-xs text-[#7a9b7e] hover:text-[#5d7e61] font-medium flex items-center gap-1"
                >
                  View all
                  <ChevronRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>

              {recentLessons.length === 0 ? (
                <div className="bg-white rounded-xl p-6 border border-[#f0ede8] text-center" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <BookOpen className="w-8 h-8 text-[#d4dcd5] mx-auto mb-3" />
                  <p className="text-[#8a8a8a] text-sm mb-4" style={{ lineHeight: '1.8' }}>
                    No {activeLanguage} lessons started yet. Begin whenever you are ready.
                  </p>
                  <Link
                    href={`/learner/lessons?lang=${activeLanguage}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7a9b7e] text-white rounded-xl text-sm font-medium hover:bg-[#6b8c6f]"
                  >
                    Browse {activeLanguage} lessons
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentLessons.slice(0, 4).map((lesson: any) => (
                    <article
                      key={lesson.id}
                      className="bg-white rounded-xl p-4 border border-[#f0ede8] hover:border-[#d4dcd5] transition-colors"
                      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-[#2d2d2d] mb-1" style={{ lineHeight: '1.5' }}>
                            {lesson.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-[#8a8a8a]">
                            {lesson.score && <span>Score: {lesson.score}%</span>}
                          </div>
                        </div>
                        {lesson.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-[#7a9b7e] flex-shrink-0 mt-0.5" aria-label="Completed" />
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-[#f0ede8] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${lesson.status === 'completed' ? 'bg-[#7a9b7e]' : 'bg-[#a3b8a5]'}`}
                          style={{ width: `${lesson.progress}%` }}
                          role="progressbar"
                          aria-valuenow={lesson.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                      {lesson.status !== 'completed' && (
                        <Link
                          href={`/learner/lessons/${lesson.lessonId || lesson.id}`}
                          className="inline-flex items-center gap-1 mt-2 text-xs text-[#7a9b7e] hover:text-[#5d7e61] font-medium"
                        >
                          {lesson.status === 'in-progress' ? 'Continue' : 'Begin'}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Quick links */}
            <section className="bg-white rounded-xl p-5 border border-[#f0ede8]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h2 className="text-sm font-semibold text-[#2d2d2d] mb-4">Quick links</h2>
              <div className="space-y-2">
                <Link
                  href="/learner/lessons"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f5f3ef] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-[#7a9b7e]" />
                    <span className="text-sm text-[#2d2d2d]">All {activeLanguage} lessons</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8a8a8a] group-hover:text-[#6b6b6b]" />
                </Link>
                <Link
                  href="/learner/progress"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f5f3ef] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-[#7a97b0]" />
                    <span className="text-sm text-[#2d2d2d]">View detailed progress</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8a8a8a] group-hover:text-[#6b6b6b]" />
                </Link>
                <Link
                  href="/learner/settings"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f5f3ef] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-[#9b8ab0]" />
                    <span className="text-sm text-[#2d2d2d]">Learning settings</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8a8a8a] group-hover:text-[#6b6b6b]" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
