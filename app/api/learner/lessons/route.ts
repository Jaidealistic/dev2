import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Lesson from '@/lib/models/Lesson';

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

    // Connect to MongoDB for lessons
    await dbConnect();

    // Fetch lessons from MongoDB
    const mongoLessons = await Lesson.find({ isPublished: true }).lean();

    // Fetch user progress from PostgreSQL
    const progressMap = new Map();
    const progressRecords = await prisma.lessonProgress.findMany({
      where: { learnerId }
    });
    progressRecords.forEach(p => progressMap.set(p.lessonId, p));

    // Map MongoDB lessons to frontend structure
    const mappedLessons = mongoLessons.map((lesson: any) => {
      const progress = progressMap.get(lesson.lessonId || lesson._id.toString());
      return {
        id: lesson.lessonId || lesson._id.toString(),
        title: lesson.title,
        description: lesson.description || '',
        language: lesson.language || 'English',
        gradeLevel: lesson.gradeLevel || 'All',
        duration: lesson.duration || 15,
        competencies: lesson.competencies || [],
        learningObjectives: lesson.learningObjectives || [],
        hasTranscripts: lesson.hasTranscripts !== false,
        hasCaptions: lesson.hasCaptions !== false,
        progress: {
          status: progress?.status || 'NOT_STARTED',
          score: progress?.score || 0,
          attemptCount: 1,
          lastAccessedAt: progress?.updatedAt?.toISOString() || null
        }
      };
    });

    // Add mock lessons as fallback if MongoDB is empty
    const mockLessons = [
      {
        id: 'l-1',
        title: 'Greetings & Introductions',
        description: 'Learn common greetings and introductions in English',
        language: 'English',
        gradeLevel: 'Beginner',
        duration: 15,
        competencies: ['Speaking', 'Listening'],
        learningObjectives: ['Say hello', 'Introduce yourself'],
        hasTranscripts: true,
        hasCaptions: true,
        progress: {
          status: progressMap.get('l-1')?.status || 'NOT_STARTED',
          score: progressMap.get('l-1')?.score || 0,
          attemptCount: 0,
          lastAccessedAt: progressMap.get('l-1')?.updatedAt?.toISOString() || null
        }
      },
      {
        id: 'l-9',
        title: 'Tamil Alphabets – Uyir (உயிர்)',
        description: 'Learn the foundational vowel letters of Tamil script',
        language: 'Tamil',
        gradeLevel: 'Beginner',
        duration: 20,
        competencies: ['Reading', 'Pronunciation'],
        learningObjectives: ['Identify vowel letters', 'Pronounce vowels correctly'],
        hasTranscripts: false,
        hasCaptions: true,
        progress: {
          status: progressMap.get('l-9')?.status || 'NOT_STARTED',
          score: progressMap.get('l-9')?.score || 0,
          attemptCount: 0,
          lastAccessedAt: progressMap.get('l-9')?.updatedAt?.toISOString() || null
        }
      },
      {
        id: 'l-2',
        title: 'English Basics: Numbers & Counting',
        description: 'Master numbers 1-100 and basic counting in English',
        language: 'English',
        gradeLevel: 'Beginner',
        duration: 12,
        competencies: ['Vocabulary', 'Pronunciation'],
        learningObjectives: ['Count to 100', 'Recognize written numbers'],
        hasTranscripts: true,
        hasCaptions: true,
        progress: {
          status: progressMap.get('l-2')?.status || 'NOT_STARTED',
          score: progressMap.get('l-2')?.score || 0,
          attemptCount: 0,
          lastAccessedAt: progressMap.get('l-2')?.updatedAt?.toISOString() || null
        }
      },
      {
        id: 'l-10',
        title: 'Tamil Numbers (எண்கள்)',
        description: 'Learn Tamil numbers and counting from 1 to 100',
        language: 'Tamil',
        gradeLevel: 'Beginner',
        duration: 18,
        competencies: ['Vocabulary', 'Reading'],
        learningObjectives: ['Count in Tamil', 'Read Tamil numerals'],
        hasTranscripts: false,
        hasCaptions: true,
        progress: {
          status: progressMap.get('l-10')?.status || 'NOT_STARTED',
          score: progressMap.get('l-10')?.score || 0,
          attemptCount: 0,
          lastAccessedAt: progressMap.get('l-10')?.updatedAt?.toISOString() || null
        }
      },
      {
        id: 'l-3',
        title: 'Daily Conversations in English',
        description: 'Practice common phrases for everyday situations',
        language: 'English',
        gradeLevel: 'Intermediate',
        duration: 20,
        competencies: ['Speaking', 'Listening', 'Comprehension'],
        learningObjectives: ['Order food', 'Ask for directions', 'Make small talk'],
        hasTranscripts: true,
        hasCaptions: true,
        progress: {
          status: progressMap.get('l-3')?.status || 'NOT_STARTED',
          score: progressMap.get('l-3')?.score || 0,
          attemptCount: 0,
          lastAccessedAt: progressMap.get('l-3')?.updatedAt?.toISOString() || null
        }
      },
      {
        id: 'l-11',
        title: 'Tamil Greetings (வாழ்த்துகள்)',
        description: 'Learn how to greet people in Tamil for different times and occasions',
        language: 'Tamil',
        gradeLevel: 'Beginner',
        duration: 15,
        competencies: ['Speaking', 'Culture'],
        learningObjectives: ['Use appropriate greetings', 'Understand cultural context'],
        hasTranscripts: false,
        hasCaptions: true,
        progress: {
          status: progressMap.get('l-11')?.status || 'NOT_STARTED',
          score: progressMap.get('l-11')?.score || 0,
          attemptCount: 0,
          lastAccessedAt: progressMap.get('l-11')?.updatedAt?.toISOString() || null
        }
      }
    ];

    // Use MongoDB lessons if available, otherwise use mocks
    const finalLessons = mappedLessons.length > 0 ? mappedLessons : mockLessons;

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
