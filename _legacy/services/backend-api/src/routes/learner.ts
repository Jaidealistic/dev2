/**
 * LEARNER API ROUTES
 * 
 * RESTful endpoints for learner-specific functionality:
 * - Profile management
 * - Dashboard data
 * - Lesson progress
 * - Achievements
 * - Accessibility preferences
 */

import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/learner/profile
 * Get complete learner profile with accessibility preferences
 */
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        learnerProfile: true,
      },
    });

    if (!user || user.role !== 'LEARNER') {
      return res.status(403).json({ message: 'Access denied. Learner role required.' });
    }

    // Lazy-generate studentId for existing users who don't have one
    if (user.learnerProfile && !user.learnerProfile.studentId) {
      const { generateStudentId } = require('../services/authService');
      const studentId = await generateStudentId();

      const updatedProfile = await prisma.learnerProfile.update({
        where: { userId },
        data: { studentId }
      });

      user.learnerProfile = updatedProfile;
    }

    return res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      accessibilityPrefs: user.accessibilityPrefs,
      language: user.language,
      theme: user.theme,
      role: user.role,
      createdAt: user.createdAt,
      learnerProfile: user.learnerProfile,
      // Flatten common fields for frontend
      studentId: user.learnerProfile?.studentId,
      onboardingComplete: !!user.learnerProfile?.grade, // Simple heuristic
    });
  } catch (error) {
    console.error('Error fetching learner profile:', error);
    return res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

/**
 * PUT /api/learner/profile
 * Update learner profile information
 */
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const {
      firstName,
      lastName,
      dateOfBirth,
      grade,
      school,
      disabilityTypes,
      iepGoals,
      accommodations,
      nativeLanguage,
      learningLanguages,
    } = req.body;

    // Update User table
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
      },
    });

    // Update or create LearnerProfile
    const learnerProfile = await prisma.learnerProfile.upsert({
      where: { userId },
      update: {
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        grade,
        school,
        disabilityTypes,
        iepGoals,
        accommodations,
        nativeLanguage,
        learningLanguages,
      },
      create: {
        userId,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        grade,
        school,
        disabilityTypes,
        iepGoals,
        accommodations,
        nativeLanguage,
        learningLanguages,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
      learnerProfile,
    });
  } catch (error) {
    console.error('Error updating learner profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

/**
 * GET /api/learner/dashboard
 * Get dashboard data including streak, lessons, achievements
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Fetch user with profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        learnerProfile: {
          include: {
            achievements: true,
          },
        },
        lessonProgress: {
          take: 4,
          orderBy: { lastAccessedAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate streak (consecutive days of activity)
    const recentProgress = await prisma.lessonProgress.findMany({
      where: {
        learnerId: userId,
        lastAccessedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      orderBy: { lastAccessedAt: 'desc' },
    });

    const streak = calculateStreak(recentProgress.map(p => p.lastAccessedAt));

    // Count lessons
    const totalLessonsCount = await prisma.lessonProgress.count({
      where: { learnerId: userId },
    });

    const completedLessonsCount = await prisma.lessonProgress.count({
      where: {
        learnerId: userId,
        status: { in: ['COMPLETED', 'MASTERED'] },
      },
    });

    // Get current goal (from learner profile or default)
    const currentGoal = user.learnerProfile?.iepGoals || 'Master language fundamentals';
    const goalProgress = totalLessonsCount > 0
      ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
      : 0;

    // Transform recent lessons for frontend
    const recentLessons = user.lessonProgress.map(progress => ({
      id: progress.lessonId,
      lessonId: progress.lessonId,
      progress: progress.score || 0,
      status: progress.status.toLowerCase().replace('_', '-'),
      timestamp: formatTimestamp(progress.lastAccessedAt),
      attemptCount: progress.attemptCount,
    }));

    // Get achievements
    const achievements = user.learnerProfile?.achievements || [];

    return res.json({
      learnerName: user.firstName || 'Learner',
      currentStreak: streak,
      totalLessons: totalLessonsCount,
      completedLessons: completedLessonsCount,
      currentGoal,
      goalProgress,
      recentLessons,
      achievements: achievements.map(a => ({
        id: a.badgeId,
        icon: getBadgeIcon(a.badgeName),
        title: a.badgeName,
        description: a.description,
        earned: true,
        earnedAt: a.earnedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

/**
 * GET /api/learner/lessons
 * Get all lessons with progress status
 */
router.get('/lessons', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { language, status } = req.query;

    // Get all lessons
    const lessons = await prisma.lesson.findMany({
      where: {
        isPublished: true,
        ...(language && { language: language as string }),
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get user's progress for these lessons
    const progressMap = new Map();
    const userProgress = await prisma.lessonProgress.findMany({
      where: { learnerId: userId },
    });

    userProgress.forEach(p => {
      progressMap.set(p.lessonId, p);
    });

    // Combine lessons with progress
    const lessonsWithProgress = lessons.map(lesson => {
      const progress = progressMap.get(lesson.id);
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        language: lesson.language,
        gradeLevel: lesson.gradeLevel,
        duration: lesson.duration,
        competencies: lesson.competencies,
        learningObjectives: lesson.learningObjectives,
        multiModalContent: lesson.multiModalContent,
        hasTranscripts: lesson.hasTranscripts,
        hasCaptions: lesson.hasCaptions,
        progress: progress ? {
          status: progress.status,
          score: progress.score,
          attemptCount: progress.attemptCount,
          lastAccessedAt: progress.lastAccessedAt,
        } : {
          status: 'NOT_STARTED',
          score: 0,
          attemptCount: 0,
          lastAccessedAt: null,
        },
      };
    });

    // Filter by status if provided
    const filteredLessons = status
      ? lessonsWithProgress.filter(l => l.progress.status === status)
      : lessonsWithProgress;

    res.json({ lessons: filteredLessons });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ message: 'Failed to fetch lessons' });
  }
});

