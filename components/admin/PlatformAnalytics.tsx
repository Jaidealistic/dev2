'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Users, BookOpen, TrendingUp, Activity } from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalLessons: number;
    completionRate: number;
  };
  userGrowth: Array<{ date: string; users: number }>;
  lessonActivity: Array<{ date: string; completed: number; started: number }>;
}

export default function PlatformAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load analytics:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="animate-pulse">Loading analytics...</div>;
  }

  if (!data || !data.overview) {
    return (
      <Card className="p-8 text-center bg-yellow-50 border-yellow-200">
        <p className="text-yellow-700">Analytics data is partially unavailable. Please check back later.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white rounded-xl border border-[#f0ede8] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#2d2d2d]">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#7a9b7e]" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2d2d2d]">{data.overview.totalUsers}</div>
            <p className="text-xs text-[#8a8a8a]">
              {data.overview.activeUsers} active this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border border-[#f0ede8] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#2d2d2d]">Total Lessons</CardTitle>
            <BookOpen className="h-4 w-4 text-[#7a9b7e]" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2d2d2d]">{data.overview.totalLessons}</div>
            <p className="text-xs text-[#8a8a8a]">Published content</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border border-[#f0ede8] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#2d2d2d]">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#7a9b7e]" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2d2d2d]">{data.overview.completionRate}%</div>
            <p className="text-xs text-[#8a8a8a]">Average across platform</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border border-[#f0ede8] shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#2d2d2d]">Active Accounts</CardTitle>
            <Activity className="h-4 w-4 text-[#7a9b7e]" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2d2d2d]">
              {data.overview.activeUsers}
            </div>
            <p className="text-xs text-[#8a8a8a]">Unrestricted users</p>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card className="bg-white rounded-xl border border-[#f0ede8] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2d2d2d]">User Growth (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Total Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lesson Activity Chart */}
      <Card className="bg-white rounded-xl border border-[#f0ede8] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#2d2d2d]">Lesson Activity (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.lessonActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="started" fill="hsl(var(--primary))" name="Started" />
              <Bar dataKey="completed" fill="hsl(var(--success))" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}