import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function StudentAnalyticsPage({ params }: { params: Promise<{ studentId: string }> }) {
  const { studentId } = await params;
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Student Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Detailed analytics for student {studentId} are coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
