import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

interface CompletionRequest {
  score: number;
  duration: number; // in seconds
  errorPatterns?: string[];
  completionType?: 'COMPLETED' | 'MASTERED';
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    // 1. Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    interface JWTPayload {
      userId: string;
    }

    const token = authHeader.split(' ')[1];
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, SECRET_KEY) as JWTPayload;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { userId } = decoded;
    const { lessonId } = await params;

    // 2. Get user and learner profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { learnerProfile: true }
    });

    if (!user || !user.learnerProfile) {
      return NextResponse.json({ error: 'Learner profile not found' }, { status: 404 });
    }

    const learnerId = user.learnerProfile.id;

    // 3. Parse request body
    const body: CompletionRequest = await req.json();
    const { score, duration, errorPatterns = [], completionType } = body;

    // 4. Determine completion status
    const status = completionType || (score >= 90 ? 'MASTERED' : score >= 70 ? 'COMPLETED' : 'IN_PROGRESS');

    // 5. Update or create LessonProgress
    const lessonProgress = await prisma.lessonProgress.upsert({
      where: {
        learnerId_lessonId: {
          learnerId,
          lessonId
        }
      },
      update: {
        status,
        score,
        completedAt: status === 'COMPLETED' || status === 'MASTERED' ? new Date() : null,
        updatedAt: new Date()
      },
      create: {
        learnerId,
        lessonId,
        status,
        score,
        completedAt: status === 'COMPLETED' || status === 'MASTERED' ? new Date() : null
      }
    });

    // 6. Create ProgressRecord for time tracking
    await prisma.progressRecord.create({
      data: {
        learnerId,
        lessonId,
        score,
        timeSpentSec: duration
      }
    });

    // 7. Calculate streak (days with activity in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentProgress = await prisma.lessonProgress.findMany({
      where: {
        learnerId,
        updatedAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Get unique days with activity
    const uniqueDays = new Set(
      recentProgress.map((p: { updatedAt: Date }) => p.updatedAt.toISOString().split('T')[0])
    );
    const currentStreak = uniqueDays.size;

    // 8. Check for new achievements
    const newAchievements = [];
    const totalCompleted = await prisma.lessonProgress.count({
      where: {
        learnerId,
        status: {
          in: ['COMPLETED', 'MASTERED']
        }
      }
    });

    // First lesson achievement
    if (totalCompleted === 1) {
      const firstLessonBadge = await prisma.achievement.findFirst({
        where: {
          learnerId,
          badgeName: 'First Lesson'
        }
      });

      if (!firstLessonBadge) {
        const newBadge = await prisma.achievement.create({
          data: {
            learnerId,
            badgeId: 'milestone-first-lesson',
            badgeName: 'First Lesson',
            description: 'Completed your first lesson',
            earnedAt: new Date()
          }
        });
        newAchievements.push(newBadge);
      }
    }

    // 7-day streak achievement
    if (currentStreak >= 7) {
      const streakBadge = await prisma.achievement.findFirst({
        where: {
          learnerId,
          badgeName: '7 Day Streak'
        }
      });

      if (!streakBadge) {
        const newBadge = await prisma.achievement.create({
          data: {
            learnerId,
            badgeId: 'streak-7-days',
            badgeName: '7 Day Streak',
            description: 'Practiced for 7 days in a row',
            earnedAt: new Date()
          }
        });
        newAchievements.push(newBadge);
      }
    }

    // 9. Calculate total stats for response
    const totalTimeSpent = await prisma.progressRecord.aggregate({
      where: { learnerId },
      _sum: { timeSpentSec: true }
    });

    const totalMinutes = Math.floor((totalTimeSpent._sum.timeSpentSec || 0) / 60);

    // 10. Return comprehensive response
    return NextResponse.json({
      success: true,
      lessonProgress: {
        id: lessonProgress.id,
        status: lessonProgress.status,
        score: lessonProgress.score,
        completedAt: lessonProgress.completedAt
      },
      stats: {
        totalCompleted,
        currentStreak,
        totalMinutesSpent: totalMinutes
      },
      newAchievements: newAchievements.map((a: { id: string; badgeName: string; description: string | null; earnedAt: Date }) => ({
        id: a.id,
        badgeName: a.badgeName,
        description: a.description,
        earnedAt: a.earnedAt
      })),
      message: (() => {
        if (status === 'MASTERED') return 'Excellent work! You mastered this lesson!';
        if (status === 'COMPLETED') return 'Great job completing this lesson!';
        return 'Keep practicing - you\'re making progress!';
      })()
    });

  } catch (error) {
    console.error('Lesson completion error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
