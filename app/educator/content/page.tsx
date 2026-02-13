import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EducatorContentPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Access and manage your lessons and assessments here. Create new content to share with your students!</p>
        </CardContent>
      </Card>
    </div>
  );
}
