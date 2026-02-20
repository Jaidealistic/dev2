import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Lesson from '@/lib/models/Lesson';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

/**
 * All lessons in the system, tagged with `disabilityTypes`.
 * An empty array means the lesson is shown to ALL learners.
 * A non-empty array means the lesson is ONLY shown to learners
 * who have at least one matching disability type in their profile.
 */
interface LessonProgress {
  status: string;
  score: number;
  updatedAt: Date;
}

interface LessonItem {
  id: string;
  title: string;
  description: string;
  language: string;
  gradeLevel: string;
  duration: number;
  disabilityTypes: string[];
  badge?: string;
  competencies: string[];
  learningObjectives: string[];
  hasTranscripts: boolean;
  hasCaptions: boolean;
  progress: {
    status: string;
    score: number;
    attemptCount: number;
    lastAccessedAt: string | null;
  };
}

const ALL_MOCK_LESSONS = (lang: string, progressMap: Map<string, LessonProgress>): LessonItem[] => [

  // ── ADHD-specific lessons ──────────────────────────────────────
  {
    id: 'adhd-lesson-1',
    title: lang === 'ta' ? 'ஒரு வார்த்தை: வணக்கங்கள்' : 'One Word at a Time: Greetings',
    description: lang === 'ta'
      ? 'குறுகிய, கவனமான வாழ்த்து பயிற்சி — ஒரு திரையில் ஒரு வார்த்தை'
      : 'Short, focused greeting practice — one word per screen, immediate reward',
    language: 'English',
    gradeLevel: 'Beginner',
    duration: 8,
    disabilityTypes: ['ADHD'],
    badge: '⚡ ADHD-Optimised',
    competencies: ['Speaking', 'Vocabulary'],
    learningObjectives: ['Say hello', 'Say good morning'],
    hasTranscripts: true,
    hasCaptions: true,
    progress: {
      status: progressMap.get('adhd-lesson-1')?.status || 'NOT_STARTED',
      score: progressMap.get('adhd-lesson-1')?.score || 0,
      attemptCount: 0,
      lastAccessedAt: progressMap.get('adhd-lesson-1')?.updatedAt?.toISOString() || null
    }
  },
  {
    id: 'adhd-lesson-2',
    title: lang === 'ta' ? 'நிறங்கள் — ஒவ்வொன்றாக' : 'Colours — One at a Time',
    description: lang === 'ta'
      ? '10 நிமிடங்களில் 3 நிறங்களை உடனடி வெகுமதியுடன் கற்றுக்கொள்ளுங்கள்'
      : 'Learn 3 colours in 10 minutes with instant rewards and short steps',
    language: 'English',
    gradeLevel: 'Beginner',
    duration: 10,
    disabilityTypes: ['ADHD'],
    badge: '⚡ ADHD-Optimised',
    competencies: ['Vocabulary'],
    learningObjectives: ['Name 3 colours', 'Use colour words in sentences'],
    hasTranscripts: true,
    hasCaptions: true,
    progress: {
      status: progressMap.get('adhd-lesson-2')?.status || 'NOT_STARTED',
      score: progressMap.get('adhd-lesson-2')?.score || 0,
      attemptCount: 0,
      lastAccessedAt: progressMap.get('adhd-lesson-2')?.updatedAt?.toISOString() || null
    }
  },

  // ── Dyslexia-specific lessons ──────────────────────────────────
  {
    id: 'dyslexia-lesson-1',
    title: lang === 'ta' ? 'வணக்கங்கள் — பார், சொல், தெரி' : 'Greetings — See It, Say It, Know It',
    description: lang === 'ta'
      ? 'ஒலி வழிகாட்டுதலுடன் வாழ்த்து பாடம் — நேர அழுத்தம் இல்லை'
      : 'Phonetic-guided greeting lesson with colour-coded syllables and no time pressure',
    language: 'English',
    gradeLevel: 'Beginner',
    duration: 20,
    disabilityTypes: ['DYSLEXIA'],
    badge: '📖 Dyslexia-Friendly',
    competencies: ['Reading', 'Vocabulary'],
    learningObjectives: ['Read greetings with phonetic guides', 'Recognise word shapes'],
    hasTranscripts: true,
    hasCaptions: true,
    progress: {
      status: progressMap.get('dyslexia-lesson-1')?.status || 'NOT_STARTED',
      score: progressMap.get('dyslexia-lesson-1')?.score || 0,
      attemptCount: 0,
      lastAccessedAt: progressMap.get('dyslexia-lesson-1')?.updatedAt?.toISOString() || null
    }
  },
  {
    id: 'dyslexia-lesson-2',
    title: lang === 'ta' ? 'எண்கள் 1–5 — வடிவம் & ஒலி' : 'Numbers 1–5 — Shape & Sound',
    description: lang === 'ta'
      ? 'ஒலி வழிகாட்டுதலுடன் எண்களை கற்றுக்கொள்ளுங்கள்'
      : 'Learn numbers with phonetic guides, word shapes, and visual patterns',
    language: 'English',
    gradeLevel: 'Beginner',
    duration: 18,
    disabilityTypes: ['DYSLEXIA'],
    badge: '📖 Dyslexia-Friendly',
    competencies: ['Reading', 'Numeracy'],
    learningObjectives: ['Read number words', 'Match numbers to words'],
    hasTranscripts: true,
    hasCaptions: true,
    progress: {
      status: progressMap.get('dyslexia-lesson-2')?.status || 'NOT_STARTED',
      score: progressMap.get('dyslexia-lesson-2')?.score || 0,
      attemptCount: 0,
      lastAccessedAt: progressMap.get('dyslexia-lesson-2')?.updatedAt?.toISOString() || null
    }
  },

  // ── APD-specific lessons ───────────────────────────────────────
  {
    id: 'apd-lesson-1',
    title: lang === 'ta' ? 'வணக்கங்கள் — படி, பார்' : 'Greetings — Read It, See It',
    description: lang === 'ta'
      ? 'முழு எழுத்து வடிவ வாழ்த்து பாடம் — ஆடியோ தேவையில்லை'
      : 'Visual-first greeting lesson with full written transcripts and no audio dependency',
    language: 'English',
    gradeLevel: 'Beginner',
    duration: 15,
    disabilityTypes: ['APD'],
    badge: '👁️ Visual-First',
    competencies: ['Reading', 'Comprehension'],
    learningObjectives: ['Read greeting dialogues', 'Use context clues'],
    hasTranscripts: true,
    hasCaptions: true,
    progress: {
      status: progressMap.get('apd-lesson-1')?.status || 'NOT_STARTED',
      score: progressMap.get('apd-lesson-1')?.score || 0,
      attemptCount: 0,
      lastAccessedAt: progressMap.get('apd-lesson-1')?.updatedAt?.toISOString() || null
    }
  },
  {
    id: 'apd-lesson-2',
    title: lang === 'ta' ? 'குடும்ப வார்த்தைகள் — காட்சி வழிகாட்டுதல்' : 'Family Words — Visual Scripts',
    description: lang === 'ta'
      ? 'எழுத்து வழிகாட்டுதலுடன் குடும்ப சொல்லகராதி — ஆடியோ தேவையில்லை'
      : 'Family vocabulary with written dialogue scripts, context clues, and no audio dependency',
    language: 'English',
    gradeLevel: 'Beginner',
    duration: 18,
    disabilityTypes: ['APD'],
    badge: '👁️ Visual-First',
    competencies: ['Reading', 'Vocabulary'],
    learningObjectives: ['Read family word scripts', 'Use pronoun context clues'],
    hasTranscripts: true,
    hasCaptions: true,
    progress: {
      status: progressMap.get('apd-lesson-2')?.status || 'NOT_STARTED',
      score: progressMap.get('apd-lesson-2')?.score || 0,
      attemptCount: 0,
      lastAccessedAt: progressMap.get('apd-lesson-2')?.updatedAt?.toISOString() || null
    }
  },

  // ── Autism-specific lessons ────────────────────────────────────
  {
    id: 'autism-lesson-1',
    title: lang === 'ta' ? 'வணக்கங்கள் — சரியான வாக்கியங்கள்' : 'Greetings — Exact Scripts to Use',
    description: lang === 'ta'
      ? 'தெளிவான சமூக வாக்கியங்களுடன் வாழ்த்து பாடம் — தெளிவற்ற தன்மை இல்லை'
      : 'Predictable structure with exact social scripts for greetings — no ambiguity',
    language: 'English',
    gradeLevel: 'Beginner',
    duration: 15,
    disabilityTypes: ['AUTISM'],
    badge: '🔷 Structured Learning',
    competencies: ['Social Communication', 'Speaking'],
    learningObjectives: ['Use exact greeting scripts', 'Know when to use each greeting'],
    hasTranscripts: true,
    hasCaptions: true,
    progress: {
      status: progressMap.get('autism-lesson-1')?.status || 'NOT_STARTED',
      score: progressMap.get('autism-lesson-1')?.score || 0,
      attemptCount: 0,
      lastAccessedAt: progressMap.get('autism-lesson-1')?.updatedAt?.toISOString() || null
    }
  },
  {
    id: 'autism-lesson-2',
    title: lang === 'ta' ? 'உதவி கேட்பது — சரியான வாக்கியங்கள்' : 'Asking for Help — Exact Phrases',
    description: lang === 'ta'
      ? 'பள்ளி மற்றும் அன்றாட சூழ்நிலைகளில் உதவி கேட்பதற்கான வாக்கியங்கள்'
      : 'Explicit, literal scripts for asking for help in school and daily situations',
    language: 'English',
    gradeLevel: 'Beginner',
    duration: 15,
    disabilityTypes: ['AUTISM'],
    badge: '🔷 Structured Learning',
    competencies: ['Social Communication', 'Speaking'],
    learningObjectives: ['Use "Excuse me" correctly', 'Ask for help using exact phrases'],
    hasTranscripts: true,
    hasCaptions: true,
    progress: {
      status: progressMap.get('autism-lesson-2')?.status || 'NOT_STARTED',
      score: progressMap.get('autism-lesson-2')?.score || 0,
      attemptCount: 0,
      lastAccessedAt: progressMap.get('autism-lesson-2')?.updatedAt?.toISOString() || null
    }
  },

  // ── General lessons (shown to all learners) ────────────────────
  {
    id: 'demo-lesson-1',
    title: lang === 'ta' ? 'வணக்கங்களும் அறிமுகங்களும்' : 'Greetings & Introductions',
    description: lang === 'ta'
      ? 'அத்தியாவசிய ஆங்கில வாழ்த்துக்களை முழுமையாகக் கற்றுக் கொள்ளுங்கள்!'
      : 'Master essential English greetings and learn how to introduce yourself confidently',
    language: 'English',
    gradeLevel: 'Beginner',
    duration: 12,
    disabilityTypes: [],
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
    disabilityTypes: [],
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
    disabilityTypes: [],
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
    disabilityTypes: [],
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
    // Learner's disability types (e.g. ['ADHD', 'DYSLEXIA'])
    const learnerDisabilities: string[] = user.learnerProfile.disabilityTypes || [];

    // Get language from query parameter (defaults to 'en')
    const url = new URL(req.url);
    const lang = url.searchParams.get('lang') || 'en';

    // Helper function to extract language-specific text
    const getText = (field: string | Record<string, string> | undefined, fallback: string = ''): string => {
      if (!field) return fallback;
      if (typeof field === 'string') return field;
      if (typeof field === 'object' && (field as Record<string, string>)[lang]) return (field as Record<string, string>)[lang];
      if (typeof field === 'object' && (field as Record<string, string>).en) return (field as Record<string, string>).en;
      return fallback;
    };

    // Connect to MongoDB for lessons
    await dbConnect();

    // Fetch lessons from MongoDB
    const mongoLessons = await Lesson.find({ isPublished: true }).lean();

    // Fetch user progress from PostgreSQL
    const progressMap = new Map<string, LessonProgress>();
    const progressRecords = await prisma.lessonProgress.findMany({
      where: { learnerId }
    });
    progressRecords.forEach((p: any) => progressMap.set(p.lessonId, p as unknown as LessonProgress));

    interface MongoLesson {
      _id: { toString(): string };
      lessonId?: string;
      title?: string | Record<string, string>;
      description?: string | Record<string, string>;
      language?: string;
      gradeLevel?: string;
      estimatedDuration?: number;
      duration?: number;
      disabilityTypes?: string[];
      competencies?: string[];
      learningObjectives?: string[];
      hasTranscripts?: boolean;
      hasCaptions?: boolean;
    }

    // Map MongoDB lessons to frontend structure
    const mappedLessons = (mongoLessons as unknown as MongoLesson[]).map((lesson: MongoLesson): LessonItem => {
      const lessonIdKey = lesson.lessonId || lesson._id.toString();
      const progress = progressMap.get(lessonIdKey);
      return {
        id: lessonIdKey,
        title: getText(lesson.title, 'Untitled Lesson'),
        description: getText(lesson.description, ''),
        language: lesson.language || 'English',
        gradeLevel: lesson.gradeLevel || 'All',
        duration: lesson.estimatedDuration || lesson.duration || 15,
        disabilityTypes: lesson.disabilityTypes || [],
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

    // Use MongoDB lessons if available, otherwise use built-in library
    const allLessons = mappedLessons.length > 0
      ? mappedLessons
      : ALL_MOCK_LESSONS(lang, progressMap);

    // Filter: show a lesson if it has no disabilityTypes (general)
    // OR if the learner has at least one matching disability
    const filteredLessons = allLessons.filter((lesson: LessonItem) => {
      const tags: string[] = lesson.disabilityTypes || [];
      if (tags.length === 0) return true; // general lesson — always show
      if (learnerDisabilities.length === 0) return false; // learner has no disabilities — hide specific lessons
      return tags.some((t: string) => learnerDisabilities.includes(t));
    });

    return NextResponse.json({
      lessons: filteredLessons,
      learnerDisabilities // expose so frontend can show disability badge section
    });

  } catch (error) {
    console.error('Lessons list fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

