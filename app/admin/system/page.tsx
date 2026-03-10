'use client';
import Link from 'next/link';
import { ArrowLeft, Server, Database, Cpu, HardDrive, Activity, Settings } from 'lucide-react';

const SERVICES = [
  { name: 'Next.js Application', status: 'Running', uptime: '14d 7h', version: 'v16.0', icon: Server },
  { name: 'PostgreSQL Database', status: 'Running', uptime: '14d 7h', version: '15.3', icon: Database },
  { name: 'MongoDB', status: 'Running', uptime: '14d 6h', version: '7.0', icon: Database },
  { name: 'Redis Cache', status: 'Running', uptime: '14d 7h', version: '7.2', icon: HardDrive },
  { name: 'ML Service (FastAPI)', status: 'Running', uptime: '13d 22h', version: '0.1.0', icon: Cpu },
  { name: 'Collaboration Service', status: 'Running', uptime: '14d 5h', version: '1.0.0', icon: Activity },
];

export default function AdminSystem() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/admin/dashboard" className="text-[#6b6b6b] hover:text-[#2d2d2d]"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-lg font-semibold text-[#2d2d2d]">System Overview</h1>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(s => (
            <div key={s.name} className="bg-white rounded-2xl border border-[#e8e5e0] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#f0f4f0] flex items-center justify-center"><s.icon className="w-5 h-5 text-[#7a9b7e]" /></div>
                <div className="flex-1"><p className="text-sm font-medium text-[#2d2d2d]">{s.name}</p><p className="text-[10px] text-[#8a8a8a]">v{s.version}</p></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-green-600"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />{s.status}</span>
                <span className="text-[10px] text-[#8a8a8a]">Uptime: {s.uptime}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <Link href="/admin/system/logs" className="px-4 py-2.5 bg-white border border-[#e8e5e0] text-sm text-[#6b6b6b] rounded-xl hover:bg-[#f0ede8] transition-colors">View Logs</Link>
          <Link href="/admin/system/health" className="px-4 py-2.5 bg-white border border-[#e8e5e0] text-sm text-[#6b6b6b] rounded-xl hover:bg-[#f0ede8] transition-colors">Health Checks</Link>
        </div>
      </div>
    </div>
  );
}
