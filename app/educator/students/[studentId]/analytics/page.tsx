import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentAnalyticsPage({ params }: { params: { studentId: string } }) {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Student Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Detailed analytics for student {params.studentId} are coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
