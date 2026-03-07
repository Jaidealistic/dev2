'use client';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const CHECKS = [
  { name: 'PostgreSQL', status: 'healthy', latency: '3ms', lastCheck: '10s ago' },
  { name: 'MongoDB', status: 'healthy', latency: '5ms', lastCheck: '10s ago' },
  { name: 'Redis Cache', status: 'healthy', latency: '1ms', lastCheck: '10s ago' },
  { name: 'ML Service (FastAPI)', status: 'healthy', latency: '42ms', lastCheck: '10s ago' },
  { name: 'Collaboration Service', status: 'healthy', latency: '8ms', lastCheck: '10s ago' },
  { name: 'Email Service', status: 'degraded', latency: '1200ms', lastCheck: '10s ago' },
  { name: 'File Storage', status: 'healthy', latency: '15ms', lastCheck: '10s ago' },
];

export default function AdminHealth() {
  const [refreshing, setRefreshing] = useState(false);
  const refresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/system" className="text-[#6b6b6b] hover:text-[#2d2d2d]"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-lg font-semibold text-[#2d2d2d]">Health Checks</h1>
          </div>
          <button onClick={refresh} className={`flex items-center gap-2 px-4 py-2 bg-white border border-[#e8e5e0] text-sm text-[#6b6b6b] rounded-xl hover:bg-[#f0ede8] ${refreshing ? 'opacity-50' : ''}`}>
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
          {CHECKS.map(c => (
            <div key={c.name} className="flex items-center gap-4 px-5 py-4 border-b border-[#f0ede8] last:border-0">
              {c.status === 'healthy' ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0" /> : <XCircle className="w-5 h-5 text-amber-500 shrink-0" />}
              <div className="flex-1">
                <p className="text-sm font-medium text-[#2d2d2d]">{c.name}</p>
                <p className="text-[10px] text-[#8a8a8a]">Last checked: {c.lastCheck}</p>
              </div>
              <span className="text-xs font-mono text-[#8a8a8a]">{c.latency}</span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${c.status === 'healthy' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
