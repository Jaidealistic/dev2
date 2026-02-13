'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, TrendingUp, Clock } from 'lucide-react';

export default function DashboardStats({ userId }: { userId: string }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeLessons: 0,
    averageProgress: 0,
    totalTeachingHours: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/educator/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats || stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  const cards = [
    { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'blue' },
    { title: 'Active Lessons', value: stats.activeLessons, icon: BookOpen, color: 'green' },
    { title: 'Avg Progress', value: `${stats.averageProgress}%`, icon: TrendingUp, color: 'purple' },
    { title: 'Teaching Hours', value: stats.totalTeachingHours, icon: Clock, color: 'orange' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        // Construct class names dynamically for safety if needed, or stick to simple classes
        // Note: Tailwind dynamic classes like `text-${color}-600` might not be purged correctly if not safelisted.
        // For simplicity reusing the logic from the prompt, but ideally we should map colors explicitly.
        let iconColorClass = "text-gray-600";
        if (card.color === 'blue') iconColorClass = "text-blue-600";
        if (card.color === 'green') iconColorClass = "text-green-600";
        if (card.color === 'purple') iconColorClass = "text-purple-600";
        if (card.color === 'orange') iconColorClass = "text-orange-600";

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <Icon className={`h-5 w-5 ${iconColorClass}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}