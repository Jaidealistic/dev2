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

    // Get language from query parameter (defaults to 'en')
    const url = new URL(req.url);
    const lang = url.searchParams.get('lang') || 'en';

    // Helper function to extract language-specific text
    const getText = (field: any, fallback: string = ''): string => {
      if (!field) return fallback;
      if (typeof field === 'string') return field;
      if (typeof field === 'object' && field[lang]) return field[lang];
      if (typeof field === 'object' && field.en) return field.en;
      return fallback;
    };

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
        title: getText(lesson.title, 'Untitled Lesson'),
        description: getText(lesson.description, ''),
        language: lesson.language || 'English',
        gradeLevel: lesson.gradeLevel || 'All',
        duration: lesson.estimatedDuration || lesson.duration || 15,
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

    // Professional lessons as fallback if MongoDB is empty (with multilingual support)
    const mockLessons = [
      {
        id: 'demo-lesson-1',
        title: lang === 'ta' ? 'வணக்கங்களும் அறிமுகங்களும்' : 'Greetings & Introductions',
        description: lang === 'ta'
          ? 'அத்தியாவசிய ஆங்கில வாழ்த்துக்களை முழுமையாகக் கற்றுக் கொள்ளுங்கள்!'
          : 'Master essential English greetings and learn how to introduce yourself confidently',
        language: 'English',
        gradeLevel: 'Beginner',
        duration: 12,
        competencies: ['Speaking', 'Listening', 'Vocabulary'],
        learningObjectives: ['Say hello', 'Introduce yourself', 'Ask how someone is'],
        hasTranscripts: true,
        hasCaptions: true,
        progress: {
          status: progressMap.get('demo-lesson-1')?.status || 'NOT_STARTED',
          score: progressMap.get('demo-lesson-1')?.score || 0,
          attemptCount: 0,
          lastAccessedAt: progressMap.get('demo-lesson-1')?.updatedAt?.toISOString() || null
        }
      },
      {
        id: 'demo-lesson-2',
        title: lang === 'ta' ? 'குடும்பம் & உறவுகள்' : 'Family & Relationships',
        description: lang === 'ta'
          ? 'உங்கள் குடும்பத்தைப் பற்றி ஆங்கிலத்தில் பேசக் கற்றுக் கொள்ளுங்கள்!'
          : 'Learn how to talk about your family members in English',
        language: 'English',
        gradeLevel: 'Beginner',
        duration: 15,
        competencies: ['Vocabulary', 'Speaking'],
        learningObjectives: ['Name family members', 'Describe relationships'],
        hasTranscripts: true,
        hasCaptions: true,
        progress: {
          status: progressMap.get('demo-lesson-2')?.status || 'NOT_STARTED',
          score: progressMap.get('demo-lesson-2')?.score || 0,
          attemptCount: 0,
          lastAccessedAt: progressMap.get('demo-lesson-2')?.updatedAt?.toISOString() || null
        }
      },
      {
        id: 'demo-lesson-3',
        title: lang === 'ta' ? 'உணவு & உணவருந்துதல்' : 'Food & Dining',
        description: lang === 'ta'
          ? 'உணவு நம் அனைவரையும் இணைக்கிறது! அத்தியாவசிய சொற்களைக் கற்றுக் கொள்ளுங்கள்.'
          : 'Essential vocabulary for food, meals, and eating out',
        language: 'English',
        gradeLevel: 'Beginner',
        duration: 18,
        competencies: ['Vocabulary', 'Pronunciation'],
        learningObjectives: ['Name meals', 'Order food', 'Discuss dietary preferences'],
        hasTranscripts: true,
        hasCaptions: true,
        progress: {
          status: progressMap.get('demo-lesson-3')?.status || 'NOT_STARTED',
          score: progressMap.get('demo-lesson-3')?.score || 0,
          attemptCount: 0,
          lastAccessedAt: progressMap.get('demo-lesson-3')?.updatedAt?.toISOString() || null
        }
      },
      {
        id: 'demo-lesson-4',
        title: lang === 'ta' ? 'ஷாப்பிங் & பணம்' : 'Shopping & Money',
        description: lang === 'ta'
          ? 'ஆங்கிலத்தில் ஷாப்பிங் செய்யும் கலையை மாஸ்டர் செய்யுங்கள்!'
          : 'Learn how to shop and handle money conversations in English',
        language: 'English',
        gradeLevel: 'Intermediate',
        duration: 20,
        competencies: ['Speaking', 'Listening', 'Comprehension'],
        learningObjectives: ['Ask prices', 'Make purchases', 'Negotiate'],
        hasTranscripts: true,
        hasCaptions: true,
        progress: {
          status: progressMap.get('demo-lesson-4')?.status || 'NOT_STARTED',
          score: progressMap.get('demo-lesson-4')?.score || 0,
          attemptCount: 0,
          lastAccessedAt: progressMap.get('demo-lesson-4')?.updatedAt?.toISOString() || null
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
