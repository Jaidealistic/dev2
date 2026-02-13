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
    const totalLessons = lessonProgress.length;
    const completedLessons = lessonProgress.filter(p => p.status === 'COMPLETED' || p.status === 'MASTERED').length;
    const masteredLessons = lessonProgress.filter(p => p.status === 'MASTERED').length;
    
    // Calculate average score (ignoring nulls)
    const scores = lessonProgress.map(p => p.score).filter(s => s !== null) as number[];
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    // Mock total time for now as it might be stored in ProgressRecord or aggregated
    // In a real app we'd sum up `timeSpentSec` from ProgressRecord
    const totalTime = 120; // minutes (mock)

    // Fetch competencies (mock/placeholder if empty)
    const competencies = await prisma.nIOSCompetency.findMany({
        where: { studentId: learnerId }
    });

    return NextResponse.json({
      competencies: competencies.length > 0 ? competencies : [
          // Mock data if empty
          { id: 'c1', competencyName: 'Vocabulary', masteryLevel: 'DEVELOPING', score: 65 },
          { id: 'c2', competencyName: 'Grammar', masteryLevel: 'BEGINNER', score: 40 },
          { id: 'c3', competencyName: 'Pronunciation', masteryLevel: 'PROFICIENT', score: 85 }
      ],
      lessonProgress: lessonProgress.length > 0 ? lessonProgress : [],
      analytics: {
        totalTime,
        avgScore,
        totalLessons,
        masteredLessons,
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
