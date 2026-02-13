'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Play } from 'lucide-react';

export default function DailySchedule() {
  const lessons = [
    { time: '9:00 AM', title: 'Greetings & Introductions', child: 'Aarav', duration: 25 },
    { time: '10:00 AM', title: 'Numbers 1-10', child: 'Meera', duration: 30 },
    { time: '2:00 PM', title: 'Colors & Shapes', child: 'Aarav', duration: 20 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lessons.map((lesson, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-600">{lesson.time}</div>
                <div>
                  <h3 className="font-semibold">{lesson.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{lesson.duration} min</span>
                    <span>•</span>
                    <span>{lesson.child}</span>
                  </div>
                </div>
              </div>
              <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
