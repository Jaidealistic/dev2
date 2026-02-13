import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EducatorStudentsPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>My Students</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The student management list will appear here. You can view progress, manage assignments, and track performance.</p>
        </CardContent>
      </Card>
    </div>
  );
}
