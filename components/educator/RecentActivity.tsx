'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RecentActivity({ educatorId }: { educatorId: string }) {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/educator/activity')
      .then((res) => res.json())
      .then((data) => setActivities(data.activities || []))
      .catch(() => {});
  }, [educatorId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex gap-4 text-sm">
                <div className="text-gray-500">{activity.time}</div>
                <div>{activity.description}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
