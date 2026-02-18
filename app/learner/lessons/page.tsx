/**
 * LESSONS LIST PAGE — Calm, Therapeutic Design
 *
 * - Low-stimulus, distraction-free layout
 * - No emojis, flags, bright gradients, or gamification
 * - Soft warm beige background, muted sage green accent
 * - Quiet search and filter controls
 * - WCAG AAA, dyslexia-friendly, ADHD-safe
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';
import {
  BookOpen,
  Search,
  Clock,
  CheckCircle,
  ArrowRight,
  Globe,
  ChevronDown,
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  language: string;
  gradeLevel: string;
  duration: number;
  competencies: string[];
  learningObjectives: string[];
  hasTranscripts: boolean;
  hasCaptions: boolean;
  progress: {
    status: string;
    score: number;
    attemptCount: number;
    lastAccessedAt: string | null;
  };
}

const STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  MASTERED: 'Mastered',
};

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: 'bg-[#f5f3ef] text-[#8a8a8a]',
  IN_PROGRESS: 'bg-[#edf2f7] text-[#5a7a94]',
  COMPLETED: 'bg-[#f0f4f0] text-[#5d7e61]',
  MASTERED: 'bg-[#f0f4f0] text-[#5d7e61]',
};

export default function LessonsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>(searchParams.get('lang') || 'all');
  const [learningLanguages, setLearningLanguages] = useState<string[]>([]);

  useEffect(() => {
    fetchLessons();
  }, [language]); // Refetch when UI language changes

  async function fetchLessons() {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      const [lessonsRes, meRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/learner/lessons?lang=${language}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (!lessonsRes.ok) throw new Error('Failed to fetch lessons');
      const data = await lessonsRes.json();
      setLessons(data.lessons || []);

      if (meRes.ok) {
        const meData = await meRes.json();
        setLearningLanguages(meData.user?.learningLanguages || []);
      }
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('We could not load your lessons right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = !searchQuery ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lesson.progress.status === statusFilter;
    const matchesLanguage = languageFilter === 'all' ||
      lesson.language.toLowerCase() === languageFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesLanguage;
  });

  const languages = [...new Set(lessons.map(l => l.language))];
  const completedCount = lessons.filter(l =>
    l.progress.status === 'COMPLETED' || l.progress.status === 'MASTERED'
  ).length;

  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#faf9f7]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-[3px] border-[#d4dcd5] border-t-[#7a9b7e] rounded-full animate-spin mx-auto" />
          <p className="text-[#6b6b6b] text-base" style={{ lineHeight: '1.8' }}>
            {t('status.dataLoading')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header role="banner" className="bg-white border-b border-[#e8e5e0] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold text-[#2d2d2d]">
            Lexfix
          </Link>
          <nav role="navigation" aria-label="Main navigation" className="flex items-center gap-1">
            {[
              { href: '/learner/dashboard', label: 'Dashboard', active: false },
              { href: '/learner/lessons', label: 'Lessons', active: true },
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

      {/* Language tabs */}
      {(learningLanguages.length > 0 || languages.length > 1) && (
        <div className="bg-[#faf9f7] border-b border-[#f0ede8]">
          <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center gap-2">
            <span className="text-xs text-[#8a8a8a] mr-1">Language:</span>
            <button
              onClick={() => setLanguageFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${languageFilter === 'all'
                ? 'bg-[#2d2d2d] text-white'
                : 'bg-[#f0ede8] text-[#6b6b6b] hover:bg-[#e8e5e0]'
                }`}
            >
              All
            </button>
            {(learningLanguages.length > 0 ? learningLanguages : languages).map((lang: string) => (
              <button
                key={lang}
                onClick={() => setLanguageFilter(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${languageFilter === lang
                  ? 'bg-[#7a9b7e] text-white'
                  : 'bg-[#f0ede8] text-[#6b6b6b] hover:bg-[#e8e5e0]'
                  }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-10" role="main">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#2d2d2d] mb-1" style={{ lineHeight: '1.4' }}>
            Lessons
          </h1>
          <p className="text-[#6b6b6b]" style={{ lineHeight: '1.8' }}>
            {lessons.length} lessons available.{' '}
            {completedCount > 0 && `${completedCount} completed. `}
            Browse at your own pace.
          </p>
        </div>

        {/* Search and filter — quiet, unobtrusive */}
        <div className="bg-white rounded-xl p-4 border border-[#f0ede8] mb-8" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
              <input
                type="search"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e8e5e0] rounded-lg text-sm text-[#2d2d2d] placeholder-[#b0b0b0] focus:border-[#a3b8a5] focus:ring-2 focus:ring-[#a3b8a5]/20 focus:outline-none bg-[#faf9f7]"
                aria-label="Search lessons"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-9 border border-[#e8e5e0] rounded-lg text-sm text-[#2d2d2d] focus:border-[#a3b8a5] focus:outline-none bg-[#faf9f7] cursor-pointer"
                aria-label="Filter by status"
              >
                <option value="all">All statuses</option>
                <option value="NOT_STARTED">Not started</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="MASTERED">Mastered</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-white rounded-xl p-6 border border-[#e8e5e0] mb-8 text-center" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <p className="text-[#6b6b6b] text-sm mb-4" style={{ lineHeight: '1.8' }}>{error}</p>
            <button
              onClick={fetchLessons}
              className="px-5 py-2.5 bg-[#7a9b7e] text-white rounded-xl text-sm font-medium hover:bg-[#6b8c6f]"
            >
              Try again
            </button>
          </div>
        )}

        {/* Lessons list */}
        {filteredLessons.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-10 h-10 text-[#d4dcd5] mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-[#2d2d2d] mb-2">
              {searchQuery || statusFilter !== 'all' || languageFilter !== 'all'
                ? 'No matching lessons found'
                : 'No lessons available yet'}
            </h2>
            <p className="text-[#8a8a8a] text-sm" style={{ lineHeight: '1.8' }}>
              {searchQuery || statusFilter !== 'all' || languageFilter !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Your lessons are being prepared. Check back soon.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLessons.map(lesson => (
              <article
                key={lesson.id}
                className="bg-white rounded-xl border border-[#f0ede8] hover:border-[#d4dcd5] transition-colors overflow-hidden"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <div className="p-5">
                  {/* Top row: title + status */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-[#2d2d2d] mb-1" style={{ lineHeight: '1.5' }}>
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-[#6b6b6b] line-clamp-2" style={{ lineHeight: '1.7' }}>
                        {lesson.description || 'No description available'}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_STYLES[lesson.progress.status] || STATUS_STYLES.NOT_STARTED
                      }`}>
                      {STATUS_LABELS[lesson.progress.status] || 'Not started'}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#8a8a8a] mb-4">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      {lesson.language}
                    </span>
                    {lesson.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {lesson.duration} min
                      </span>
                    )}
                    {lesson.gradeLevel && (
                      <span>Grade {lesson.gradeLevel}</span>
                    )}
                    {lesson.hasTranscripts && (
                      <span className="px-2 py-0.5 bg-[#f5f3ef] rounded text-[#6b6b6b]">Transcripts</span>
                    )}
                    {lesson.hasCaptions && (
                      <span className="px-2 py-0.5 bg-[#f5f3ef] rounded text-[#6b6b6b]">Captions</span>
                    )}
                  </div>

                  {/* Progress bar (if started) */}
                  {lesson.progress.status !== 'NOT_STARTED' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-[#8a8a8a]">Progress</span>
                        <span className="text-xs text-[#6b6b6b] font-medium">{lesson.progress.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#f0ede8] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${lesson.progress.status === 'COMPLETED' || lesson.progress.status === 'MASTERED'
                            ? 'bg-[#7a9b7e]'
                            : 'bg-[#a3b8a5]'
                            }`}
                          style={{ width: `${lesson.progress.score}%` }}
                          role="progressbar"
                          aria-valuenow={lesson.progress.score}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${lesson.title}: ${lesson.progress.score}% complete`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action link */}
                  <div className="flex items-center justify-between">
                    {lesson.progress.status === 'COMPLETED' || lesson.progress.status === 'MASTERED' ? (
                      <div className="flex items-center gap-1.5 text-sm text-[#7a9b7e]">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <div />
                    )}
                    <Link
                      href={`/learner/lessons/${lesson.id}`}
                      className="inline-flex items-center gap-1.5 text-sm text-[#7a9b7e] hover:text-[#5d7e61] font-medium"
                    >
                      {lesson.progress.status === 'NOT_STARTED' ? 'Begin' :
                        lesson.progress.status === 'IN_PROGRESS' ? 'Continue' : 'Review'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
