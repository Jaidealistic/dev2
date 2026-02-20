import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';

// Status color helper
function getStatusColor(status: string) {
  switch (status) {
    case 'COMPLETED': return 'text-green-600';
    case 'IN_PROGRESS': return 'text-blue-600';
    case 'MASTERED': return 'text-purple-600';
    default: return 'text-gray-400';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'COMPLETED':
    case 'MASTERED':
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-blue-600" />;
    default: return <Circle className="w-5 h-5 text-gray-300" />;
  }
}

export default async function StudentProgressPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;

  const student = await prisma.learnerProfile.findUnique({
    where: { id: studentId },
    include: {
      user: true,
      lessonProgress: {
        orderBy: { updatedAt: 'desc' }
      }
    }
  });

  if (!student) notFound();

  const completedCount = student.lessonProgress.filter(p => p.status === 'COMPLETED' || p.status === 'MASTERED').length;
  const totalLessons = Math.max(student.lessonProgress.length, 1); // Avoid div/0
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2d2d]">{student.user.firstName} {student.user.lastName}</h1>
          <p className="text-[#6b6b6b]">Grade {student.grade || 'N/A'} • {student.school || 'Homeschool'}</p>
        </div>
        <div className="flex gap-2">
          {student.disabilityTypes.map((type) => (
            <Badge key={type} variant="outline" className="bg-white border-[#7a9b7e] text-[#5d7e61]">
              {type.replace('_', ' ')}
            </Badge>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6b6b6b]">Overall Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold">{progressPercent}%</span>
              <span className="text-sm text-[#6b6b6b] mb-1">{completedCount} / {totalLessons} Lessons</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6b6b6b]">Proficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{student.proficiencyLevel}</div>
            <p className="text-xs text-[#8a8a8a] mt-1">Current language level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#6b6b6b]">Last Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold whitespace-nowrap">
              {new Date(student.updatedAt).toLocaleDateString()}
            </div>
            <p className="text-xs text-[#8a8a8a] mt-1">Last activity recorded</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Lesson List */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson History</CardTitle>
          <CardDescription>Recent learning activities and assessment scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {student.lessonProgress.length === 0 ? (
              <p className="text-center text-[#8a8a8a] py-8">No learning activity recorded yet.</p>
            ) : (
              student.lessonProgress.map((progress) => (
                <div key={progress.id} className="flex items-center justify-between p-4 border rounded-lg bg-[#faf9f7]">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(progress.status)}
                    <div>
                      <p className="font-medium text-[#2d2d2d]">Lesson: {progress.lessonId}</p>
                      <p className="text-xs text-[#8a8a8a]">
                        Started {new Date(progress.createdAt).toLocaleDateString()}
                        {progress.completedAt && ` • Completed ${new Date(progress.completedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className={`${getStatusColor(progress.status)} bg-white ring-1 ring-current`}>
                      {progress.status}
                    </Badge>
                    {progress.score !== null && (
                      <p className="text-sm font-bold mt-1">Score: {progress.score}%</p>
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
