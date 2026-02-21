'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen } from 'lucide-react';

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
          <div className="grid grid-cols-1 gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-emerald-100/50 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                      {student.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {student.disabilities?.map((d: string) => (
                        <Badge
                          key={d}
                          variant="secondary"
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors"
                        >
                          {d}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden sm:block text-right">
                    <div className="flex items-center gap-1.5 justify-end text-slate-400">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span className="text-[11px] font-bold uppercase tracking-widest">{student.lessonsCompleted} Lessons</span>
                    </div>
                    <p className="text-sm font-black text-emerald-600 mt-1">
                      {student.averageScore}% <span className="text-[10px] font-medium text-emerald-400 ml-0.5">AVG SCORE</span>
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-sm"
                    asChild
                  >
                    <Link href={`/educator/students/${student.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
