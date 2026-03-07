'use client';
import Link from 'next/link';
import { ArrowLeft, Flag, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

const FLAGS = [
  { id: '1', type: 'Inappropriate', content: 'Comment on Lesson #23', reporter: 'Ananya K', reportedUser: 'user_47', date: '2026-03-03', status: 'Pending' },
  { id: '2', type: 'Spam', content: 'Forum post in Study Group', reporter: 'System', reportedUser: 'user_112', date: '2026-03-02', status: 'Pending' },
  { id: '3', type: 'Copyright', content: 'Uploaded lesson material', reporter: 'Ravi S', reportedUser: 'edu_5', date: '2026-02-28', status: 'Resolved' },
  { id: '4', type: 'Offensive', content: 'Whiteboard drawing in Room #4', reporter: 'Priya D', reportedUser: 'user_89', date: '2026-03-01', status: 'Dismissed' },
];

export default function AdminModeration() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/admin/dashboard" className="text-[#6b6b6b] hover:text-[#2d2d2d]"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-lg font-semibold text-[#2d2d2d]">Content Moderation</h1>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-3">
        {FLAGS.map(f => (
          <div key={f.id} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#e8e5e0]">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.status === 'Pending' ? 'bg-amber-50' : f.status === 'Resolved' ? 'bg-green-50' : 'bg-gray-100'}`}>
              {f.status === 'Pending' ? <AlertTriangle className="w-5 h-5 text-amber-600" /> : f.status === 'Resolved' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-gray-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[#2d2d2d]">{f.type}: {f.content}</p>
              <p className="text-xs text-[#8a8a8a]">Reported by {f.reporter} · User: {f.reportedUser} · {f.date}</p>
            </div>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${f.status === 'Pending' ? 'bg-amber-50 text-amber-700' : f.status === 'Resolved' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{f.status}</span>
            {f.status === 'Pending' && (
              <div className="flex gap-1">
                <button className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg hover:bg-green-100">Approve</button>
                <button className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100">Dismiss</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
