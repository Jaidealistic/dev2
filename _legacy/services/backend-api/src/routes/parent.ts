/**
 * PARENT API ROUTES
 * 
 * RESTful endpoints for parent-specific functionality:
 * - Dashboard data for all children
 * - Multi-child management
 * - Progress monitoring
 * - Educator communication
 * - Homeschool features
 */

import express, { Request, Response } from 'express';
import { UserRole } from '@prisma/client';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload, getFileUrl } from '../services/uploadService';
import { prisma } from '@/db';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /api/parent/dashboard
 * Get parent dashboard with all children's data
 */
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get parent profile
    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId },
      include: {
        children: {
          include: {
            child: {
              include: {
                learnerProfile: true,
                lessonProgress: {
                  take: 5,
                  orderBy: { lastAccessedAt: 'desc' },
                },
              },
            },
          },
        },
      },
    });

    if (!parentProfile) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    // Transform children data
    const childrenData = await Promise.all(
      parentProfile.children.map(async (familyMember) => {
        const child = familyMember.child;
        const profile = child.learnerProfile;

        // Calculate streak
        const recentProgress = await prisma.lessonProgress.findMany({
          where: {
            learnerId: child.id,
            lastAccessedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          orderBy: { lastAccessedAt: 'desc' },
        });

        const streak = calculateStreak(recentProgress.map(p => p.lastAccessedAt));

        // Count completed lessons
        const completedCount = await prisma.lessonProgress.count({
          where: {
            learnerId: child.id,
            status: { in: ['COMPLETED', 'MASTERED'] },
          },
        });

        // Total lessons started
        const totalCount = await prisma.lessonProgress.count({
          where: { learnerId: child.id },
        });

        const progress = totalCount > 0
          ? Math.round((completedCount / totalCount) * 100)
          : 0;

        // Recent activity
        const latestProgress = child.lessonProgress[0];
        const recentActivity = latestProgress
          ? `Last active ${formatTimestamp(latestProgress.lastAccessedAt)}`
          : 'No recent activity';

        return {
          id: child.id,
          name: `${child.firstName} ${child.lastName}`,
          grade: profile?.grade || 'N/A',
          avatar: (child.firstName?.[0] || '').toUpperCase(),
          streak,
          lessonsCompleted: completedCount,
          progress,
          recentActivity,
          disabilityTypes: profile?.disabilityTypes || [],
        };
      })
    );

    // Get unread messages
    const messageThreads = await prisma.messageThread.findMany({
      where: {
        participantIds: {
          has: userId,
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const messages = messageThreads.map(thread => {
      const lastMessage = thread.messages[0];
      return {
        id: thread.id,
        subject: thread.subject,
        lastMessageAt: thread.lastMessageAt,
        unread: lastMessage && !lastMessage.readAt && lastMessage.senderId !== userId,
      };
    });

    res.json({
      children: childrenData,
      messages,
      unreadCount: messages.filter(m => m.unread).length,
    });
  } catch (error) {
    console.error('Error fetching parent dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

/**
 * GET /api/parent/children
 * Get all children with detailed profiles
 */
router.get('/children', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId },
      include: {
        children: {
          include: {
            child: {
              include: {
                learnerProfile: {
                  include: {
                    achievements: true,
                    progressRecords: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!parentProfile) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    const children = parentProfile.children.map(fm => ({
      id: fm.child.id,
      email: fm.child.email,
      firstName: fm.child.firstName,
      lastName: fm.child.lastName,
      relationship: fm.relationship,
      profile: fm.child.learnerProfile,
    }));

    res.json({ children });
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ message: 'Failed to fetch children' });
  }
});

/**
 * GET /api/parent/children/:childId/progress
 * Get detailed progress for specific child
 */
router.get('/children/:childId/progress', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId } = req.params;

    // Verify parent has access to this child
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get child's progress
    const child = await prisma.user.findUnique({
      where: { id: childId },
      include: {
        learnerProfile: {
          include: {
            achievements: true,
            progressRecords: true,
          },
        },
        lessonProgress: {
          orderBy: { lastAccessedAt: 'desc' },
        },
      },
    });

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // Calculate weekly activity
    const weeklyActivity = await calculateWeeklyActivity(childId);

    // Get strengths and challenges
    const analysis = await analyzeProgress(childId);

    res.json({
      child: {
        id: child.id,
        name: `${child.firstName} ${child.lastName}`,
        profile: child.learnerProfile,
      },
      progress: child.lessonProgress,
      achievements: child.learnerProfile?.achievements || [],
      competencies: child.learnerProfile?.progressRecords || [],
      weeklyActivity,
      analysis,
    });
  } catch (error) {
    console.error('Error fetching child progress:', error);
    res.status(500).json({ message: 'Failed to fetch progress' });
  }
});

/**
 * POST /api/parent/children/link
 * Link a child to parent account using email OR studentId
 */
router.post('/children/link', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childEmail, studentId, relationship } = req.body;

    let child = null;

    if (studentId) {
      const profile = await prisma.learnerProfile.findUnique({
        where: { studentId },
        include: { user: true }
      });
      child = profile?.user;
    } else if (childEmail) {
      child = await prisma.user.findUnique({
        where: { email: childEmail },
      });
    }

    if (!child || child.role !== 'LEARNER') {
      return res.status(404).json({ message: 'Learner not found' });
    }

    // Get or create parent profile
    const parentProfile = await prisma.parentProfile.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });

    // Create family relationship
    const familyMember = await prisma.familyMember.create({
      data: {
        parentId: parentProfile.id,
        childId: child.id,
        relationship: relationship || 'parent',
      },
      include: {
        child: {
          include: {
            learnerProfile: true
          }
        }
      }
    });

    res.json({
      message: 'Child linked successfully',
      familyMember,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Child already linked to this account' });
    }
    console.error('Error linking child:', error);
    res.status(500).json({ message: 'Failed to link child' });
  }
});

