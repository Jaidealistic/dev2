import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import dbConnect from '@/lib/mongodb';
import Lesson from '@/lib/models/Lesson';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'EDUCATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();

    // 1. Create the base lesson in Postgres to get a stable ID
    const lesson = await prisma.lesson.create({
      data: {
        title: typeof body.title === 'string' ? body.title : body.title.en,
        description: body.description || '',
        language: body.language || 'en',
        gradeLevel: body.level || 'beginner',
        creatorId: session.user.id!,
        isPublished: body.status === 'published',
      },
    });

    // 2. Save the full complex content to MongoDB using the same ID
    const mongoLesson = new Lesson({
      lessonId: lesson.id,
      title: body.title,
      level: body.level,
      language: body.language,
      estimatedDuration: body.estimatedDuration || 30,
      prepTimeMinutes: body.prepTimeMinutes || 0,
      content: body.content || { introduction: { text: { en: '', ta: '' } }, sections: [] },
      teachingGuide: body.teachingGuide || { overview: { en: '', ta: '' }, learningObjectives: { en: [], ta: [] }, steps: [] },
      niosCompetencies: body.niosCompetencies || [],
      createdBy: session.user.id!,
      status: body.status || 'draft',
      tags: body.tags || [],
      difficulty: body.difficulty || 5,
    });

    await mongoLesson.save();

    return NextResponse.json({
      success: true,
      lessonId: lesson.id,
    });
  } catch (error) {
    console.error('Lesson creation error:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const createdBy = searchParams.get('createdBy');

    interface LessonQuery {
      creatorId?: string;
      isPublished?: boolean;
    }
    let where: LessonQuery = {};
    if (session.user.role === 'EDUCATOR') {
      where.creatorId = session.user.id;
    } else if (createdBy) {
      where.creatorId = createdBy;
    } else {
      where.isPublished = true;
    }

    const lessons = await prisma.lesson.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        gradeLevel: true,
        language: true,
        isPublished: true,
        createdAt: true,
      },
    });

    interface PrismaLesson {
      id: string;
      title: string;
      gradeLevel: string;
      language: string;
      isPublished: boolean;
      createdAt: Date;
    }

    // Map Prisma result to match expected frontend structure if needed
    const mappedLessons = (lessons as unknown as PrismaLesson[]).map((l: PrismaLesson) => ({
      lessonId: l.id,
      title: l.title,
      level: l.gradeLevel,
      language: l.language,
      status: l.isPublished ? 'published' : 'draft',
      createdAt: l.createdAt,
    }));

    return NextResponse.json({ lessons: mappedLessons });
  } catch (error) {
    console.error('Lesson fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}
