'use client';

import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CreateAssessmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/educator/assessments" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Assessment</h1>
          <p className="text-sm text-slate-500">Design a customized assessment for your students.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assessment Title</label>
            <input type="text" placeholder="e.g. Mid-term English Evaluation" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#7da47f] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea placeholder="Provide instructions for the students..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#7da47f] outline-none resize-y"></textarea>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="font-semibold text-slate-800 mb-4">Questions</h3>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-start mb-3">
                <input type="text" placeholder="Question 1 text..." className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#7da47f] outline-none" />
                <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg ml-2"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="space-y-2 pl-4">
                <input type="text" placeholder="Option A" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#7da47f] outline-none text-sm" />
                <input type="text" placeholder="Option B" className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#7da47f] outline-none text-sm" />
              </div>
            </div>

            <button className="flex items-center gap-2 text-[#5a8c5c] font-medium hover:text-[#4a7c4c] transition-colors">
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Link href="/educator/assessments" className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors">Cancel</Link>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#5a8c5c] hover:bg-[#4a7c4c] text-white rounded-xl font-medium transition-colors">
              <Save className="w-4 h-4" /> Save Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