/**
 * GET /api/parent/homeschool/schedule
 * Get weekly schedule for all children (homeschool feature)
 */
router.get('/homeschool/schedule', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { week } = req.query; // Format: YYYY-MM-DD (Monday of the week)

    const weekStart = week
      ? new Date(week as string)
      : getMonday(new Date());

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // Get all children
    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId },
      include: {
        children: {
          include: {
            child: true,
          },
        },
      },
    });

    if (!parentProfile) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    // Get scheduled lessons for each child
    const scheduleData = await Promise.all(
      parentProfile.children.map(async (fm) => {
        const scheduledLessons = await prisma.scheduledLesson.findMany({
          where: {
            learnerId: fm.childId,
            scheduledDate: {
              gte: weekStart,
              lt: weekEnd,
            },
          },
          orderBy: { scheduledDate: 'asc' },
        });

        return {
          childId: fm.childId,
          childName: `${fm.child.firstName} ${fm.child.lastName}`,
          lessons: scheduledLessons,
        };
      })
    );

    res.json({
      weekStart,
      weekEnd,
      schedule: scheduleData,
    });
  } catch (error) {
    console.error('Error fetching homeschool schedule:', error);
    res.status(500).json({ message: 'Failed to fetch schedule' });
  }
});

/**
 * POST /api/parent/homeschool/schedule
 * Create or update scheduled lesson
 */
router.post('/homeschool/schedule', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId, lessonId, scheduledDate, scheduledTime } = req.body;

    // Verify parent has access to this child
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Combine date and time
    const dateTime = new Date(scheduledDate);
    if (scheduledTime) {
      const [hours, minutes] = scheduledTime.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));
    }

    // Create scheduled lesson
    const scheduled = await prisma.scheduledLesson.create({
      data: {
        learnerId: childId,
        lessonId,
        scheduledDate: dateTime,
      },
    });

    res.json({
      message: 'Lesson scheduled successfully',
      scheduled,
    });
  } catch (error) {
    console.error('Error scheduling lesson:', error);
    res.status(500).json({ message: 'Failed to schedule lesson' });
  }
});

/**
 * GET /api/parent/portfolio/:childId
 * Get child's portfolio items
 */
