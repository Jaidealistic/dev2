/**
 * LEARNER PROGRESS PAGE — Calm Design System
 *
 * Summarized progress data for dashboard visualization (OpenProject #12609)
 * - Circular progress rings for mastery / avg score
 * - Per-lesson activity with lesson titles (not raw IDs)
 * - Competency tracking
 * - Consistent nav + calm colour palette
 * - WCAG AAA, dyslexia-friendly, ADHD-safe
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useToast } from '@/components/providers/ToastProvider';
import {
  TrendingUp,
  Clock,
  Target,
  Award,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  Star,
  RotateCcw,
  Calendar,
  Flame,
  ChevronRight,
} from 'lucide-react';

interface ProgressData {
  competencies: any[];
  lessonProgress: any[];
  analytics: {
    totalTime: number;
    avgScore: number;
    totalLessons: number;
    masteredLessons: number;
    completedLessons?: number;
    currentStreak?: number;
  };
}

/* ── Circular progress ring ─────────────────────────────────────── */
function Ring({
  value,
  max = 100,
  size = 88,
  stroke = 7,
  color = '#7a9b7e',
  label,
  sublabel,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  color?: string;
  label: string;
  sublabel: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = circ * pct;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f0ede8" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fontSize: 16, fontWeight: 700, fill: '#2d2d2d' }}
        >
          {label}
        </text>
      </svg>
      <span className="text-xs text-[#8a8a8a] text-center">{sublabel}</span>
    </div>
  );
}

