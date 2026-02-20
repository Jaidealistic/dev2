import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    try {
        const { lessonId } = await params;

        // 1. Authenticate user
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

        // 2. Get user and learner profile
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { learnerProfile: true }
        });

        if (!user || !user.learnerProfile) {
            return NextResponse.json({ error: 'Learner profile not found' }, { status: 404 });
        }

        const learnerId = user.learnerProfile.id;

        // 3. Fetch lesson progress
        const progress = await prisma.lessonProgress.findUnique({
            where: {
                learnerId_lessonId: {
                    learnerId,
                    lessonId
                }
            }
        });

        if (!progress) {
            return NextResponse.json({ error: 'Lesson progress not found' }, { status: 404 });
        }

        // 4. Fetch time spent (ProgressRecords)
        const records = await prisma.progressRecord.findMany({
            where: {
                learnerId,
                lessonId
            }
        });

        const totalTimeSpent = records.reduce((acc, curr) => acc + (curr.timeSpentSec || 0), 0);

        // 5. Fetch achievements earned for this lesson
        // (In a real app, you might check achievements earned today or recently)
        const achievements = await prisma.achievement.findMany({
            where: {
                learnerId
            },
            orderBy: {
                earnedAt: 'desc'
            },
            take: 2
        });

        // 6. Hardcoded lesson metadata fallback for professional lessons
        // In a future refactor, this should be moved to a shared library
        const lessonTitles: Record<string, string> = {
            'adhd-lesson-1': 'One Word at a Time: Greetings',
            'adhd-lesson-2': 'Colours — One at a Time',
            'dyslexia-lesson-1': 'Greetings — See It, Say It, Know It',
            'dyslexia-lesson-2': 'Numbers 1–5 — Shape & Sound',
            'apd-lesson-1': 'Greetings — Read It, See It',
            'apd-lesson-2': 'Family Words — Visual Scripts',
            'autism-lesson-1': 'Greetings — Exact Scripts to Use',
            'autism-lesson-2': 'Asking for Help — Exact Phrases',
            'demo-lesson-1': 'Greetings & Introductions',
            'demo-lesson-2': 'Family & Relationships',
            'demo-lesson-3': 'Food & Dining',
            'demo-lesson-4': 'Shopping & Money'
        };

        return NextResponse.json({
            success: true,
            summary: {
                lessonTitle: lessonTitles[lessonId] || 'Lesson Complete',
                score: progress.score || 0,
                timeSpent: totalTimeSpent, // in seconds
                sectionsCompleted: 0, // Fallback as we don't track per-section here yet
                status: progress.status,
                completedAt: progress.completedAt,
                badges: achievements.map(a => ({
                    id: a.badgeId,
                    name: a.badgeName,
                    description: a.description,
                    icon: a.badgeId.includes('milestone') ? 'trophy' : 'zap'
                }))
            }
        });

    } catch (error) {
        console.error('Summary fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
