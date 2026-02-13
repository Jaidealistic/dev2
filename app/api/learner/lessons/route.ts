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

    // 1. Fetch real lessons from DB
    const dbLessons = await prisma.lesson.findMany({
      where: { isPublished: true },
      include: { steps: true }
    });

    // 2. Fetch user progress
    const progressMap = new Map();
    const progressRecords = await prisma.lessonProgress.findMany({
        where: { learnerId }
    });
    progressRecords.forEach(p => progressMap.set(p.lessonId, p));

    // 3. Map DB lessons to frontend structure
    const mappedDbLessons = dbLessons.map(lesson => {
        const progress = progressMap.get(lesson.id);
        return {
            id: lesson.id,
            title: lesson.title,
            description: lesson.description || '',
            language: lesson.language,
            gradeLevel: lesson.gradeLevel || 'All',
            duration: 15, // Default or calc from steps
            competencies: [],
            learningObjectives: [],
            hasTranscripts: true, // Mock defaults
            hasCaptions: false,
            progress: {
                status: progress?.status || 'NOT_STARTED',
                score: progress?.score || 0,
                attemptCount: 1, // field pending in schema
                lastAccessedAt: progress?.updatedAt?.toISOString() || null
            }
        };
    });

    // 4. Add Mock Recommended Lessons (if not already in DB)
    // We check if they differ by ID to avoid duplicates if we ever seed them
    const mockLessons = [
        {
            id: 'l-1',
            title: 'Greetings & Introductions',
            description: 'Learn common greetings and introductions',
            language: 'English',
            gradeLevel: 'Beginner',
            duration: 15,
            competencies: ['Speaking', 'Listening'],
            learningObjectives: ['Say hello', 'Introduce yourself'],
            hasTranscripts: true,
            hasCaptions: true,
            progress: {
                status: 'NOT_STARTED', // We'd ideally check progressMap here too if we saved progress for l-1
                score: 0,
                attemptCount: 0,
                lastAccessedAt: null
            }
        },
        {
            id: 'l-9',
            title: 'Tamil Alphabets – Uyir',
            description: 'Learn the foundational vowel letters of Tamil script',
            language: 'Tamil',
            gradeLevel: 'Beginner',
            duration: 20,
            competencies: ['Reading', 'Pronunciation'],
            learningObjectives: ['Identify vowel letters', 'Pronounce vowels correctly'],
            hasTranscripts: false,
            hasCaptions: true,
            progress: {
                status: 'NOT_STARTED',
                score: 0,
                attemptCount: 0,
                lastAccessedAt: null
            }
        }
    ];

    // Update mock progress if exists
    mockLessons.forEach(ml => {
        const progress = progressMap.get(ml.id);
        if (progress) {
            ml.progress = {
                status: progress.status,
                score: progress.score || 0,
                attemptCount: 1,
                lastAccessedAt: progress.updatedAt.toISOString()
            };
        }
    });

    // Combine
    const finalLessons = [...mappedDbLessons, ...mockLessons];

    return NextResponse.json({
      lessons: finalLessons
    });

  } catch (error) {
    console.error('Lessons list fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
