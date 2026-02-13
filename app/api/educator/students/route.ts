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
            studentUser: true,
            student: {
              include: {
                progressRecords: true,
              },
            },
          },
        },
      },
    });

    const students = educator?.students.map((es) => {
      const student = es.student;
      const user = es.studentUser;
      const scores = student.progressRecords
        .filter(p => p.score !== null)
        .map(p => p.score!);
      
      const age = student.dateOfBirth 
        ? new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()
        : 0;

      return {
        id: student.id,
        name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown' : 'Unknown',
        age: age,
        disabilities: student.disabilities,
        lessonsCompleted: student.progressRecords.length,
        averageScore: scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0,
      };
    }) || [];

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Students error:', error);
    return NextResponse.json({ error: 'Failed to load students' }, { status: 500 });
  }
}