/**
 * GET /api/learner/lessons/:lessonId
 * Get specific lesson content
 */
router.get('/lessons/:lessonId', async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const userId = (req as any).user.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Get user's progress for this lesson
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        learnerId_lessonId: {
          learnerId: userId,
          lessonId,
        },
      },
    });

    // Update lastAccessedAt
    await prisma.lessonProgress.upsert({
      where: {
        learnerId_lessonId: {
          learnerId: userId,
          lessonId,
        },
      },
      update: {
        lastAccessedAt: new Date(),
        status: progress?.status || 'IN_PROGRESS',
      },
      create: {
        learnerId: userId,
        lessonId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    res.json({
      lesson,
      progress,
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ message: 'Failed to fetch lesson' });
  }
});

/**
 * POST /api/learner/lessons/:lessonId/progress
 * Save in-progress lesson state (auto-save)
 */
router.post('/lessons/:lessonId/progress', async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const userId = (req as any).user.id;
    const { timeSpent, score } = req.body;

    const progress = await prisma.lessonProgress.upsert({
      where: {
        learnerId_lessonId: {
          learnerId: userId,
          lessonId,
        },
      },
      update: {
        status: 'IN_PROGRESS',
        lastAccessedAt: new Date(),
        duration: timeSpent || undefined,
        score: score || undefined,
      },
      create: {
        learnerId: userId,
        lessonId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        duration: timeSpent || 0,
        score: score || 0,
      },
    });

    res.json({
      message: 'Progress saved',
      progress,
    });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ message: 'Failed to save progress' });
  }
});

/**
 * POST /api/learner/lessons/:lessonId/complete
 * Mark lesson as completed with score
 */
router.post('/lessons/:lessonId/complete', async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const userId = (req as any).user.id;
    const { score, duration, errorPatterns } = req.body;

    const progress = await prisma.lessonProgress.upsert({
      where: {
        learnerId_lessonId: {
          learnerId: userId,
          lessonId,
        },
      },
      update: {
        status: score >= 80 ? 'MASTERED' : 'COMPLETED',
        completedAt: new Date(),
        score,
        duration,
        errorPatterns,
      },
      create: {
        learnerId: userId,
        lessonId,
        status: score >= 80 ? 'MASTERED' : 'COMPLETED',
        startedAt: new Date(),
        completedAt: new Date(),
        score,
        duration,
        errorPatterns,
      },
    });

    // Check for achievements
    const achievements = await checkAchievements(userId);

    res.json({
      message: 'Lesson completed successfully',
      progress,
      newAchievements: achievements,
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({ message: 'Failed to complete lesson' });
  }
});

/**
 * GET /api/learner/accessibility
 * Get accessibility preferences
 */
