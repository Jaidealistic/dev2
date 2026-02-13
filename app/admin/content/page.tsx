import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PlaceholderPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This feature is currently under development. Stay tuned for updates!</p>
        </CardContent>
      </Card>
    </div>
  );
}
