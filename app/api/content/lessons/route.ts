import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'EDUCATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const lesson = await prisma.lesson.create({
      data: {
        title: body.title,
        description: body.description,
        language: body.language,
        gradeLevel: body.level,
        creatorId: session.user.id!,
        isPublished: body.status === 'published',
      },
    });

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
