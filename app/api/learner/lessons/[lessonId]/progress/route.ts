import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { userId } = decoded;
    const { lessonId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { learnerProfile: true }
    });

    if (!user || !user.learnerProfile) {
      return NextResponse.json({ error: 'Learner profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const { currentSection, totalSections, score } = body;

    const status = currentSection >= totalSections - 1 ? 'COMPLETED' : 'IN_PROGRESS';

    const progress = await prisma.lessonProgress.upsert({
      where: {
        learnerId_lessonId: {
          learnerId: user.learnerProfile.id,
          lessonId
        }
      },
      update: {
        status,
        score: score || 0,
        updatedAt: new Date(),
        completedAt: status === 'COMPLETED' ? new Date() : null
      },
      create: {
        learnerId: user.learnerProfile.id,
        lessonId,
        status,
        score: score || 0
      }
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Progress save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
