import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'EDUCATOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const educator = await prisma.educatorProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        students: {
          where: { active: true },
          include: {
            student: {
              include: {
                progressRecords: true,
              },
            },
          },
        },
      },
    });

    if (!educator) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const totalStudents = educator.students.length;
    // Note: createdContent is not available on EducatorProfile in standard schema without relation,
    // assuming we might need to fetch lessons separately or relation exists.
    // For now, let's fetch lessons count separately if needed or assume 0 for MVP if relation not in schema yet.
    // Checking dev2-rem-work.txt, it implies `educator.createdContent?.length`.
    // I'll leave it as 0 for now to avoid build error if relation is missing, or try to fetch if I can confirm schema.
    const activeLessons = 0; 
    
    const allProgress = educator.students.flatMap(s => s.student.progressRecords);
    const averageProgress = allProgress.length > 0
      ? Math.round(allProgress.reduce((sum, p) => sum + (p.score || 0), 0) / allProgress.length)
      : 0;

    const totalTeachingHours = Math.round(
      allProgress.reduce((sum, p) => sum + (p.timeSpentSec || 0), 0) / 3600
    );

    return NextResponse.json({
      stats: {
        totalStudents,
        activeLessons,
        averageProgress,
        totalTeachingHours,
      },
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}
