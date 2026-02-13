'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function StudentList({ educatorId }: { educatorId: string }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/educator/students')
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [educatorId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Students</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : students.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No students assigned yet</p>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold">{student.name}</h3>
                  <div className="flex gap-2 mt-1">
                    {student.disabilities?.map((d: string) => (
                      <Badge key={d} variant="outline" className="text-xs">
                        {d}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {student.lessonsCompleted} lessons completed
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    {student.averageScore}% avg score
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/educator/students/${student.id}`}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