router.get('/accessibility', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get learner profile, create if missing (defensive)
    let learnerProfile = await prisma.learnerProfile.findUnique({
      where: { userId },
    });

    if (!learnerProfile) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.role === 'LEARNER') {
        learnerProfile = await prisma.learnerProfile.create({
          data: {
            userId,
            fontFamily: 'lexend',
            fontSize: 18,
            lineSpacing: 1.6,
            letterSpacing: 0.05,
            colorScheme: 'light',
          }
        });
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { accessibilityPrefs: true },
    });

    const prefs = {
      ...(user?.accessibilityPrefs as object || {}),
      ...(learnerProfile || {}),
    };

    res.json({
      success: true,
      preferences: prefs
    });
  } catch (error) {
    console.error('Error fetching accessibility preferences:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch preferences' });
  }
});

/**
 * PUT /api/learner/accessibility
 * Update accessibility preferences
 */
router.put('/accessibility', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const {
      fontFamily,
      fontSize,
      lineSpacing,
      letterSpacing,
      colorScheme,
      reducedMotion,
      highlightText,
      bionicReading,
      focusMode,
      enableSpeechRec,
      speechRecLang,
      speechShowSubtitles,
      dyslexiaMode,
      adhdMode,
      autismMode,
      apdMode,
      reduceFlashing
    } = req.body;

    // Update learner profile
    const updatedProfile = await prisma.learnerProfile.upsert({
      where: { userId },
      update: {
        fontFamily,
        fontSize,
        lineSpacing,
        letterSpacing,
        colorScheme,
        reducedMotion,
        highlightText,
        bionicReading,
        focusMode,
        enableSpeechRec,
        speechRecLang,
        speechShowSubtitles,
      },
      create: {
        userId,
        fontFamily: fontFamily || 'lexend',
        fontSize: fontSize || 18,
        lineSpacing: lineSpacing || 1.6,
        letterSpacing: letterSpacing || 0.05,
        colorScheme: colorScheme || 'light',
        reducedMotion: reducedMotion || false,
        highlightText: highlightText || false,
        bionicReading: bionicReading || false,
        focusMode: focusMode || false,
        enableSpeechRec: enableSpeechRec || true,
        speechRecLang: speechRecLang || 'en-US',
        speechShowSubtitles: speechShowSubtitles || true,
      },
    });

    // Store complex preferences in User table
    await prisma.user.update({
      where: { id: userId },
      data: {
        accessibilityPrefs: {
          dyslexiaMode: dyslexiaMode ?? false,
          adhdMode: adhdMode ?? false,
          autismMode: autismMode ?? false,
          apdMode: apdMode ?? false,
          reduceFlashing: reduceFlashing ?? false
        },
      },
    });

    res.json({
      success: true,
      message: 'Accessibility preferences updated successfully',
      preferences: {
        ...updatedProfile,
        dyslexiaMode,
        adhdMode,
        autismMode,
        apdMode,
        reduceFlashing
      },
    });
  } catch (error) {
    console.error('Error updating accessibility preferences:', error);
    res.status(500).json({ success: false, message: 'Failed to update preferences' });
  }
});

/**
 * PUT /api/learner/settings
 * Save all learner settings (accessibility + notifications + privacy)
 */
router.put('/settings', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const {
      fontFamily,
      fontSize,
      lineSpacing,
      letterSpacing,
      colorScheme,
      reducedMotion,
      captionsEnabled,
      audioDescriptions,
      speechRecognition,
      autoplayAudio,
      backgroundMusic,
      notificationsEnabled,
      emailNotifications,
      progressReports,
      profileVisibility,
      shareProgressWithParents,
      shareProgressWithEducators,
    } = req.body;

    // Update accessibility-related fields in LearnerProfile
    const updatedProfile = await prisma.learnerProfile.upsert({
      where: { userId },
      update: {
        fontFamily: fontFamily || undefined,
        fontSize: fontSize || undefined,
        lineSpacing: lineSpacing || undefined,
        letterSpacing: letterSpacing || undefined,
        colorScheme: colorScheme || undefined,
        reducedMotion: reducedMotion ?? undefined,
        enableSpeechRec: speechRecognition ?? undefined,
        speechShowSubtitles: captionsEnabled ?? undefined,
      },
      create: {
        userId,
        fontFamily: fontFamily || 'lexend',
        fontSize: fontSize || 18,
        lineSpacing: lineSpacing || 1.6,
        letterSpacing: letterSpacing || 0.05,
        colorScheme: colorScheme || 'light',
        reducedMotion: reducedMotion || false,
        enableSpeechRec: speechRecognition || false,
        speechShowSubtitles: captionsEnabled || true,
      },
    });

    // Store notification & privacy prefs in user accessibilityPrefs JSON
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { accessibilityPrefs: true },
    });

    const existingPrefs = (existingUser?.accessibilityPrefs as Record<string, any>) || {};

    await prisma.user.update({
      where: { id: userId },
      data: {
        accessibilityPrefs: {
          ...existingPrefs,
          audioDescriptions,
          autoplayAudio,
          backgroundMusic,
          notificationsEnabled,
          emailNotifications,
          progressReports,
          profileVisibility,
          shareProgressWithParents,
          shareProgressWithEducators,
        },
      },
    });

    res.json({
      message: 'Settings saved successfully',
      settings: updatedProfile,
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ message: 'Failed to save settings' });
  }
});

