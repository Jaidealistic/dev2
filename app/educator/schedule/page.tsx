'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Plus, Clock, BookOpen, Users } from 'lucide-react';

const SCHEDULE = [
  { id: '1', day: 'Monday', time: '09:00', lesson: 'English Greetings', class: 'Class A', duration: '45 min' },
  { id: '2', day: 'Monday', time: '10:00', lesson: 'Tamil Writing Basics', class: 'Class B', duration: '45 min' },
  { id: '3', day: 'Tuesday', time: '09:00', lesson: 'Pronunciation Practice', class: 'Class A', duration: '30 min' },
  { id: '4', day: 'Wednesday', time: '09:00', lesson: 'Grammar Review', class: 'Class A', duration: '45 min' },
  { id: '5', day: 'Wednesday', time: '14:00', lesson: 'Reading Comprehension', class: 'Class C', duration: '60 min' },
  { id: '6', day: 'Thursday', time: '09:00', lesson: 'Tamil Conversations', class: 'Class B', duration: '45 min' },
  { id: '7', day: 'Friday', time: '09:00', lesson: 'Weekly Quiz', class: 'All Classes', duration: '30 min' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function EducatorSchedule() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/educator/dashboard" className="text-[#6b6b6b] hover:text-[#2d2d2d]"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-lg font-semibold text-[#2d2d2d]">Teaching Schedule</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#7a9b7e] text-white text-sm font-medium rounded-xl hover:bg-[#6b8c6f]"><Plus className="w-4 h-4" /> Add Session</button>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-6">
        {DAYS.map(day => {
          const sessions = SCHEDULE.filter(s => s.day === day);
          if (sessions.length === 0) return null;
          return (
            <div key={day} className="mb-6">
              <h2 className="text-sm font-semibold text-[#2d2d2d] mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-[#7a9b7e]" /> {day}</h2>
              <div className="space-y-2">
                {sessions.map(s => (
                  <div key={s.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#e8e5e0]">
                    <span className="text-sm font-mono text-[#7a9b7e] w-14">{s.time}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2d2d2d]">{s.lesson}</p>
                      <p className="text-xs text-[#8a8a8a] flex items-center gap-2"><Users className="w-3 h-3" />{s.class} · <Clock className="w-3 h-3" />{s.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