/* ── Status badge ───────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    MASTERED: { label: 'Mastered', cls: 'bg-[#fef9e7] text-[#9a7a3a] border-[#f0d080]' },
    COMPLETED: { label: 'Completed', cls: 'bg-[#f0f4f0] text-[#5d7e61] border-[#c5d9c7]' },
    IN_PROGRESS: { label: 'In Progress', cls: 'bg-[#f0f4f8] text-[#5a7a94] border-[#c5d4e0]' },
    NOT_STARTED: { label: 'Not Started', cls: 'bg-[#f5f3ef] text-[#8a8a8a] border-[#e8e5e0]' },
  };
  const cfg = map[status] || map['NOT_STARTED'];
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

/* ── Main component ─────────────────────────────────────────────── */
export default function ProgressPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const { error: toastError } = useToast();

  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'competencies'>('overview');

  useEffect(() => { fetchProgress(); }, []);

  async function fetchProgress() {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      const res = await fetch('/api/learner/progress', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch progress');
      setProgressData(await res.json());
    } catch (err) {
      console.error(err);
      toastError(t('common.error'), 'Could not load progress data.');
    } finally {
      setIsLoading(false);
    }
  }

  function fmt(min: number) {
    if (min < 60) return `${min}m`;
    const h = Math.floor(min / 60), m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#faf9f7]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-[3px] border-[#d4dcd5] border-t-[#7a9b7e] rounded-full animate-spin mx-auto" aria-hidden="true" />
          <p className="text-[#6b6b6b] text-base">{t('status.dataLoading')}</p>
        </div>
      </div>
    );
  }

  const analytics = progressData?.analytics ?? { totalTime: 0, avgScore: 0, totalLessons: 0, masteredLessons: 0, completedLessons: 0, currentStreak: 0 };
  const lessonProgress = progressData?.lessonProgress ?? [];
  const competencies = progressData?.competencies ?? [];
  const masteryPct = analytics.totalLessons > 0 ? Math.round((analytics.masteredLessons / analytics.totalLessons) * 100) : 0;
  const completedPct = analytics.totalLessons > 0 ? Math.round(((analytics.completedLessons ?? 0) / analytics.totalLessons) * 100) : 0;

  const tabs = [
    { id: 'overview', label: t('progress.recentProgress'), icon: TrendingUp },
    { id: 'lessons', label: t('progress.lessonsCompleted'), icon: BookOpen },
    { id: 'competencies', label: t('progress.masteredTopics'), icon: Award },
  ] as const;

  return (
    <div className="min-h-screen bg-[#faf9f7]">

      {/* ── Header ── */}
      <header className="border-b border-[#f0ede8] bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo + back */}
          <div className="flex items-center gap-4">
            <Link href="/learner/dashboard" className="flex items-center gap-1.5 text-[#6b6b6b] hover:text-[#2d2d2d] transition-colors">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm font-medium hidden sm:inline">{t('common.back')}</span>
            </Link>
            <span className="text-base font-semibold text-[#2d2d2d]">Lexfix</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/learner/dashboard', key: 'dashboard' },
              { href: '/learner/lessons', key: 'lessons' },
              { href: '/learner/progress', key: 'progress', active: true },
              { href: '/learner/profile', key: 'profile' },
              { href: '/learner/settings', key: 'settings' },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-[#f0f4f0] text-[#5d7e61]' : 'text-[#6b6b6b] hover:bg-[#f5f3ef] hover:text-[#2d2d2d]'
                  }`}
                {...(item.active ? { 'aria-current': 'page' as const } : {})}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          {/* Language pill + sign out */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center rounded-lg border border-[#e8e5e0] overflow-hidden"
              role="group"
              aria-label={t('common.uiLanguage')}
            >
              {(['en', 'ta'] as const).map((lang, i) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${language === lang ? 'bg-[#7a9b7e] text-white' : 'text-[#8a8a8a] hover:bg-[#f0ede8] bg-white'
                    }${i === 0 ? '' : ' border-l border-[#e8e5e0]'}`}
                  aria-pressed={language === lang}
                >
                  {lang === 'en' ? 'EN' : 'த'}
                </button>
              ))}
            </div>
            <Link href="/logout" className="text-sm text-[#8a8a8a] hover:text-[#c27171] transition-colors">
              {t('nav.signOut')}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* ── Page title ── */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#2d2d2d]">{t('progress.title')}</h1>
          <p className="text-sm text-[#8a8a8a] mt-1">{t('progress.overview')}</p>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <BookOpen className="w-4 h-4" aria-hidden="true" />, value: analytics.totalLessons, label: t('progress.totalLessons'), color: 'text-[#5a7a94]', bg: 'bg-[#f0f4f8]' },
            { icon: <CheckCircle className="w-4 h-4" aria-hidden="true" />, value: analytics.completedLessons ?? 0, label: t('progress.lessonsCompleted'), color: 'text-[#5d7e61]', bg: 'bg-[#f0f4f0]' },
            { icon: <Target className="w-4 h-4" aria-hidden="true" />, value: `${analytics.avgScore}%`, label: t('progress.averageScore'), color: 'text-[#9a7a3a]', bg: 'bg-[#fef9e7]' },
            { icon: <Clock className="w-4 h-4" aria-hidden="true" />, value: fmt(analytics.totalTime), label: t('progress.timeSpent'), color: 'text-[#7a9b7e]', bg: 'bg-[#f0f4f0]' },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-xl border border-[#f0ede8] p-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className={`inline-flex p-2 rounded-lg ${card.bg} ${card.color} mb-3`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-[#2d2d2d]">{card.value}</p>
              <p className="text-xs text-[#8a8a8a] mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>

        {/* ── Progress rings ── */}
        <div className="bg-white rounded-xl border border-[#f0ede8] p-6 mb-8" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 className="text-sm font-semibold text-[#2d2d2d] uppercase tracking-wide mb-6">{t('progress.overview')}</h2>
          <div className="flex flex-wrap gap-10 justify-around">
            <Ring value={masteryPct} label={`${masteryPct}%`} sublabel={t('progress.masteredTopics')} color="#c4a44a" />
            <Ring value={completedPct} label={`${completedPct}%`} sublabel={t('progress.lessonsCompleted')} color="#7a9b7e" />
            <Ring value={analytics.avgScore} label={`${analytics.avgScore}%`} sublabel={t('progress.averageScore')} color="#7a9bb5" />
            {analytics.currentStreak != null && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-[88px] h-[88px] rounded-full bg-[#fef9e7] border-[7px] border-[#c4a44a] flex items-center justify-center">
                  <div className="text-center">
                    <Flame className="w-5 h-5 text-[#c4a44a] mx-auto" aria-hidden="true" />
                    <span className="text-base font-bold text-[#2d2d2d]">{analytics.currentStreak}</span>
                  </div>
                </div>
                <span className="text-xs text-[#8a8a8a] text-center">{t('progress.currentStreak')}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-6 bg-[#f5f3ef] p-1 rounded-xl w-fit" role="tablist">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-white text-[#2d2d2d] shadow-sm'
                  : 'text-[#8a8a8a] hover:text-[#2d2d2d]'
                }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Tab: Recent Activity ── */}
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {lessonProgress.length === 0 ? (
              <EmptyState icon={<BookOpen className="w-8 h-8 text-[#c5c0b8]" aria-hidden="true" />} message="No activity yet. Start your first lesson!" cta={{ href: '/learner/lessons', label: 'Browse Lessons' }} />
            ) : (
              lessonProgress.slice(0, 10).map((p: any, i: number) => (
                <div key={p.id || i} className="bg-white rounded-xl border border-[#f0ede8] p-4 flex items-center gap-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div className={`p-2.5 rounded-lg flex-shrink-0 ${p.status === 'MASTERED' ? 'bg-[#fef9e7]' :
                      p.status === 'COMPLETED' ? 'bg-[#f0f4f0]' : 'bg-[#f0f4f8]'
                    }`}>
                    {p.status === 'MASTERED' ? <Star className="w-4 h-4 text-[#c4a44a]" aria-hidden="true" /> :
                      p.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4 text-[#5d7e61]" aria-hidden="true" /> :
                        <RotateCcw className="w-4 h-4 text-[#5a7a94]" aria-hidden="true" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2d2d2d] truncate">
                      {p.lessonTitle || p.lessonId}
                    </p>
                    <div className="flex gap-3 text-xs text-[#8a8a8a] mt-0.5">
                      <span className="flex items-center gap-1"><Target className="w-3 h-3" aria-hidden="true" />{p.score ?? 0}%</span>
                      {p.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" aria-hidden="true" />{fmt(p.duration)}</span>}
                      {p.lastAccessedAt && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" aria-hidden="true" />{fmtDate(p.lastAccessedAt)}</span>}
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Tab: All Lessons ── */}
        {activeTab === 'lessons' && (
          <div className="bg-white rounded-xl border border-[#f0ede8] overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            {lessonProgress.length === 0 ? (
              <div className="p-12 text-center">
                <EmptyState icon={<BookOpen className="w-8 h-8 text-[#c5c0b8]" aria-hidden="true" />} message="No lessons attempted yet." cta={{ href: '/learner/lessons', label: 'Browse Lessons' }} />
              </div>
            ) : (
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-[#f0ede8] bg-[#faf9f7]">
                    {['Lesson', 'Status', 'Score', 'Attempts', 'Last Activity'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#8a8a8a] uppercase tracking-wide">{h}</th>
                    ))}
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {lessonProgress.map((p: any, i: number) => (
                    <tr key={p.id || i} className="border-b border-[#f0ede8] hover:bg-[#faf9f7] transition-colors">
                      <td className="px-5 py-3.5">
                        <Link href={`/learner/lessons/${p.lessonId}`} className="font-medium text-[#5d7e61] hover:text-[#4a6b4e] transition-colors">
                          {p.lessonTitle || p.lessonId}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                      <td className="px-5 py-3.5 font-medium text-[#2d2d2d]">{p.score ?? 0}%</td>
                      <td className="px-5 py-3.5 text-[#6b6b6b]">{p.attemptCount ?? 1}</td>
                      <td className="px-5 py-3.5 text-[#8a8a8a]">{p.lastAccessedAt ? fmtDate(p.lastAccessedAt) : '—'}</td>
                      <td className="px-5 py-3.5">
                        <ChevronRight className="w-4 h-4 text-[#c5c0b8]" aria-hidden="true" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── Tab: Competencies ── */}
        {activeTab === 'competencies' && (
          <div className="space-y-3">
            {competencies.length === 0 ? (
              <EmptyState icon={<Award className="w-8 h-8 text-[#c5c0b8]" aria-hidden="true" />} message="Competencies will appear as you complete lessons." />
            ) : (
              competencies.map((c: any, i: number) => {
                const pct = c.score ?? c.progress ?? 0;
                return (
                  <div key={c.id || i} className="bg-white rounded-xl border border-[#f0ede8] p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-[#2d2d2d]">{c.competencyName || c.skill || `Competency ${i + 1}`}</h3>
                      <StatusBadge status={c.masteryLevel || 'IN_PROGRESS'} />
                    </div>
                    <div className="w-full h-2 bg-[#f0ede8] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#7a9b7e] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    <p className="text-xs text-[#8a8a8a] mt-1.5 text-right">{pct}%</p>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* ── Empty state helper ─────────────────────────────────────────── */
function EmptyState({ icon, message, cta }: { icon: React.ReactNode; message: string; cta?: { href: string; label: string } }) {
  return (
    <div className="py-16 flex flex-col items-center gap-4 text-center">
      <div className="p-4 bg-[#f5f3ef] rounded-full">{icon}</div>
      <p className="text-sm text-[#8a8a8a] max-w-xs" style={{ lineHeight: '1.8' }}>{message}</p>
      {cta && (
        <Link href={cta.href} className="mt-2 px-5 py-2.5 bg-[#7a9b7e] text-white text-sm font-medium rounded-xl hover:bg-[#6b8c6f] transition-colors">
          {cta.label}
        </Link>
      )}
    </div>
  );
}
