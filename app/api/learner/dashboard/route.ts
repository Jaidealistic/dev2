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
                learningLanguage: 'ENGLISH' // Default
            }
        });
    } else if (!learnerProfile.studentId) {
        // Fix missing student ID if profile exists but ID is null
         learnerProfile = await prisma.learnerProfile.update({
             where: { id: learnerProfile.id },
             data: { studentId: generateStudentId() }
         });
    }

    // Map singular database field to plural array for frontend
    // TODO: Migrate schema to support multiple languages
    const languages = learnerProfile.learningLanguage ? [learnerProfile.learningLanguage] : ['English'];

    // Mock data for now, eventually this should come from real progress tracking tables
    const dashboardData = {
      learnerName: user.firstName,
      learningLanguages: languages,
      availableLanguages: ['English', 'Tamil'], // Could be dynamic
      perLanguage: {},
    };

    // Populate per-language stats mock
    if (dashboardData.learningLanguages.length > 0) {
      dashboardData.learningLanguages.forEach((lang: string) => {
        (dashboardData.perLanguage as any)[lang] = {
           currentStreak: 0,
           totalLessons: 10,
           completedLessons: 0,
           wordsLearned: 0,
           totalPracticeMinutes: 0,
           currentGoal: `Complete your first ${lang} lesson`,
           goalProgress: 0,
           recentLessons: [], // { id, title, status, progress, score, lessonId }
           achievements: [
             { id: 'a1', title: 'First Lesson', earned: false },
             { id: 'a2', title: '7 Day Streak', earned: false },
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
