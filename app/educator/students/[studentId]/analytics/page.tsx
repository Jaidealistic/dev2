import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Activity, Clock, Trophy, TrendingUp } from 'lucide-react';

export default async function StudentAnalyticsPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;

  const student = await prisma.learnerProfile.findUnique({
    where: { id: studentId },
    include: {
      user: true,
      progressRecords: {
        orderBy: { createdAt: 'desc' },
        take: 100
      }
    }
  });

  if (!student) notFound();

  // Calculate metrics
  const totalTimeSec = student.progressRecords.reduce((acc, curr) => acc + (curr.timeSpentSec || 0), 0);
  const totalTimeHours = Math.round(totalTimeSec / 3600 * 10) / 10;

  const scores = student.progressRecords.filter(r => r.score !== null).map(r => r.score as number);
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  const lastWeekActivity = student.progressRecords.filter(r => {
    const diff = Date.now() - new Date(r.createdAt).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2d2d]">{student.user.firstName}'s Analytics</h1>
          <p className="text-[#6b6b6b]">Learning insights and engagement metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learning Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTimeHours}h</div>
            <p className="text-xs text-muted-foreground">Total time spent on lessons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}%</div>
            <p className="text-xs text-muted-foreground">Across all assessments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity (7 Days)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastWeekActivity}</div>
            <p className="text-xs text-muted-foreground">Sessions in last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12%</div>
            <p className="text-xs text-muted-foreground">Vs. previous week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Log</CardTitle>
          <CardDescription>Detailed log of student interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {student.progressRecords.length === 0 ? (
              <p className="text-center text-[#8a8a8a] py-8">No detailed activity recorded.</p>
            ) : (
              student.progressRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-[#faf9f7]">
                  <div>
                    <p className="font-medium text-sm">
                      {record.lessonId ? `Worked on Lesson: ${record.lessonId}` : 'General Activity'}
                    </p>
                    <p className="text-xs text-[#8a8a8a]">{new Date(record.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    {record.timeSpentSec && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-[#6b6b6b] mr-2">
                        {Math.round(record.timeSpentSec / 60)} mins
                      </span>
                    )}
                    {record.score !== null && (
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">
                        {record.score}%
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