router.get('/portfolio/:childId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId } = req.params;

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get learner profile
    const learnerProfile = await prisma.learnerProfile.findUnique({
      where: { userId: childId },
      include: {
        portfolioItems: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!learnerProfile) {
      return res.status(404).json({ message: 'Learner profile not found' });
    }

    res.json({
      portfolioItems: learnerProfile.portfolioItems,
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio' });
  }
});

/**
 * POST /api/parent/portfolio
 * Add item to child's portfolio
 */
router.post('/portfolio', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const {
      childId,
      title,
      description,
      itemType,
      contentUrl,
      relatedCompetencies,
      learnerReflection,
    } = req.body;

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create portfolio item
    const item = await prisma.portfolioItem.create({
      data: {
        learnerId: childId,
        title,
        description,
        itemType,
        contentUrl,
        relatedCompetencies,
        learnerReflection,
      },
    });

    res.json({
      message: 'Portfolio item added successfully',
      item,
    });
  } catch (error) {
    console.error('Error adding portfolio item:', error);
    res.status(500).json({ message: 'Failed to add portfolio item' });
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
 * Format timestamp
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
 * Get Monday of current week
 */
function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * Calculate weekly activity hours
 */
async function calculateWeeklyActivity(childId: string) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const progress = await prisma.lessonProgress.findMany({
    where: {
      learnerId: childId,
      lastAccessedAt: { gte: weekAgo },
    },
  });

  // Group by day
  const activityByDay: { [key: string]: number } = {};
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  days.forEach(day => {
    activityByDay[day] = 0;
  });

  progress.forEach(p => {
    const day = days[new Date(p.lastAccessedAt).getDay()];
    activityByDay[day] += (p.duration || 0);
  });

  return Object.entries(activityByDay).map(([day, minutes]) => ({
    day,
    minutes,
  }));
}

/**
 * Analyze progress for strengths and challenges
 */
async function analyzeProgress(childId: string) {
  const progress = await prisma.lessonProgress.findMany({
    where: { learnerId: childId },
  });

  const masteredCount = progress.filter(p => p.status === 'MASTERED').length;
  const strugglingCount = progress.filter(p => p.status === 'STRUGGLING').length;
  const avgScore = progress.length > 0
    ? progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length
    : 0;

  const strengths: string[] = [];
  const challenges: string[] = [];

  if (masteredCount > 5) {
    strengths.push('Quick mastery of new concepts');
  }
  if (avgScore > 85) {
    strengths.push('Consistently high performance');
  }
  if (strugglingCount > 3) {
    challenges.push('Some lessons require multiple attempts');
  }
  if (avgScore < 70) {
    challenges.push('May benefit from additional support');
  }

  return {
    strengths: strengths.length > 0 ? strengths : ['Building strong foundation'],
    challenges: challenges.length > 0 ? challenges : ['None identified'],
    recommendations: generateRecommendations(avgScore, masteredCount, strugglingCount),
  };
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(avgScore: number, masteredCount: number, strugglingCount: number): string[] {
  const recommendations: string[] = [];

  if (avgScore < 70) {
    recommendations.push('Consider shorter, more frequent practice sessions');
    recommendations.push('Review accessibility settings to reduce barriers');
  }
  if (strugglingCount > 3) {
    recommendations.push('Focus on mastering current concepts before advancing');
    recommendations.push('Consult with educator for targeted support');
  }
  if (masteredCount > 10 && avgScore > 85) {
    recommendations.push('Ready for more challenging content');
    recommendations.push('Explore enrichment activities');
  }

  if (recommendations.length === 0) {
    recommendations.push('Continue current learning pace');
    recommendations.push('Celebrate progress regularly');
  }

  return recommendations;
}

export default router;

/**
 * POST /api/parent/onboarding
 * Complete parent onboarding
 */
router.post('/onboarding', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const {
      children,
      role,
      notifications,
      notificationMethod,
      preferredTime,
    } = req.body;

    // Get or create parent profile
    const parentProfile = await prisma.parentProfile.upsert({
      where: { userId },
      update: {
        role: role === 'parent-educator' ? 'EDUCATOR' : 'PARENT',
        notificationPreferences: notifications,
        notificationMethod,
        preferredNotificationTime: preferredTime,
      },
      create: {
        userId,
        role: role === 'parent-educator' ? 'EDUCATOR' : 'PARENT',
        notificationPreferences: notifications,
        notificationMethod,
        preferredNotificationTime: preferredTime,
      },
    });

    // Link children
    for (const child of children) {
      const learner = await prisma.user.findFirst({
        where: {
          email: { contains: child.childCode },
        },
      });

      if (learner) {
        await prisma.familyMember.upsert({
          where: {
            parentId_childId: {
              parentId: parentProfile.id,
              childId: learner.id,
            },
          },
          update: {
            relationship: child.relationship || 'parent',
          },
          create: {
            parentId: parentProfile.id,
            childId: learner.id,
            relationship: child.relationship || 'parent',
          },
        });
      }
    }

    res.json({
      message: 'Onboarding completed successfully',
      parentProfile,
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    res.status(500).json({ message: 'Failed to complete onboarding' });
  }
});

/**
 * GET /api/parent/teaching/lessons/:lessonId
 * Get lesson data for teaching interface
 */
router.get('/teaching/lessons/:lessonId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { lessonId } = req.params;

    // Verify parent has educator role
    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId },
    });

    if (!parentProfile || parentProfile.role !== 'EDUCATOR') {
      return res.status(403).json({ message: 'Educator role required' });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        steps: true,
      },
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({ lesson });
  } catch (error) {
    console.error('Error fetching teaching lesson:', error);
    res.status(500).json({ message: 'Failed to fetch lesson' });
  }
});

