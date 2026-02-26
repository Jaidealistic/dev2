'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Trash } from 'lucide-react';

export default function ContentList({ educatorId }: { educatorId: string }) {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content/lessons')
      .then((res) => res.json())
      .then((data) => {
        setLessons(data.lessons || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [educatorId]);

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;
    
    await fetch(`/api/content/lessons/${lessonId}`, { method: 'DELETE' });
    setLessons(lessons.filter(l => l.lessonId !== lessonId));
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (lessons.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <p className="text-gray-500 mb-4">No lessons created yet</p>
          <Button asChild>
            <Link href="/educator/content/create">Create Your First Lesson</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((lesson) => (
        <Card key={lesson.lessonId} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4"></div>
            <h3 className="font-semibold text-lg mb-2">{lesson.title.en}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {lesson.title.ta}
            </p>
            <div className="flex gap-2 mb-4">
              <Badge variant="outline">{lesson.level}</Badge>
              <Badge variant="outline">{lesson.language}</Badge>
              <Badge>{lesson.status}</Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild className="flex-1">
                <Link href={`/educator/content/${lesson.lessonId}/edit`}>
                  <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
                  Edit
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild className="flex-1">
                <Link href={`/educator/content/${lesson.lessonId}/preview`}>
                  <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                  Preview
                </Link>
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => handleDelete(lesson.lessonId)}
              >
                <Trash className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