/**
 * GET /api/learner/progress
 * Get detailed progress analytics
 */
router.get('/progress', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const learnerProfile = await prisma.learnerProfile.findUnique({
      where: { userId },
      include: {
        progressRecords: {
          orderBy: { updatedAt: 'desc' },
        },
      },
    });

    const allProgress = await prisma.lessonProgress.findMany({
      where: { learnerId: userId },
      orderBy: { lastAccessedAt: 'desc' },
    });

    // Calculate analytics
    const totalTime = allProgress.reduce((sum, p) => sum + (p.duration || 0), 0);
    const avgScore = allProgress.length > 0
      ? allProgress.reduce((sum, p) => sum + (p.score || 0), 0) / allProgress.length
      : 0;

    res.json({
      competencies: learnerProfile?.progressRecords || [],
      lessonProgress: allProgress,
      analytics: {
        totalTime,
        avgScore: Math.round(avgScore),
        totalLessons: allProgress.length,
        masteredLessons: allProgress.filter(p => p.status === 'MASTERED').length,
      },
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate consecutive day streak
 */
function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const sortedDates = dates
    .map(d => new Date(d).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  // Must have activity today or yesterday to count
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let currentDate = new Date();
  for (const dateStr of sortedDates) {
    const date = new Date(dateStr);
    const diffDays = Math.floor((currentDate.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));

    if (diffDays <= 1) {
      streak++;
      currentDate = date;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Format timestamp for display
 */
function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return new Date(date).toLocaleDateString();
}

/**
 * Get badge icon based on badge name
 */
function getBadgeIcon(badgeName: string): string {
  const iconMap: { [key: string]: string } = {
    'Week Warrior': '🔥',
    'Fast Learner': '⭐',
    'Perfect Score': '🎯',
    'Bookworm': '📚',
    'Voice Master': '🎤',
    'Champion': '🏆',
  };
  return iconMap[badgeName] || '🏅';
}

/**
 * Check and award new achievements
 */
async function checkAchievements(userId: string): Promise<any[]> {
  const newAchievements: any[] = [];

  try {
    const completedCount = await prisma.lessonProgress.count({
      where: {
        learnerId: userId,
        status: { in: ['COMPLETED', 'MASTERED'] },
      },
    });

    const recentProgress = await prisma.lessonProgress.findMany({
      where: { learnerId: userId },
      orderBy: { lastAccessedAt: 'desc' },
      take: 7,
    });

    const streak = calculateStreak(recentProgress.map(p => p.lastAccessedAt));

    // Check existing achievements
    const existingAchievements = await prisma.achievement.findMany({
      where: { learnerId: userId },
    });

    const existingBadgeNames = existingAchievements.map(a => a.badgeName);

    // Award "Fast Learner" if completed 10+ lessons
    if (completedCount >= 10 && !existingBadgeNames.includes('Fast Learner')) {
      const achievement = await prisma.achievement.create({
        data: {
          learnerId: userId,
          badgeId: 'fast-learner',
          badgeName: 'Fast Learner',
          description: 'Complete 10 lessons',
        },
      });
      newAchievements.push(achievement);
    }

    // Award "Week Warrior" if 7+ day streak
    if (streak >= 7 && !existingBadgeNames.includes('Week Warrior')) {
      const achievement = await prisma.achievement.create({
        data: {
          learnerId: userId,
          badgeId: 'week-warrior',
          badgeName: 'Week Warrior',
          description: '7 day streak',
        },
      });
      newAchievements.push(achievement);
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }

  return newAchievements;
}

export default router;