/**
 * POST /api/parent/teaching/lessons/:lessonId/notes
 * Save teaching notes
 */
router.post('/teaching/lessons/:lessonId/notes', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { lessonId } = req.params;
    const { studentId, notes, timeSpent, completedSteps } = req.body;

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId: studentId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Save teaching notes
    const teachingNote = await prisma.teachingNote.create({
      data: {
        parentId: familyMember.parentId,
        learnerId: studentId,
        lessonId,
        notes,
        timeSpent,
        completedSteps,
      },
    });

    res.json({
      message: 'Notes saved successfully',
      teachingNote,
    });
  } catch (error) {
    console.error('Error saving teaching notes:', error);
    res.status(500).json({ message: 'Failed to save notes' });
  }
});

/**
 * POST /api/parent/flexibility/:childId/pause
 * Pause child's learning plan
 */
router.post('/flexibility/:childId/pause', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId } = req.params;
    const { reason, duration } = req.body;

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Calculate resume date
    const resumeDate = new Date();
    switch (duration) {
      case '1-week':
        resumeDate.setDate(resumeDate.getDate() + 7);
        break;
      case '2-weeks':
        resumeDate.setDate(resumeDate.getDate() + 14);
        break;
      case '1-month':
        resumeDate.setMonth(resumeDate.getMonth() + 1);
        break;
    }

    // Update learner profile
    await prisma.learnerProfile.update({
      where: { userId: childId },
      data: {
        learningStatus: 'PAUSED',
        pauseReason: reason,
        pauseUntil: resumeDate,
      },
    });

    res.json({
      message: 'Learning plan paused',
      resumeDate,
    });
  } catch (error) {
    console.error('Error pausing learning plan:', error);
    res.status(500).json({ message: 'Failed to pause learning plan' });
  }
});

/**
 * POST /api/parent/flexibility/:childId/resume
 * Resume child's learning plan
 */
router.post('/flexibility/:childId/resume', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId } = req.params;

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update learner profile
    await prisma.learnerProfile.update({
      where: { userId: childId },
      data: {
        learningStatus: 'ACTIVE',
        pauseReason: null,
        pauseUntil: null,
      },
    });

    res.json({
      message: 'Learning plan resumed',
    });
  } catch (error) {
    console.error('Error resuming learning plan:', error);
    res.status(500).json({ message: 'Failed to resume learning plan' });
  }
});

/**
 * POST /api/parent/flexibility/:childId/mode
 * Set learning mode (light-load, catch-up, sick-day)
 */
router.post('/flexibility/:childId/mode', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId } = req.params;
    const { mode, weeks } = req.body;

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const modeUntil = new Date();
    modeUntil.setDate(modeUntil.getDate() + (weeks || 1) * 7);

    // Update learner profile
    await prisma.learnerProfile.update({
      where: { userId: childId },
      data: {
        learningStatus: mode.toUpperCase().replace('-', '_'),
        modeUntil,
      },
    });

    res.json({
      message: `${mode} mode activated`,
      until: modeUntil,
    });
  } catch (error) {
    console.error('Error setting learning mode:', error);
    res.status(500).json({ message: 'Failed to set learning mode' });
  }
});

