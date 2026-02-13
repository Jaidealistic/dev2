import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentProgressPage({ params }: { params: { studentId: string } }) {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Student Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Progress tracking for student {params.studentId} is coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
