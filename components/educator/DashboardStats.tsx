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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;

        const colors = {
          blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            icon: 'text-blue-600',
            border: 'border-blue-100',
            shadow: 'shadow-[0_8px_30px_rgb(59,130,246,0.08)]'
          },
          green: {
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            icon: 'text-emerald-600',
            border: 'border-emerald-100',
            shadow: 'shadow-[0_8px_30px_rgb(16,185,129,0.08)]'
          },
          purple: {
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            icon: 'text-purple-600',
            border: 'border-purple-100',
            shadow: 'shadow-[0_8px_30px_rgb(147,51,234,0.08)]'
          },
          orange: {
            bg: 'bg-orange-50',
            text: 'text-orange-600',
            icon: 'text-orange-600',
            border: 'border-orange-100',
            shadow: 'shadow-[0_8px_30px_rgb(249,115,22,0.08)]'
          }
        };

        const theme = colors[card.color as keyof typeof colors] || colors.blue;

        return (
          <Card
            key={card.title}
            className={`group relative overflow-hidden border-0 transition-all duration-300 hover:-translate-y-1 ${theme.shadow} hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]`}
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${theme.icon.replace('text-', 'bg-')}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-xl ${theme.bg} ${theme.text} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-black tracking-tight text-slate-900">
                  {card.value}
                </span>
                {card.title === 'Avg Progress' && (
                  <span className="text-xs font-semibold text-emerald-500 ml-1">
                    ↑ 2.4%
                  </span>
                )}
              </div>
              <div className="mt-2 text-[10px] font-medium text-gray-400">
                Last updated just now
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}