/**
 * GET /api/parent/flexibility/:childId/offline-packs
 * Get available offline lesson packs
 */
router.get('/flexibility/:childId/offline-packs', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId } = req.params;

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get child's learner profile
    const learnerProfile = await prisma.learnerProfile.findUnique({
      where: { userId: childId },
    });

    if (!learnerProfile) {
      return res.status(404).json({ message: 'Learner profile not found' });
    }

    // Get lessons at child's proficiency level
    const lessons = await prisma.lesson.findMany({
      where: {
        language: learnerProfile.learningLanguages[0] || 'en',
        gradeLevel: learnerProfile.grade,
        isPublished: true,
      },
      include: {
        steps: true,
      },
      take: 10, // Limit to 10 lessons per pack
      orderBy: { createdAt: 'desc' },
    });

    // Group into packs by subject
    const packs = lessons.reduce((acc: any, lesson) => {
      const subject = lesson.subject || 'General';
      if (!acc[subject]) {
        acc[subject] = {
          subject,
          lessons: [],
          totalDuration: 0,
        };
      }
      acc[subject].lessons.push({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.estimatedDuration || 30,
        steps: lesson.steps.length,
      });
      acc[subject].totalDuration += lesson.estimatedDuration || 30;
      return acc;
    }, {});

    res.json({
      packs: Object.values(packs),
      message: 'Offline packs available for download',
    });
  } catch (error) {
    console.error('Error fetching offline packs:', error);
    res.status(500).json({ message: 'Failed to fetch offline packs' });
  }
});

/**
 * POST /api/parent/flexibility/:childId/offline-packs/:packId/download
 * Download offline pack
 */
router.post('/flexibility/:childId/offline-packs/:packId/download', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId, packId } = req.params;

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // In production, this would generate a downloadable ZIP file with lesson content
    // For now, return pack metadata
    res.json({
      message: 'Pack ready for download',
      packId,
      downloadUrl: `/api/parent/flexibility/${childId}/offline-packs/${packId}/content`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });
  } catch (error) {
    console.error('Error downloading offline pack:', error);
    res.status(500).json({ message: 'Failed to download pack' });
  }
});

/**
 * GET /api/parent/learning/courses
 * Get available parent courses
 */
router.get('/learning/courses', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId },
      include: {
        courseProgress: {
          include: {
            course: true,
          },
        },
      },
    });

    // Get all available courses
    const allCourses = await prisma.parentCourse.findMany({
      where: { isPublished: true },
    });

    // Merge with progress
    const coursesWithProgress = allCourses.map(course => {
      const progress = parentProfile?.courseProgress.find(cp => cp.courseId === course.id);
      return {
        ...course,
        progress: progress?.progress || 0,
        status: progress?.status || 'not-started',
        certificateAvailable: progress?.status === 'completed',
      };
    });

    res.json({ courses: coursesWithProgress });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

/**
 * POST /api/parent/learning/courses/:courseId/progress
 * Update course progress
 */
router.post('/learning/courses/:courseId/progress', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { courseId } = req.params;
    const { progress, completed } = req.body;

    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId },
    });

    if (!parentProfile) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    // Upsert progress
    const courseProgress = await prisma.parentCourseProgress.upsert({
      where: {
        parentId_courseId: {
          parentId: parentProfile.id,
          courseId,
        },
      },
      update: {
        progress,
        status: completed ? 'completed' : progress > 0 ? 'in-progress' : 'not-started',
        completedAt: completed ? new Date() : null,
      },
      create: {
        parentId: parentProfile.id,
        courseId,
        progress,
        status: completed ? 'completed' : 'in-progress',
        completedAt: completed ? new Date() : null,
      },
    });

    res.json({
      message: 'Progress updated',
      courseProgress,
    });
  } catch (error) {
    console.error('Error updating course progress:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

/**
 * GET /api/parent/learning/office-hours
 * Get upcoming office hours
 */
router.get('/learning/office-hours', async (req: Request, res: Response) => {
  try {
    const officeHours = await prisma.officeHour.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: { date: 'asc' },
      include: {
        registrations: true,
      },
    });

    const userId = (req as any).user.id;

    const sessionsWithRegistration = officeHours.map(session => ({
      ...session,
      spotsLeft: session.maxParticipants - session.registrations.length,
      registered: session.registrations.some(r => r.parentId === userId),
    }));

    res.json({ sessions: sessionsWithRegistration });
  } catch (error) {
    console.error('Error fetching office hours:', error);
    res.status(500).json({ message: 'Failed to fetch office hours' });
  }
});

