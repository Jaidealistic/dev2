'use client';
import Link from 'next/link';
import { ArrowLeft, FileText, Filter } from 'lucide-react';
import { useState } from 'react';

const LOGS = [
  { id: '1', timestamp: '2026-03-04 23:15:22', user: 'admin@lexfix.com', action: 'USER_LOGIN', details: 'Admin login from 192.168.1.45', level: 'INFO' },
  { id: '2', timestamp: '2026-03-04 23:10:15', user: 'system', action: 'LESSON_PUBLISHED', details: 'Lesson "Tamil Greetings" published by edu_5', level: 'INFO' },
  { id: '3', timestamp: '2026-03-04 22:58:03', user: 'system', action: 'USER_REGISTERED', details: 'New learner: ananya.kumar@example.com', level: 'INFO' },
  { id: '4', timestamp: '2026-03-04 22:45:10', user: 'system', action: 'ML_SERVICE_RESTART', details: 'ML service restarted after memory spike', level: 'WARN' },
  { id: '5', timestamp: '2026-03-04 22:30:00', user: 'cron', action: 'BACKUP_COMPLETED', details: 'Database backup completed (2.3GB)', level: 'INFO' },
  { id: '6', timestamp: '2026-03-04 22:15:44', user: 'system', action: 'CONTENT_FLAGGED', details: 'Comment flagged on lesson #23', level: 'WARN' },
  { id: '7', timestamp: '2026-03-04 21:59:11', user: 'system', action: 'AUTH_FAILED', details: 'Failed login attempt for user_47 (3rd attempt)', level: 'ERROR' },
];

const LEVEL_COLORS: Record<string, string> = { INFO: 'bg-blue-50 text-blue-700', WARN: 'bg-amber-50 text-amber-700', ERROR: 'bg-red-50 text-red-700' };

export default function AdminLogs() {
  const [filter, setFilter] = useState('ALL');
  const filtered = filter === 'ALL' ? LOGS : LOGS.filter(l => l.level === filter);
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/admin/system" className="text-[#6b6b6b] hover:text-[#2d2d2d]"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-lg font-semibold text-[#2d2d2d]">Audit Logs</h1>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-6">
          {['ALL', 'INFO', 'WARN', 'ERROR'].map(l => (
            <button key={l} onClick={() => setFilter(l)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === l ? 'bg-[#7a9b7e] text-white' : 'bg-white border border-[#e8e5e0] text-[#6b6b6b]'}`}>{l}</button>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
          {filtered.map(l => (
            <div key={l.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-[#f0ede8] last:border-0 hover:bg-[#faf9f7]">
              <span className="text-[10px] font-mono text-[#8a8a8a] w-32 shrink-0">{l.timestamp}</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${LEVEL_COLORS[l.level]}`}>{l.level}</span>
              <span className="text-xs font-medium text-[#2d2d2d] w-40 shrink-0">{l.action}</span>
              <span className="text-xs text-[#6b6b6b] truncate">{l.details}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
