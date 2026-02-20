import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import dbConnect from '@/lib/mongodb';
import Lesson from '@/lib/models/Lesson';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    await dbConnect();
    const { lessonId } = await params;

    // 1. Get base info from Postgres
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // 2. Get full content from MongoDB
    const mongoLesson = await Lesson.findOne({ lessonId });

    // Map to frontend expected structure
    const mappedLesson = {
      ...lesson,
      lessonId: lesson.id,
      level: lesson.gradeLevel,
      status: lesson.isPublished ? 'published' : 'draft',
      // If we have mongo content, blend it in
      ...(mongoLesson ? mongoLesson.toObject() : {}),
    };

    return NextResponse.json({ lesson: mappedLesson });
  } catch (error) {
    console.error('Lesson detail fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'EDUCATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await req.json();

    // 1. Update Postgres
    const lesson = await prisma.lesson.update({
      where: {
        id: lessonId,
        creatorId: session.user.id!,
      },
      data: {
        title: typeof body.title === 'string' ? body.title : body.title.en,
        description: body.description || '',
        language: body.language || 'en',
        gradeLevel: body.level || 'beginner',
        isPublished: body.status === 'published',
      },
    });

    // 2. Update MongoDB
    await Lesson.findOneAndUpdate(
      { lessonId },
      {
        $set: {
          title: body.title,
          level: body.level,
          language: body.language,
          estimatedDuration: body.estimatedDuration,
          prepTimeMinutes: body.prepTimeMinutes,
          content: body.content,
          teachingGuide: body.teachingGuide,
          niosCompetencies: body.niosCompetencies,
          status: body.status,
          tags: body.tags,
          difficulty: body.difficulty,
          updatedAt: new Date(),
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      lessonId: lesson.id,
    });
  } catch (error) {
    console.error('Lesson update error:', error);
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'EDUCATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    // 1. Delete from Postgres
    await prisma.lesson.delete({
      where: {
        id: lessonId,
        creatorId: session.user.id!,
      },
    });

    // 2. Delete from MongoDB
    await Lesson.deleteOne({ lessonId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lesson deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
