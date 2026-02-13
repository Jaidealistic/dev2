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
          familyMembersAsChild: false, // Parent is not child
          // Parent relations:
          parentProfile: {
              include: {
                  children: {
                      include: {
                          child: {
                              include: {
                                  learnerProfile: {
                                      include: {
                                          lessonProgress: true
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

    // Auto-create parent profile if missing (self-healing)
    let parentProfile = parentUser.parentProfile;
    if (!parentProfile && (parentUser.role === 'PARENT' || parentUser.role === 'PARENT_EDUCATOR')) {
        parentProfile = await prisma.parentProfile.create({
            data: { userId: parentUser.id }
        });
        // Refetch or just use empty children
    }

    const childrenData = (parentProfile?.children || []).map((relation: any) => {
        const childUser = relation.child;
        const learner = childUser.learnerProfile;
        
        let stats = {
            totalLessons: 0,
            completedLessons: 0,
            goalProgress: 0,
            wordsLearned: 0,
            currentStreak: 0
        };

        if (learner && learner.lessonProgress) {
            stats.totalLessons = 20; // Mock total available or fetch count
            stats.completedLessons = learner.lessonProgress.filter((p: any) => p.status === 'COMPLETED' || p.status === 'MASTERED').length;
            stats.goalProgress = Math.min(100, Math.round((stats.completedLessons / 10) * 100)); // Mock goal of 10 lessons
            // Mock words learned based on progress
            stats.wordsLearned = stats.completedLessons * 15;
            // Mock streak
            stats.currentStreak = learner.lessonProgress.length > 0 ? 3 : 0;
        }

        return {
            studentId: learner?.studentId || 'PENDING',
            name: childUser.firstName || 'Child',
            gradeLevel: learner?.gradeLevel || 'Grade 1',
            currentStreak: stats.currentStreak,
            totalLessons: stats.totalLessons,
            completedLessons: stats.completedLessons,
            goalProgress: stats.goalProgress,
            wordsLearned: stats.wordsLearned,
            learningLanguages: learner?.learningLanguage ? [learner.learningLanguage] : ['English'], // DB has single, UI expects array
            recentActivity: 'Started "Greetings"', // Placeholder
            lastActive: learner?.updatedAt?.toISOString() || new Date().toISOString()
        };
    });

    // Mock weekly report aggregation
    const weeklyReport = {
        totalMinutes: 45,
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
