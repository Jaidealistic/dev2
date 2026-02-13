import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

export async function GET(req: Request, { params }: { params: { lessonId: string } }) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId } = params;

    // 1. Try to fetch from real DB
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
      },
    });

    if (lesson) {
        return NextResponse.json({
            success: true,
            lesson,
        });
    }

    // 2. Fallback to Mock Data for "Recommended" lessons if not in DB
    // This supports the hardcoded IDs in the dashboard mock (e.g., 'l-1', 'l-9')
    if (lessonId === 'l-1' || lessonId === 'l-9') {
        const mockLesson = {
            id: lessonId,
            title: lessonId === 'l-1' ? 'Greetings & Introductions' : 'Tamil Alphabets – Uyir',
            description: 'Learn the basics of conversation.',
            estimatedDuration: 15,
            competencies: ['speaking', 'listening'],
            steps: [
                {
                    id: 's-1',
                    stepNumber: 1,
                    stepType: 'text',
                    title: 'Introduction',
                    content: {
                        text: 'Welcome to your first lesson! Today we will learn how to say hello and introduce ourselves.\n\n"Hello" is a universal greeting.',
                    }
                },
                {
                    id: 's-2',
                    stepNumber: 2,
                    stepType: 'audio',
                    title: 'Listen and Repeat',
                    content: {
                        text: 'Listen to the pronunciation of "Hello".',
                        audioUrl: '/audio/hello.mp3', // This file might not exist, but the player handles errors gracefully typically or shows loading
                        transcript: 'Hello. Nice to meet you.'
                    }
                },
                {
                    id: 's-3',
                    stepNumber: 3,
                    stepType: 'exercise',
                    title: 'Quick Check',
                    content: {
                        exercise: {
                            type: 'multiple-choice',
                            question: 'Which phrase is a greeting?',
                            options: ['Goodbye', 'Hello', 'Apple'],
                            correctAnswer: 'Hello'
                        }
                    }
                }
            ]
        };

        return NextResponse.json({
            success: true,
            lesson: mockLesson
        });
    }

    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

  } catch (error) {
    console.error('Lesson fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
