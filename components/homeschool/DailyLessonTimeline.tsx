'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Circle, Play } from 'lucide-react';

interface LessonSchedule {
  id: string;
  time: string;
  lessonId: string;
  title: string;
  duration: number;
  status: 'upcoming' | 'in-progress' | 'completed';
  childName: string;
}

export default function DailyLessonTimeline({ userId }: { userId: string }) {
  const [schedule, setSchedule] = useState<LessonSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/homeschool/schedule/daily')
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data.schedule || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load schedule:', error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (schedule.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No lessons scheduled for today</p>
        <Button asChild>
          <Link href="/homeschool/schedule/weekly">Plan Your Week</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedule.map((lesson, index) => (
        <div
          key={lesson.id}
          className={`flex items-start gap-4 p-4 rounded-lg border ${
            lesson.status === 'in-progress'
              ? 'border-primary bg-primary/5'
              : 'border-border'
          }`}
        >
          {/* Timeline Indicator */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {lesson.status === 'completed' && (
                <CheckCircle
                  className="h-6 w-6 text-success"
                  aria-label="Completed"
                />
              )}
              {lesson.status === 'in-progress' && (
                <Play
                  className="h-6 w-6 text-primary"
                  aria-label="In progress"
                />
              )}
              {lesson.status === 'upcoming' && (
                <Circle
                  className="h-6 w-6 text-muted-foreground"
                  aria-label="Not started"
                />
              )}
            </div>
            {index < schedule.length - 1 && (
              <div className="w-0.5 h-16 bg-border mt-2" aria-hidden="true"></div>
            )}
          </div>

          {/* Lesson Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {lesson.time}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {lesson.childName}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg">{lesson.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>{lesson.duration} minutes</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {lesson.status === 'upcoming' && (
                  <Button size="sm" asChild>
                    <Link href={`/homeschool/teach/${lesson.lessonId}`}>
                      Start Teaching
                    </Link>
                  </Button>
                )}
                {lesson.status === 'in-progress' && (
                  <Button size="sm" variant="default" asChild>
                    <Link href={`/homeschool/teach/${lesson.lessonId}`}>
                      Continue
                    </Link>
                  </Button>
                )}
                {lesson.status === 'completed' && (
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/homeschool/teach/${lesson.lessonId}`}>
                      Review
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}