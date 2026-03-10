'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Shield, MoreHorizontal, UserCheck, UserX } from 'lucide-react';

const USERS = [
  { id: '1', name: 'Ananya Kumar', email: 'ananya@example.com', role: 'LEARNER', status: 'Active', joined: '2025-12-15' },
  { id: '2', name: 'Ravi Shankar', email: 'ravi@example.com', role: 'EDUCATOR', status: 'Active', joined: '2025-11-20' },
  { id: '3', name: 'Priya Devi', email: 'priya@example.com', role: 'PARENT', status: 'Active', joined: '2026-01-03' },
  { id: '4', name: 'Suresh M', email: 'suresh@example.com', role: 'LEARNER', status: 'Suspended', joined: '2025-10-01' },
  { id: '5', name: 'Lakshmi R', email: 'lakshmi@example.com', role: 'ADMIN', status: 'Active', joined: '2025-09-01' },
];

const ROLE_COLORS: Record<string, string> = {
  LEARNER: 'bg-blue-50 text-blue-700', EDUCATOR: 'bg-purple-50 text-purple-700',
  PARENT: 'bg-amber-50 text-amber-700', ADMIN: 'bg-red-50 text-red-700',
};

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const filtered = USERS.filter(u =>
    (roleFilter === 'ALL' || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/admin/dashboard" className="text-[#6b6b6b] hover:text-[#2d2d2d]"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-lg font-semibold text-[#2d2d2d]">User Management</h1>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a8a]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-white text-sm focus:ring-2 focus:ring-[#7a9b7e] outline-none" />
          </div>
          {['ALL', 'LEARNER', 'EDUCATOR', 'PARENT', 'ADMIN'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${roleFilter === r ? 'bg-[#7a9b7e] text-white' : 'bg-white border border-[#e8e5e0] text-[#6b6b6b] hover:bg-[#f0ede8]'}`}
            >{r === 'ALL' ? 'All Roles' : r}</button>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#e8e5e0]">
              <th className="text-left px-5 py-3 text-xs font-medium text-[#8a8a8a]">User</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-[#8a8a8a]">Role</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-[#8a8a8a]">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-[#8a8a8a]">Joined</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-[#8a8a8a]">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-[#f0ede8] last:border-0 hover:bg-[#faf9f7]">
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#2d2d2d]">{u.name}</p>
                    <p className="text-xs text-[#8a8a8a]">{u.email}</p>
                  </td>
                  <td className="px-5 py-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role]}`}>{u.role}</span></td>
                  <td className="px-5 py-3">
                    <span className={`flex items-center gap-1 text-xs ${u.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-400' : 'bg-red-400'}`} />{u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-[#8a8a8a]">{u.joined}</td>
                  <td className="px-5 py-3">
                    <button className="p-1.5 rounded-lg text-[#8a8a8a] hover:bg-[#f0ede8]"><MoreHorizontal className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
