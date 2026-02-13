/**
 * LEARNER ACHIEVEMENTS PAGE
 * 
 * Display all badges and achievements with:
 * - Earned vs locked badges
 * - Achievement descriptions and dates
 * - Progress toward next achievements
 * 
 * Accessibility: WCAG AAA compliant
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AccessibilityToolbar } from '@/components/AccessibilityToolbar';
import {
  Trophy,
  ArrowLeft,
  Loader2,
  Lock,
  Star,
  Flame,
  BookOpen,
  Target,
  Zap,
  Award,
  Mic,
} from 'lucide-react';

interface Achievement {
  id: string;
  badgeId: string;
  badgeName: string;
  description: string;
  earnedAt?: string;
  icon?: string;
}

// Define all possible achievements (earned + locked)
const ALL_BADGES = [
  { badgeId: 'fast-learner', badgeName: 'Fast Learner', description: 'Complete 10 lessons', icon: '⭐', requirement: '10 lessons completed' },
  { badgeId: 'week-warrior', badgeName: 'Week Warrior', description: '7 day learning streak', icon: '🔥', requirement: '7 consecutive days' },
  { badgeId: 'perfect-score', badgeName: 'Perfect Score', description: 'Score 100% on a lesson', icon: '🎯', requirement: '100% on any lesson' },
  { badgeId: 'bookworm', badgeName: 'Bookworm', description: 'Complete 25 lessons', icon: '📚', requirement: '25 lessons completed' },
  { badgeId: 'voice-master', badgeName: 'Voice Master', description: 'Complete 10 pronunciation practices', icon: '🎤', requirement: '10 pronunciation sessions' },
  { badgeId: 'champion', badgeName: 'Champion', description: 'Master all lessons in a module', icon: '🏆', requirement: 'All lessons mastered' },
  { badgeId: 'first-step', badgeName: 'First Step', description: 'Complete your first lesson', icon: '👣', requirement: '1 lesson completed' },
  { badgeId: 'streak-starter', badgeName: 'Streak Starter', description: '3 day learning streak', icon: '✨', requirement: '3 consecutive days' },
  { badgeId: 'dedicated', badgeName: 'Dedicated Learner', description: '30 day learning streak', icon: '💪', requirement: '30 consecutive days' },
  { badgeId: 'speed-demon', badgeName: 'Speed Demon', description: 'Complete a lesson in under 5 minutes', icon: '⚡', requirement: 'Under 5 min lesson' },
  { badgeId: 'explorer', badgeName: 'Explorer', description: 'Try lessons in 3 different categories', icon: '🌍', requirement: '3 categories explored' },
  { badgeId: 'night-owl', badgeName: 'Night Owl', description: 'Complete a lesson after 10 PM', icon: '🦉', requirement: 'Study after 10 PM' },
];

export default function AchievementsPage() {
  const router = useRouter();
  const [earnedAchievements, setEarnedAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  async function fetchAchievements() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch dashboard data which includes achievements
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/learner/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch achievements');

      const data = await response.json();
      setEarnedAchievements(data.achievements || []);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError('Failed to load achievements.');
    } finally {
      setIsLoading(false);
    }
  }

  const earnedBadgeIds = new Set(earnedAchievements.map(a => a.badgeId || a.id));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f1eb]">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-[#9db4a0] mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Header */}
      <header role="banner" className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">Lexfix</Link>
          <nav role="navigation" aria-label="Main navigation" className="flex gap-6">
            <Link href="/learner/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</Link>
            <Link href="/learner/lessons" className="text-gray-700 hover:text-gray-900 font-medium">My Lessons</Link>
            <Link href="/learner/progress" className="text-gray-700 hover:text-gray-900 font-medium">Progress</Link>
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
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              Achievements
            </h1>
            <p className="text-gray-600 mt-1">
              {earnedAchievements.length} of {ALL_BADGES.length} badges earned
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 text-center">
            <p className="text-red-700 text-lg">{error}</p>
          </div>
        )}

        {/* Progress Summary */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 mb-8 border-2 border-yellow-200">
          <div className="flex items-center gap-6">
            <div className="bg-white rounded-full p-6">
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {earnedAchievements.length === 0
                  ? 'Start earning badges!'
                  : `${earnedAchievements.length} Badge${earnedAchievements.length > 1 ? 's' : ''} Earned!`}
              </h2>
              <div className="w-full bg-yellow-200 rounded-full h-4">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all"
                  style={{ width: `${(earnedAchievements.length / ALL_BADGES.length) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={earnedAchievements.length}
                  aria-valuemin={0}
                  aria-valuemax={ALL_BADGES.length}
                  aria-label={`${earnedAchievements.length} of ${ALL_BADGES.length} achievements earned`}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {ALL_BADGES.length - earnedAchievements.length} more to unlock
              </p>
            </div>
          </div>
        </div>

        {/* Earned Achievements */}
        {earnedAchievements.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Earned Badges
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {earnedAchievements.map((achievement, idx) => {
                const badgeDef = ALL_BADGES.find(b => b.badgeId === achievement.badgeId) || ALL_BADGES.find(b => b.badgeName === achievement.badgeName);
                return (
                  <div
                    key={achievement.id || idx}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-5 text-center border-2 border-yellow-200 hover:shadow-md transition-shadow"
                    title={`${achievement.badgeName}: ${achievement.description}`}
                  >
                    <div className="text-5xl mb-3">{achievement.icon || badgeDef?.icon || '🏅'}</div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{achievement.badgeName}</h3>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                    {achievement.earnedAt && (
                      <p className="text-xs text-yellow-700 mt-2 font-medium">
                        Earned {new Date(achievement.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Locked Achievements */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Lock className="w-6 h-6 text-gray-400" />
            Badges to Unlock
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ALL_BADGES.filter(badge => !earnedBadgeIds.has(badge.badgeId)).map((badge, idx) => (
              <div
                key={badge.badgeId}
                className="bg-gray-100 rounded-2xl p-5 text-center border-2 border-gray-200 opacity-60 hover:opacity-80 transition-opacity"
                title={`${badge.badgeName}: ${badge.requirement}`}
              >
                <div className="text-5xl mb-3 grayscale">{badge.icon}</div>
                <h3 className="font-bold text-gray-700 text-sm mb-1">{badge.badgeName}</h3>
                <p className="text-xs text-gray-500">{badge.description}</p>
                <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  {badge.requirement}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <AccessibilityToolbar />
    </div>
  );
}
