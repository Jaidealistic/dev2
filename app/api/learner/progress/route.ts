import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

export async function GET(req: Request) {
  try {
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { learnerProfile: true }
    });

    if (!user || !user.learnerProfile) {
      return NextResponse.json({ error: 'Learner profile not found' }, { status: 404 });
    }

    const learnerId = user.learnerProfile.id;

    // Fetch real progress from DB
    const lessonProgress = await prisma.lessonProgress.findMany({
      where: { learnerId },
      orderBy: { updatedAt: 'desc' },
      take: 20
    });

    // Calculate analytics
    interface LessonProgress {
      status: string;
      score: number | null;
    }

    const totalLessons = lessonProgress.length;
    const completedLessons = (lessonProgress as unknown as LessonProgress[]).filter((p: LessonProgress) => p.status === 'COMPLETED' || p.status === 'MASTERED').length;
    const masteredLessons = (lessonProgress as unknown as LessonProgress[]).filter((p: LessonProgress) => p.status === 'MASTERED').length;

    // Calculate average score (ignoring nulls)
    const scores = (lessonProgress as unknown as LessonProgress[]).map((p: LessonProgress) => p.score).filter((s: number | null): s is number => s !== null);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;

    // Aggregate real total time from ProgressRecord
    const timeAgg = await prisma.progressRecord.aggregate({
      where: { learnerId },
      _sum: { timeSpentSec: true },
    });
    const totalTime = Math.floor((timeAgg._sum.timeSpentSec || 0) / 60); // minutes

    // Fetch real competencies
    const competencies = await prisma.nIOSCompetency.findMany({
      where: { studentId: learnerId }
    });

    return NextResponse.json({
      competencies,
      lessonProgress: lessonProgress.length > 0 ? lessonProgress : [],
      analytics: {
        totalTime,
        avgScore,
        totalLessons,
        masteredLessons,
        completedLessons,
      }
    });

  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
