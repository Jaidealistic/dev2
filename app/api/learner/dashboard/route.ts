import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { generateStudentId } from '@/lib/utils';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;

    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { userId } = decoded;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        learnerProfile: true,
      },
    });

    console.log(`[Dashboard Debug] UserID: ${userId}, Found: ${!!user}, Role: ${user?.role}`);

    if (!user) {
      // Token valid but user gone (DB reset?) -> Force logout
      return NextResponse.json({ error: 'Unauthorized - User not found' }, { status: 401 });
    }

    if (user.role !== 'LEARNER') {
      // Wrong role -> Force logout or redirect
      return NextResponse.json({ error: `Unauthorized - Invalid role for this dashboard (Role: ${user.role})` }, { status: 403 });
    }

    // Self-healing: Create profile if missing
    let learnerProfile = user.learnerProfile;
    if (!learnerProfile) {
      learnerProfile = await prisma.learnerProfile.create({
        data: {
          userId: user.id,
          studentId: generateStudentId(),
          learningLanguage: 'ENGLISH' as any // Default
        }
      });
    } else if (!learnerProfile.studentId) {
      // Fix missing student ID if profile exists but ID is null
      learnerProfile = await prisma.learnerProfile.update({
        where: { id: learnerProfile.id },
        data: { studentId: generateStudentId() } as any
      });
    }

    // Map singular database field to plural array for frontend
    // TODO: Migrate schema to support multiple languages
    const languages = learnerProfile.learningLanguage ? [learnerProfile.learningLanguage] : ['English'];

    // Fetch real progress data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [allProgress, recentProgress, totalTimeSpent, achievements] = await Promise.all([
      // All lesson progress
      prisma.lessonProgress.findMany({
        where: { learnerId: learnerProfile.id },
        include: { learner: false },
        orderBy: { updatedAt: 'desc' }
      }),
      // Recent progress for streak calculation
      prisma.lessonProgress.findMany({
        where: {
          learnerId: learnerProfile.id,
          updatedAt: { gte: sevenDaysAgo }
        },
        select: { updatedAt: true }
      }),
      // Total time spent
      prisma.progressRecord.aggregate({
        where: { learnerId: learnerProfile.id },
        _sum: { timeSpentSec: true }
      }),
      // Achievements
      prisma.achievement.findMany({
        where: { learnerId: learnerProfile.id },
        orderBy: { earnedAt: 'desc' }
      })
    ]);

    // Calculate streak from unique days
    const uniqueDays = new Set(
      recentProgress.map(p => p.updatedAt.toISOString().split('T')[0])
    );
    const currentStreak = uniqueDays.size;

    // Calculate completed lessons
    const completedLessons = allProgress.filter(
      p => p.status === 'COMPLETED' || p.status === 'MASTERED'
    ).length;

    // Get recent lessons for dashboard
    const recentLessonsData = allProgress.slice(0, 5).map(p => ({
      id: p.id,
      lessonId: p.lessonId,
      title: `Lesson ${p.lessonId}`, // TODO: Join with actual lesson titles from MongoDB
      status: p.status.toLowerCase().replace('_', '-'),
      progress: p.score || 0,
      score: p.score
    }));

    const dashboardData = {
      learnerName: user.firstName,
      learningLanguages: languages,
      availableLanguages: ['English', 'Tamil'].filter(lang => !languages.includes(lang)),
      perLanguage: {},
    };

    // Populate per-language stats with REAL data
    if (dashboardData.learningLanguages.length > 0) {
      dashboardData.learningLanguages.forEach((lang: string) => {
        (dashboardData.perLanguage as any)[lang] = {
          currentStreak,
          totalLessons: 20, // TODO: Count actual lessons for this language from MongoDB
          completedLessons,
          wordsLearned: completedLessons * 13, // Approximation: ~13 words per lesson
          totalPracticeMinutes: Math.floor((totalTimeSpent._sum.timeSpentSec || 0) / 60),
          currentGoal: completedLessons === 0
            ? `Complete your first ${lang} lesson`
            : completedLessons < 5
              ? `Complete ${5 - completedLessons} more lessons to unlock achievements`
              : `Keep up your learning streak!`,
          goalProgress: Math.min((completedLessons / 20) * 100, 100),
          recentLessons: recentLessonsData,
          achievements: [
            {
              id: 'a1',
              title: 'First Lesson',
              earned: achievements.some(a => a.badgeName === 'First Lesson')
            },
            {
              id: 'a2',
              title: '7 Day Streak',
              earned: achievements.some(a => a.badgeName === '7 Day Streak')
            },
            {
              id: 'a3',
              title: '5 Lessons',
              earned: completedLessons >= 5
            },
            {
              id: 'a4',
              title: 'Perfect Score',
              earned: allProgress.some(p => (p.score || 0) >= 100)
            }
          ],
        };
      });
    }

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Dashboard fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
