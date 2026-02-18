import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProgressChart from '@/components/educator/ProgressChart';
import NIOSTracker from '@/components/educator/NIOSTracker';

const prisma = new PrismaClient();

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'EDUCATOR') {
    redirect('/login');
  }

  const relationship = await prisma.educatorStudent.findFirst({
    where: {
      educator: { userId: session.user.id },
      studentId: studentId,
      active: true,
    },
    include: {
      student: {
        include: {
          user: true,
          progressRecords: {
            orderBy: { createdAt: 'desc' },
            take: 20,
          },
          achievements: {
            orderBy: { earnedAt: 'desc' },
          },
          niosCompetencies: true,
        },
      },
    },
  });

  if (!relationship) {
    return <div>Access denied or student not found</div>;
  }

  const student = relationship.student;
  const user = student.user;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{user?.firstName} {user?.lastName}</h1>
        <div className="flex gap-2">
          {Array.isArray(student.disabilities) && (student.disabilities as string[]).map((d) => (
            <Badge key={d} variant="outline">
              {d}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressChart data={student.progressRecords} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student.progressRecords.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Lesson {record.lessonId}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {record.score || 0}%
                      </p>
                      <p className="text-sm text-gray-600">
                        {Math.floor((record.timeSpentSec || 0) / 60)} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>NIOS Competencies</CardTitle>
            </CardHeader>
            <CardContent>
              <NIOSTracker competencies={student.niosCompetencies} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex gap-3">
                    <div className="text-3xl">🏆</div>
                    <div>
                      <p className="font-semibold">{achievement.badgeName}</p>
                      <p className="text-sm text-gray-600">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
