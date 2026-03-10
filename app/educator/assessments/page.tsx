'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, FileText, Clock, Users, BarChart, CheckSquare } from 'lucide-react';

const ASSESSMENTS = [
  { id: '1', title: 'English Greetings Quiz', type: 'Quiz', questions: 10, submissions: 48, avgScore: 82, deadline: '2026-03-10', status: 'Active' },
  { id: '2', title: 'Tamil Writing Test', type: 'Written', questions: 5, submissions: 32, avgScore: 75, deadline: '2026-03-08', status: 'Active' },
  { id: '3', title: 'Pronunciation Check - Advanced', type: 'Oral', questions: 8, submissions: 15, avgScore: 68, deadline: '2026-03-15', status: 'Draft' },
  { id: '4', title: 'Mid-term Grammar Review', type: 'Quiz', questions: 20, submissions: 120, avgScore: 78, deadline: '2026-02-28', status: 'Closed' },
];

export default function EducatorAssessments() {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/educator/dashboard" className="text-[#6b6b6b] hover:text-[#2d2d2d]"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-lg font-semibold text-[#2d2d2d]">Assessments</h1>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-[#7a9b7e] text-white text-sm font-medium rounded-xl hover:bg-[#6b8c6f]">
            <Plus className="w-4 h-4" /> Create Assessment
          </button>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-6">
        {showCreate && (
          <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 mb-6">
            <h2 className="text-sm font-semibold text-[#2d2d2d] mb-4">New Assessment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Assessment title" className="px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm outline-none focus:ring-2 focus:ring-[#7a9b7e]" />
              <select className="px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm outline-none focus:ring-2 focus:ring-[#7a9b7e]">
                <option>Quiz</option><option>Written</option><option>Oral</option><option>Mixed</option>
              </select>
              <input type="date" className="px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm outline-none focus:ring-2 focus:ring-[#7a9b7e]" />
              <input type="number" placeholder="Number of questions" className="px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm outline-none focus:ring-2 focus:ring-[#7a9b7e]" />
            </div>
            <button className="px-5 py-2.5 bg-[#7a9b7e] text-white text-sm font-medium rounded-xl hover:bg-[#6b8c6f]">Create</button>
          </div>
        )}
        <div className="space-y-3">
          {ASSESSMENTS.map(a => (
            <div key={a.id} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#e8e5e0]">
              <div className="w-10 h-10 rounded-xl bg-[#f0f4f0] flex items-center justify-center"><FileText className="w-5 h-5 text-[#7a9b7e]" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[#2d2d2d]">{a.title}</p>
                <p className="text-xs text-[#8a8a8a]">{a.type} · {a.questions} questions · Due: {a.deadline}</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-[#6b6b6b]">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {a.submissions}</span>
                <span className="flex items-center gap-1"><BarChart className="w-3.5 h-3.5" /> {a.avgScore}%</span>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${a.status === 'Active' ? 'bg-green-50 text-green-700' : a.status === 'Draft' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