/**
 * POST /api/parent/learning/office-hours/:id/register
 * Register for office hour session
 */
router.post('/learning/office-hours/:id/register', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId },
    });

    if (!parentProfile) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    // Check capacity
    const session = await prisma.officeHour.findUnique({
      where: { id },
      include: { registrations: true },
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.registrations.length >= session.maxParticipants) {
      return res.status(400).json({ message: 'Session is full' });
    }

    // Register
    const registration = await prisma.officeHourRegistration.create({
      data: {
        officeHourId: id,
        parentId: parentProfile.id,
      },
    });

    res.json({
      message: 'Registered successfully',
      registration,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Already registered for this session' });
    }
    console.error('Error registering for office hours:', error);
    res.status(500).json({ message: 'Failed to register' });
  }
});

/**
 * GET /api/parent/learning/forum
 * Get forum posts
 */
router.get('/learning/forum', async (req: Request, res: Response) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;

    const where: any = {};
    if (category && category !== 'All') {
      where.category = category;
    }

    const posts = await prisma.forumPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            replies: true,
            likes: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await prisma.forumPost.count({ where });

    res.json({
      posts: posts.map(p => ({
        ...p,
        authorAvatar: (p.author.firstName?.[0] || 'U').toUpperCase(),
        replies: p._count.replies,
        likes: p._count.likes,
      })),
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({ message: 'Failed to fetch forum posts' });
  }
});

/**
 * POST /api/parent/learning/forum
 * Create forum post
 */
router.post('/learning/forum', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { title, content, category } = req.body;

    const post = await prisma.forumPost.create({
      data: {
        authorId: userId,
        title,
        content,
        category,
      },
    });

    res.json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    console.error('Error creating forum post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

/**
 * POST /api/parent/learning/forum/:postId/reply
 * Reply to a forum post
 */
router.post('/learning/forum/:postId/reply', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { postId } = req.params;
    const { content } = req.body;

    // Verify post exists
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reply = await prisma.forumReply.create({
      data: {
        postId,
        authorId: userId,
        content,
      },
    });

    res.json({
      message: 'Reply added successfully',
      reply,
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Failed to add reply' });
  }
});

/**
 * GET /api/parent/learning/forum/:postId/replies
 * Get replies for a forum post
 */
router.get('/learning/forum/:postId/replies', async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const replies = await prisma.forumReply.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ replies });
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ message: 'Failed to fetch replies' });
  }
});

/**
 * POST /api/parent/learning/forum/:postId/like
 * Like/unlike a forum post
 */
router.post('/learning/forum/:postId/like', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { postId } = req.params;

    // Check if already liked
    const existingLike = await prisma.forumLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      // Unlike - remove the like
      await prisma.forumLike.delete({
        where: { id: existingLike.id },
      });

      res.json({
        message: 'Post unliked',
        liked: false,
      });
    } else {
      // Like - create new like
      await prisma.forumLike.create({
        data: {
          postId,
          userId,
        },
      });

      res.json({
        message: 'Post liked',
        liked: true,
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
});

/**
 * GET /api/parent/portfolio/:childId/logs
 * Get lesson logs for child
 */
router.get('/portfolio/:childId/logs', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId } = req.params;

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const logs = await prisma.lessonLog.findMany({
      where: { learnerId: childId },
      orderBy: { date: 'desc' },
      include: {
        workSamples: true,
      },
    });

    res.json({ logs });
  } catch (error) {
    console.error('Error fetching lesson logs:', error);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

/**
 * POST /api/parent/portfolio/:childId/logs
 * Create lesson log
 */
router.post('/portfolio/:childId/logs', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId } = req.params;
    const { date, subject, topic, duration, competenciesCovered, parentReflection } = req.body;

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const log = await prisma.lessonLog.create({
      data: {
        learnerId: childId,
        date: new Date(date),
        subject,
        topic,
        duration,
        competenciesCovered,
        parentReflection,
      },
    });

    res.json({
      message: 'Lesson log created',
      log,
    });
  } catch (error) {
    console.error('Error creating lesson log:', error);
    res.status(500).json({ message: 'Failed to create log' });
  }
});

