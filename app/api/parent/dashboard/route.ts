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

        const parentUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                familyMembersAsChild: false,
                parentProfile: {
                    include: {
                        children: {
                            include: {
                                child: {
                                    include: {
                                        learnerProfile: {
                                            include: {
                                                lessonProgress: true,
                                                progressRecords: {
                                                    orderBy: { createdAt: 'desc' },
                                                    take: 50
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!parentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Auto-create parent profile if missing
        let parentProfile = parentUser.parentProfile;
        if (!parentProfile && (parentUser.role === 'PARENT' || parentUser.role === 'PARENT_EDUCATOR')) {
            parentProfile = await prisma.parentProfile.create({
                data: { userId: parentUser.id }
            });
        }

        // Calculate real progress metrics
        const childrenData = (parentProfile?.children || []).map((relation: any) => {
            const childUser = relation.child;
            const learner = childUser.learnerProfile;

            let stats = {
                totalLessons: 20, // TODO: Fetch from actual lesson count
                completedLessons: 0,
                goalProgress: 0,
                wordsLearned: 0,
                currentStreak: 0,
                totalMinutesSpent: 0
            };

            if (learner) {
                // Real completed lessons count
                stats.completedLessons = learner.lessonProgress?.filter(
                    (p: any) => p.status === 'COMPLETED' || p.status === 'MASTERED'
                ).length || 0;

                // Calculate real progress percentage
                stats.goalProgress = Math.min(100, Math.round((stats.completedLessons / stats.totalLessons) * 100));

                // Calculate real words learned (estimate: avg 12-15 words per lesson)
                stats.wordsLearned = stats.completedLessons * 13;

                // Calculate streak from lesson progress (last 7 days activity)
                const today = new Date();
                const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                const recentProgress = learner.lessonProgress?.filter((p: any) => {
                    const completedDate = p.completedAt || p.updatedAt;
                    return completedDate && new Date(completedDate) >= sevenDaysAgo;
                }) || [];
                stats.currentStreak = recentProgress.length > 0 ? Math.min(recentProgress.length, 7) : 0;

                // Calculate total time spent from progress records
                if (learner.progressRecords && learner.progressRecords.length > 0) {
                    stats.totalMinutesSpent = learner.progressRecords.reduce(
                        (total: number, record: any) => total + (record.timeSpentSec || 0),
                        0
                    ) / 60; // Convert to minutes
                }
            }

            // Get most recent activity
            let recentActivity = 'No recent activity';
            if (learner?.lessonProgress && learner.lessonProgress.length > 0) {
                const latestProgress = learner.lessonProgress.sort((a: any, b: any) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                )[0];

                if (latestProgress.status === 'IN_PROGRESS') {
                    recentActivity = 'Currently learning a lesson';
                } else if (latestProgress.status === 'COMPLETED') {
                    recentActivity = 'Completed a lesson recently';
                } else {
                    recentActivity = 'Started learning';
                }
            }

            return {
                studentId: learner?.studentId || 'PENDING',
                name: childUser.firstName || childUser.email?.split('@')[0] || 'Child',
                gradeLevel: learner?.grade || learner?.gradeLevel || 'Grade 1',
                currentStreak: stats.currentStreak,
                totalLessons: stats.totalLessons,
                completedLessons: stats.completedLessons,
                goalProgress: stats.goalProgress,
                wordsLearned: stats.wordsLearned,
                learningLanguages: learner?.learningLanguage ? [learner.learningLanguage] : ['English'],
                recentActivity,
                lastActive: learner?.updatedAt?.toISOString() || new Date().toISOString(),
                minutesSpent: Math.round(stats.totalMinutesSpent)
            };
        });

        // Calculate real weekly report from all children
        const totalMinutesAllChildren = childrenData.reduce(
            (acc: number, c: any) => acc + (c.minutesSpent || 0),
            0
        );

        const weeklyReport = {
            totalMinutes: Math.round(totalMinutesAllChildren),
            lessonsCompleted: childrenData.reduce((acc: number, c: any) => acc + c.completedLessons, 0),
            newWordsLearned: childrenData.reduce((acc: number, c: any) => acc + c.wordsLearned, 0)
        };

        return NextResponse.json({
            parentName: parentUser.firstName || 'Parent',
            children: childrenData,
            weeklyReport
        });

    } catch (error) {
        console.error('Parent dashboard fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

