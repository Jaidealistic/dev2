import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { steps: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Map to frontend expected structure
    const mappedLesson = {
      ...lesson,
      lessonId: lesson.id,
      level: lesson.gradeLevel,
      status: lesson.isPublished ? 'published' : 'draft',
    };

    return NextResponse.json({ lesson: mappedLesson });
  } catch (error) {
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
    const body = await req.json();

    const lesson = await prisma.lesson.update({
      where: {
        id: lessonId,
        creatorId: session.user.id!,
      },
      data: {
        title: body.title,
        description: body.description,
        language: body.language,
        gradeLevel: body.level,
        isPublished: body.status === 'published',
        // Update other fields as needed
      },
    });

    return NextResponse.json({
      success: true,
      lessonId: lesson.id,
    });
  } catch (error) {
    // Handle record not found (P2025) or other errors
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
    await prisma.lesson.delete({
      where: {
        id: lessonId,
        creatorId: session.user.id!,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