/**
 * POST /api/parent/portfolio/:childId/work-samples
 * Upload work sample with file
 */
router.post('/portfolio/:childId/work-samples', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId } = req.params;
    const { title, type, subject, competencies, lessonLogId } = req.body;

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get file URL
    const fileUrl = getFileUrl(req.file.filename);

    // Parse competencies if it's a JSON string
    const parsedCompetencies = typeof competencies === 'string'
      ? JSON.parse(competencies)
      : competencies;

    const workSample = await prisma.workSample.create({
      data: {
        learnerId: childId,
        lessonLogId: lessonLogId || undefined,
        title,
        type,
        subject,
        competencies: parsedCompetencies || [],
        fileUrl,
      },
    });

    res.json({
      message: 'Work sample uploaded',
      workSample,
    });
  } catch (error) {
    console.error('Error uploading work sample:', error);
    res.status(500).json({ message: 'Failed to upload work sample' });
  }
});

/**
 * GET /api/parent/portfolio/:childId/competencies
 * Get NIOS competencies
 */
router.get('/portfolio/:childId/competencies', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId } = req.params;

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const competencies = await prisma.nIOSCompetency.findMany({
      where: { learnerId: childId },
      include: {
        _count: {
          select: {
            evidences: true,
          },
        },
      },
    });

    res.json({
      competencies: competencies.map(c => ({
        ...c,
        evidenceCount: c._count.evidences,
      })),
    });
  } catch (error) {
    console.error('Error fetching competencies:', error);
    res.status(500).json({ message: 'Failed to fetch competencies' });
  }
});

/**
 * POST /api/parent/portfolio/:childId/export
 * Export portfolio reports
 */
router.post('/portfolio/:childId/export', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId } = req.params;
    const { type } = req.body; // 'progress', 'hours', 'annual'

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate export data
    const data = await generateExportData(childId, type);

    res.json({
      message: 'Export generated',
      data,
      downloadUrl: `/api/parent/portfolio/${childId}/download/${type}`,
    });
  } catch (error) {
    console.error('Error exporting portfolio:', error);
    res.status(500).json({ message: 'Failed to export portfolio' });
  }
});

/**
 * GET /api/parent/portfolio/:childId/download/:type
 * Download portfolio report
 */
router.get('/portfolio/:childId/download/:type', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childId, type } = req.params;

    // Verify access
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        parent: { userId },
        childId,
      },
    });

    if (!familyMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate export data
    const data = await generateExportData(childId, type);

    // Get child name for filename
    const child = await prisma.user.findUnique({
      where: { id: childId },
    });
    const childName = `${child?.firstName}_${child?.lastName}`.replace(/\s+/g, '_');
    const filename = `${childName}_${type}_report_${new Date().toISOString().split('T')[0]}.json`;

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/json');

    // Send the data as downloadable JSON
    // Note: In production, this would generate a PDF using pdfkit or puppeteer
    res.json(data);
  } catch (error) {
    console.error('Error downloading portfolio:', error);
    res.status(500).json({ message: 'Failed to download portfolio' });
  }
});

/**
 * GET /api/parent/family
 * Get family dashboard data (all children)
 */
