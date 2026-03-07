'use client';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, TrendingUp, BookOpen, Award, Calendar } from 'lucide-react';

const STUDENTS = [
  { name: 'Ananya K', lessons: 24, score: 88, attendance: '95%', level: 'Intermediate' },
  { name: 'Ravi S', lessons: 18, score: 72, attendance: '87%', level: 'Beginner' },
  { name: 'Priya D', lessons: 30, score: 92, attendance: '98%', level: 'Advanced' },
  { name: 'Suresh M', lessons: 12, score: 65, attendance: '78%', level: 'Beginner' },
];

export default function NIOSReports() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/homeschool/dashboard" className="text-[#6b6b6b] hover:text-[#2d2d2d]"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-lg font-semibold text-[#2d2d2d]">NIOS Compliance Reports</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#7a9b7e] text-white text-sm font-medium rounded-xl hover:bg-[#6b8c6f]"><Download className="w-4 h-4" /> Export PDF</button>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Hours', value: '312', icon: Calendar, color: '#7a9b7e' },
            { label: 'Avg. Score', value: '79%', icon: TrendingUp, color: '#5a8c5c' },
            { label: 'Lessons Done', value: '84', icon: BookOpen, color: '#9db4a0' },
            { label: 'Certifications', value: '3', icon: Award, color: '#6b8c6f' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#e8e5e0] p-5">
              <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
              <p className="text-2xl font-bold text-[#2d2d2d]">{s.value}</p>
              <p className="text-xs text-[#8a8a8a]">{s.label}</p>
            </div>
          ))}
        </div>
        {/* Student progress table */}
        <div className="bg-white rounded-2xl border border-[#e8e5e0] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#e8e5e0]">
            <h2 className="text-sm font-semibold text-[#2d2d2d]">Student Progress</h2>
          </div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[#f0ede8]">
              <th className="text-left px-5 py-3 text-xs font-medium text-[#8a8a8a]">Student</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-[#8a8a8a]">Lessons</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-[#8a8a8a]">Score</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-[#8a8a8a]">Attendance</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-[#8a8a8a]">Level</th>
            </tr></thead>
            <tbody>
              {STUDENTS.map(s => (
                <tr key={s.name} className="border-b border-[#f0ede8] last:border-0">
                  <td className="px-5 py-3 font-medium text-[#2d2d2d]">{s.name}</td>
                  <td className="px-5 py-3 text-[#6b6b6b]">{s.lessons}</td>
                  <td className="px-5 py-3"><span className={`font-medium ${s.score >= 80 ? 'text-green-600' : s.score >= 70 ? 'text-amber-600' : 'text-red-600'}`}>{s.score}%</span></td>
                  <td className="px-5 py-3 text-[#6b6b6b]">{s.attendance}</td>
                  <td className="px-5 py-3"><span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f0f4f0] text-[#5d7e61]">{s.level}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
