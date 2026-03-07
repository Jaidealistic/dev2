'use client';

import { Calendar, Plus, Info } from 'lucide-react';

export default function WeeklySchedulePage() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const subjects = ['English Language Arts', 'Tamil Literature', 'Mathematics', 'Science Basics'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Weekly Schedule Builder</h1>
          <p className="text-sm text-slate-500">Plan your homeschool curriculum effectively.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#5a8c5c] hover:bg-[#4a7c4c] text-white rounded-lg font-medium transition-colors">
          <Calendar className="w-4 h-4" /> Sync Calendar
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800">
        <Info className="w-5 h-5 shrink-0 content-center mt-0.5" />
        <p className="text-sm leading-relaxed">
          Ensure you allocate at least 5 hours of structured learning per week to meet local homeschooling compliance requirements.
        </p>
      </div>

      <div className="bg-white border text-center border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
         <div className="grid grid-cols-6 divide-x divide-slate-100 border-b border-slate-200 bg-slate-50 relative">
            <div className="p-4 font-semibold text-slate-500 text-sm">Time</div>
            {days.map(day => (
              <div key={day} className="p-4 font-semibold text-slate-700 text-center">{day}</div>
            ))}
         </div>

         {/* Time slots */}
         {['09:00 AM', '10:00 AM', '11:00 AM'].map(time => (
            <div key={time} className="grid grid-cols-6 divide-x divide-slate-100 border-b border-slate-100 min-h-[100px]">
              <div className="p-4 text-sm font-medium text-slate-500">{time}</div>
              {days.map((day, i) => (
                <div key={`${day}-${time}`} className="p-2 relative group cursor-pointer hover:bg-slate-50 transition-colors">
                  {(time === '09:00 AM' && i === 0) || (time === '11:00 AM' && i === 2) ? (
                    <div className="absolute inset-2 bg-[#f0f7f0] border border-[#a3b8a5] rounded-xl p-3 shadow-sm">
                      <div className="font-semibold text-[#4a7c4c] text-sm">English Lesson</div>
                      <div className="text-xs text-[#5a8c5c] mt-1">Foundations Module</div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="flex items-center gap-1 text-[#5a8c5c] text-xs font-semibold bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
                        <Plus className="w-3 h-3" /> Add block
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
         ))}
      </div>
    </div>
  );
}
