/**
 * LEARNER PROFILE PAGE — Calm, Therapeutic Design
 *
 * Displays all user details captured during onboarding:
 * - Student ID (prominent but not flashy)
 * - Name, email, native language, learning languages
 * - Language goals per language
 * - Disabilities / accessibility needs
 * - Accessibility preferences
 * - Learning stats
 *
 * Design: No emojis, no bright gradients, no gamification.
 * Soft warm beige background, muted sage green accent.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  User,
  Mail,
  Globe,
  GraduationCap,
  Shield,
  Calendar,
  Copy,
  Check,
  Clock,
  ArrowRight,
  Settings,
} from 'lucide-react';

export default function LearnerProfile() {
  const mainRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    mainRef.current?.focus();
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      const res = await fetch('/api/learner/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();

      // Map the backend data to our local state
      // The backend returns: { id, email, firstName, lastName, role, createdAt, learnerProfile, studentId, onboardingComplete }
      const enrichedProfile = {
        ...data,
        ...data.learnerProfile, // Merge learner settings
        disabilities: data.learnerProfile?.disabilityTypes || [],
        languageGoals: data.learnerProfile?.accommodations || {}, // Heuristic if goals not explicitly in schema yet
        accessibility: {
          fontFamily: data.learnerProfile?.fontFamily,
          fontSize: data.learnerProfile?.fontSize,
          lineSpacing: data.learnerProfile?.lineSpacing,
          colorScheme: data.learnerProfile?.colorScheme,
        },
        studentId: data.studentId || data.learnerProfile?.studentId,
      };

      setProfile(enrichedProfile);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('We could not load your profile right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function copyStudentId() {
    if (!profile?.studentId) return;
    navigator.clipboard.writeText(profile.studentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /* ─── Loading ─── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#faf9f7]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-[3px] border-[#d4dcd5] border-t-[#7a9b7e] rounded-full animate-spin mx-auto" />
          <p className="text-[#6b6b6b] text-base" style={{ lineHeight: '1.8' }}>
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  /* ─── Error ─── */
  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#faf9f7]">
        <div className="text-center max-w-sm space-y-4">
          <p className="text-[#6b6b6b] text-base" style={{ lineHeight: '1.8' }}>
            {error || 'Something went wrong.'}
          </p>
          <button
            onClick={fetchProfile}
            className="px-6 py-3 bg-[#7a9b7e] text-white rounded-xl text-sm font-medium hover:bg-[#6b8c6f]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const disabilities = profile.disabilities || [];
  const learningLanguages = profile.learningLanguages || [];
  const languageGoals: Record<string, any> = profile.languageGoals || {};
  const accessibility = profile.accessibility || {};
  const createdDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : '--';

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header — identical calm nav */}
      <header role="banner" className="bg-white border-b border-[#e8e5e0] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold text-[#2d2d2d]">
            Lexfix
          </Link>
          <nav role="navigation" aria-label="Main navigation" className="flex items-center gap-1">
            {[
              { href: '/learner/dashboard', label: 'Dashboard', active: false },
              { href: '/learner/lessons', label: 'Lessons', active: false },
              { href: '/learner/progress', label: 'Progress', active: false },
              { href: '/learner/profile', label: 'Profile', active: true },
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

      {/* Main */}
      <main ref={mainRef} tabIndex={-1} className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-[#2d2d2d] mb-1" style={{ lineHeight: '1.4' }}>
          My Profile
        </h1>
        <p className="text-[#6b6b6b] mb-8" style={{ lineHeight: '1.8' }}>
          Your account details and learning preferences.
        </p>

        {/* ── Student ID Card ── */}
        <div className="mb-6 p-5 bg-white rounded-xl border border-[#e8e5e0]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#8a8a8a] mb-1">Student ID</p>
              <p className="text-2xl font-mono font-semibold text-[#2d2d2d] tracking-wider">
                {profile.studentId || '--'}
              </p>
              <p className="text-xs text-[#8a8a8a] mt-2" style={{ lineHeight: '1.6' }}>
                Share this ID with your parent or educator to link accounts.
              </p>
            </div>
            <button
              onClick={copyStudentId}
              className="p-3 rounded-xl border border-[#e8e5e0] hover:bg-[#f5f3ef] text-[#6b6b6b] transition-colors"
              aria-label={copied ? 'Student ID copied' : 'Copy student ID'}
            >
              {copied ? (
                <Check className="w-5 h-5 text-[#7a9b7e]" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* ── Personal Information ── */}
        <section className="bg-white rounded-xl border border-[#f0ede8] p-5 mb-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 className="text-sm font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-[#7a9b7e]" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ProfileField
              icon={<User className="w-3.5 h-3.5" />}
              label="Full Name"
              value={`${profile.firstName} ${profile.lastName}`}
            />
            <ProfileField
              icon={<Mail className="w-3.5 h-3.5" />}
              label="Email"
              value={profile.email}
            />
            <ProfileField
              icon={<Shield className="w-3.5 h-3.5" />}
              label="Role"
              value={profile.role === 'LEARNER' ? 'Student / Learner' : profile.role}
            />
            <ProfileField
              icon={<Calendar className="w-3.5 h-3.5" />}
              label="Member since"
              value={createdDate}
            />
          </div>
        </section>

        {/* ── Learning Profile ── */}
        <section className="bg-white rounded-xl border border-[#f0ede8] p-5 mb-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 className="text-sm font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#7a9b7e]" />
            Learning Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ProfileField
              icon={<Globe className="w-3.5 h-3.5" />}
              label="Native Language"
              value={profile.nativeLanguage || 'Not set'}
            />
            <ProfileField
              icon={<Globe className="w-3.5 h-3.5" />}
              label="Learning Languages"
              value={
                learningLanguages.length > 0
                  ? learningLanguages.map((l: string) => l.charAt(0).toUpperCase() + l.slice(1)).join(', ')
                  : 'Not set'
              }
            />
            <ProfileField
              icon={<GraduationCap className="w-3.5 h-3.5" />}
              label="Grade Level"
              value={profile.gradeLevel || 'Not set'}
            />
            <ProfileField
              icon={<BookOpen className="w-3.5 h-3.5" />}
              label="Onboarding"
              value={profile.onboardingComplete ? 'Completed' : 'Not completed'}
            />
          </div>

          {/* Support needs */}
          {disabilities.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#f0ede8]">
              <p className="text-xs text-[#8a8a8a] mb-2">Support Needs</p>
              <div className="flex flex-wrap gap-2">
                {disabilities.map((d: string) => (
                  <span
                    key={d}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-[#f5f3ef] text-[#6b6b6b] border border-[#e8e5e0]"
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Language Goals ── */}
        {Object.keys(languageGoals).length > 0 && (
          <section className="bg-white rounded-xl border border-[#f0ede8] p-5 mb-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h2 className="text-sm font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#7a9b7e]" />
              Language Goals
            </h2>

            <div className="space-y-3">
              {Object.entries(languageGoals).map(([lang, goals]: [string, any]) => (
                <div
                  key={lang}
                  className="p-4 rounded-xl bg-[#faf9f7] border border-[#f0ede8]"
                >
                  <h3 className="text-sm font-medium text-[#2d2d2d] mb-3">{lang}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {goals.confidenceLevel && (
                      <div>
                        <span className="text-xs text-[#8a8a8a]">Confidence</span>
                        <p className="text-[#2d2d2d] font-medium capitalize">
                          {String(goals.confidenceLevel).replace('-', ' ')}
                        </p>
                      </div>
                    )}
                    {goals.learningGoal && (
                      <div>
                        <span className="text-xs text-[#8a8a8a]">Goal</span>
                        <p className="text-[#2d2d2d] font-medium capitalize">{goals.learningGoal}</p>
                      </div>
                    )}
                    {goals.preferredStyle && (
                      <div>
                        <span className="text-xs text-[#8a8a8a]">Learning Style</span>
                        <p className="text-[#2d2d2d] font-medium capitalize">{goals.preferredStyle}</p>
                      </div>
                    )}
                    {goals.weeklyHours && (
                      <div>
                        <span className="text-xs text-[#8a8a8a]">Weekly Hours</span>
                        <p className="text-[#2d2d2d] font-medium">{goals.weeklyHours} hrs</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Accessibility Preferences ── */}
        {Object.keys(accessibility).length > 0 && (
          <section className="bg-white rounded-xl border border-[#f0ede8] p-5 mb-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h2 className="text-sm font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#7a9b7e]" />
              Accessibility Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(accessibility).map(([key, value]) => {
                const label = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (s) => s.toUpperCase())
                  .trim();
                const display =
                  typeof value === 'boolean'
                    ? value ? 'Enabled' : 'Disabled'
                    : String(value);
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-[#faf9f7] rounded-lg"
                  >
                    <span className="text-sm text-[#6b6b6b]">{label}</span>
                    <span className="text-sm font-medium text-[#2d2d2d]">{display}</span>
                  </div>
                );
              })}
            </div>

            <Link
              href="/learner/settings"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#7a9b7e] hover:text-[#5d7e61] font-medium"
            >
              Edit in Settings
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </section>
        )}

        {/* ── Learning Stats ── */}
        <section className="bg-white rounded-xl border border-[#f0ede8] p-5 mb-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 className="text-sm font-semibold text-[#2d2d2d] mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#7a9b7e]" />
            Learning Stats
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              icon={<BookOpen className="w-4 h-4 text-[#7a9b7e]" />}
              label="Lessons done"
              value={`${profile.completedLessons ?? 0}/${profile.totalLessons ?? 16}`}
            />
            <StatCard
              icon={<Calendar className="w-4 h-4 text-[#7a97b0]" />}
              label="Learning streak"
              value={`${profile.currentStreak ?? 0} days`}
            />
            <StatCard
              icon={<Globe className="w-4 h-4 text-[#7a9b7e]" />}
              label="Words learned"
              value={String(profile.wordsLearned ?? 0)}
            />
            <StatCard
              icon={<Clock className="w-4 h-4 text-[#7a97b0]" />}
              label="Practice time"
              value={`${profile.totalPracticeMinutes ?? 0} min`}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ── Helper components ── */

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-[#faf9f7] rounded-lg">
      <div className="mt-0.5 text-[#7a9b7e]">{icon}</div>
      <div>
        <p className="text-xs text-[#8a8a8a]">{label}</p>
        <p className="text-sm font-medium text-[#2d2d2d]" style={{ lineHeight: '1.6' }}>{value}</p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-[#faf9f7] rounded-xl">
      {icon}
      <p className="text-base font-semibold text-[#2d2d2d] mt-2">{value}</p>
      <p className="text-xs text-[#8a8a8a] mt-0.5">{label}</p>
    </div>
  );
}