router.get('/family', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const parentProfile = await prisma.parentProfile.findUnique({
      where: { userId },
      include: {
        children: {
          include: {
            child: {
              include: {
                learnerProfile: true,
              },
            },
          },
        },
      },
    });

    if (!parentProfile) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    // Get today's schedule for all children
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const childrenData = await Promise.all(
      parentProfile.children.map(async (fm) => {
        const todaySchedule = await prisma.scheduledLesson.findMany({
          where: {
            learnerId: fm.childId,
            scheduledDate: {
              gte: today,
              lt: tomorrow,
            },
          },
          include: {
            lesson: true,
          },
          orderBy: { scheduledDate: 'asc' },
        });

        // Calculate weekly hours
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const weeklyProgress = await prisma.lessonProgress.findMany({
          where: {
            learnerId: fm.childId,
            lastAccessedAt: { gte: weekAgo },
          },
        });

        const weeklyHours = weeklyProgress.reduce((sum, p) => sum + (p.duration || 0), 0) / 60;

        return {
          id: fm.childId,
          name: `${fm.child.firstName} ${fm.child.lastName}`,
          avatar: (fm.child.firstName?.[0] || '').toUpperCase(),
          grade: fm.child.learnerProfile?.grade || 'N/A',
          status: fm.child.learnerProfile?.learningStatus || 'active',
          todaySchedule: todaySchedule.map(s => ({
            time: s.scheduledDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            subject: s.lesson.subject,
            duration: s.lesson.estimatedDuration || 30,
            type: 'guided',
            completed: s.completedAt !== null,
          })),
          weeklyHours,
          recommendedHours: fm.child.learnerProfile?.weeklyTargetHours || 10,
        };
      })
    );

    res.json({
      children: childrenData,
    });
  } catch (error) {
    console.error('Error fetching family dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch family dashboard' });
  }
});

/**
 * POST /api/parent/family/bulk-action
 * Perform bulk action on selected children
 */
router.post('/family/bulk-action', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { childrenIds, action } = req.body;

    // Verify access to all children
    const familyMembers = await prisma.familyMember.findMany({
      where: {
        parent: { userId },
        childId: { in: childrenIds },
      },
    });

    if (familyMembers.length !== childrenIds.length) {
      return res.status(403).json({ message: 'Access denied to some children' });
    }

    // Perform action
    switch (action) {
      case 'pause':
        await prisma.learnerProfile.updateMany({
          where: { userId: { in: childrenIds } },
          data: { learningStatus: 'PAUSED' },
        });
        break;
      case 'vacation':
        const vacationEnd = new Date();
        vacationEnd.setDate(vacationEnd.getDate() + 7);
        await prisma.learnerProfile.updateMany({
          where: { userId: { in: childrenIds } },
          data: {
            learningStatus: 'VACATION',
            pauseUntil: vacationEnd,
          },
        });
        break;
      case 'attendance':
        // Mark attendance for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (const childId of childrenIds) {
          await prisma.attendance.upsert({
            where: {
              learnerId_date: {
                learnerId: childId,
                date: today,
              },
            },
            update: { present: true },
            create: {
              learnerId: childId,
              date: today,
              present: true,
            },
          });
        }
        break;
    }

    res.json({
      message: `Bulk ${action} completed for ${childrenIds.length} children`,
    });
  } catch (error) {
    console.error('Error performing bulk action:', error);
    res.status(500).json({ message: 'Failed to perform bulk action' });
  }
});

/**
 * Helper: Generate export data
 */
async function generateExportData(childId: string, type: string) {
  const child = await prisma.user.findUnique({
    where: { id: childId },
    include: {
      learnerProfile: true,
    },
  });

  switch (type) {
    case 'progress':
      const progress = await prisma.lessonProgress.findMany({
        where: { learnerId: childId },
      });
      return {
        child: `${child?.firstName} ${child?.lastName}`,
        totalLessons: progress.length,
        completed: progress.filter(p => p.status === 'COMPLETED').length,
        averageScore: progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length,
      };

    case 'hours':
      const logs = await prisma.lessonLog.findMany({
        where: { learnerId: childId },
      });
      return {
        child: `${child?.firstName} ${child?.lastName}`,
        totalHours: logs.reduce((sum, l) => sum + l.duration, 0) / 60,
        byMonth: {}, // Would calculate monthly breakdown
      };

    case 'annual':
      const competencies = await prisma.nIOSCompetency.findMany({
        where: { learnerId: childId },
      });
      const samples = await prisma.workSample.findMany({
        where: { learnerId: childId },
      });
      return {
        child: `${child?.firstName} ${child?.lastName}`,
        grade: child?.learnerProfile?.grade,
        competenciesTracked: competencies.length,
        workSamples: samples.length,
        summary: 'Annual review data',
      };

    default:
      return {};
  }
}
