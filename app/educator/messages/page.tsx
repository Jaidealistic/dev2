import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EducatorMessagesPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Your educator message center is coming soon. Stay tuned for real-time collaboration with parents and students!</p>
        </CardContent>
      </Card>
    </div>
  );
}
