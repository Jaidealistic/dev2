'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Users, MapPin, Calendar, BookOpen, MessageCircle } from 'lucide-react';

const COOPS = [
  { id: '1', name: 'South Chennai Learners', members: 12, location: 'Chennai, TN', nextMeet: '2026-03-10', focus: 'English & Tamil', status: 'Active' },
  { id: '2', name: 'Bangalore Homeschool Group', members: 8, location: 'Bangalore, KA', nextMeet: '2026-03-12', focus: 'English', status: 'Active' },
  { id: '3', name: 'Kerala Language Exchange', members: 15, location: 'Kochi, KL', nextMeet: '2026-03-15', focus: 'Tamil & Malayalam', status: 'Active' },
];

export default function HomeschoolCoops() {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/homeschool/dashboard" className="text-[#6b6b6b] hover:text-[#2d2d2d]"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-lg font-semibold text-[#2d2d2d]">Learning Co-ops</h1>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-[#7a9b7e] text-white text-sm font-medium rounded-xl hover:bg-[#6b8c6f]"><Plus className="w-4 h-4" /> Create Co-op</button>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-6">
        {showCreate && (
          <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 mb-6">
            <h2 className="text-sm font-semibold text-[#2d2d2d] mb-4">Create New Co-op</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Co-op name" className="px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm outline-none focus:ring-2 focus:ring-[#7a9b7e]" />
              <input type="text" placeholder="Location" className="px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm outline-none focus:ring-2 focus:ring-[#7a9b7e]" />
              <input type="text" placeholder="Language focus" className="px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm outline-none focus:ring-2 focus:ring-[#7a9b7e]" />
              <input type="number" placeholder="Max members" className="px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm outline-none focus:ring-2 focus:ring-[#7a9b7e]" />
            </div>
            <button className="px-5 py-2.5 bg-[#7a9b7e] text-white text-sm font-medium rounded-xl hover:bg-[#6b8c6f]">Create Co-op</button>
          </div>
        )}
        <div className="space-y-3">
          {COOPS.map(c => (
            <div key={c.id} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#e8e5e0] hover:border-[#7a9b7e] transition-colors cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#f0f4f0] flex items-center justify-center"><Users className="w-6 h-6 text-[#7a9b7e]" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[#2d2d2d]">{c.name}</p>
                <div className="flex items-center gap-3 text-xs text-[#8a8a8a] mt-0.5">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{c.focus}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Next: {c.nextMeet}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#6b6b6b]"><Users className="w-3.5 h-3.5" /> {c.members}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
