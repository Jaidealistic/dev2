'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BarChart3, Users, BookOpen, TrendingUp, Clock, Award, ArrowLeft } from 'lucide-react';

const STATS = [
  { label: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: '#7a9b7e' },
  { label: 'Active Learners', value: '1,423', change: '+8%', icon: TrendingUp, color: '#5a8c5c' },
  { label: 'Lessons Completed', value: '18,392', change: '+23%', icon: BookOpen, color: '#9db4a0' },
  { label: 'Avg. Session Time', value: '24 min', change: '+5%', icon: Clock, color: '#6b8c6f' },
];

const ENGAGEMENT = [
  { month: 'Sep', users: 820 }, { month: 'Oct', users: 1050 }, { month: 'Nov', users: 1280 },
  { month: 'Dec', users: 1100 }, { month: 'Jan', users: 1560 }, { month: 'Feb', users: 1890 },
  { month: 'Mar', users: 2200 },
];

const ROLES = [
  { role: 'Learners', count: 2100, pct: 74, color: '#7a9b7e' },
  { role: 'Parents', count: 450, pct: 16, color: '#5a8c5c' },
  { role: 'Educators', count: 250, pct: 8, color: '#9db4a0' },
  { role: 'Admins', count: 47, pct: 2, color: '#4a7c4c' },
];

export default function AdminAnalytics() {
  const maxUsers = Math.max(...ENGAGEMENT.map(e => e.users));
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/admin/dashboard" className="text-[#6b6b6b] hover:text-[#2d2d2d]"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-lg font-semibold text-[#2d2d2d]">Platform Analytics</h1>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#e8e5e0] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{s.change}</span>
              </div>
              <p className="text-2xl font-bold text-[#2d2d2d]">{s.value}</p>
              <p className="text-xs text-[#8a8a8a] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Engagement chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e8e5e0] p-6">
            <h2 className="text-sm font-semibold text-[#2d2d2d] mb-4">User Growth</h2>
            <div className="flex items-end gap-3 h-48">
              {ENGAGEMENT.map(e => (
                <div key={e.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[#8a8a8a]">{e.users}</span>
                  <div className="w-full bg-[#7a9b7e] rounded-t-lg transition-all" style={{ height: `${(e.users / maxUsers) * 100}%` }} />
                  <span className="text-[10px] text-[#8a8a8a]">{e.month}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Role distribution */}
          <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6">
            <h2 className="text-sm font-semibold text-[#2d2d2d] mb-4">User Roles</h2>
            <div className="space-y-4">
              {ROLES.map(r => (
                <div key={r.role}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#6b6b6b]">{r.role}</span>
                    <span className="font-medium text-[#2d2d2d]">{r.count}</span>
                  </div>
                  <div className="h-2 bg-[#f0ede8] rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${r.pct}%`, backgroundColor: r.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
