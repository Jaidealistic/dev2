import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    interface JWTPayload {
      userId: string;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY) as unknown as JWTPayload;
    const { userId } = decoded;

    const body = await req.json();
    const { language } = body;

    if (!language) {
      return NextResponse.json({ error: 'Language is required' }, { status: 400 });
    }

    // Update LearnerProfile to include the new language
    // In a real array-append scenario with Prisma + Postgres:
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { learnerProfile: true }
    });

    if (!user || user.role !== 'LEARNER' || !user.learnerProfile) {
      return NextResponse.json({ error: 'Learner profile not found' }, { status: 404 });
    }

    const currentLanguage = user.learnerProfile.learningLanguage;

    if (currentLanguage !== language.toUpperCase()) {
      // Since schema only supports one learning language for now:
      await prisma.learnerProfile.update({
        where: { id: user.learnerProfile.id },
        data: { learningLanguage: language.toUpperCase() }
      });

      return NextResponse.json({ success: true, languages: [language.toUpperCase()] });
    }
    return NextResponse.json({ success: true, languages: [currentLanguage || 'English'] });
  } catch (error) {
    console.error('Add language error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
