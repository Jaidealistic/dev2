import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function StudentProgressPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Progress tracking for student {studentId} is coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
