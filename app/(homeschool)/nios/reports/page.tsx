'use client';

import { FileText, Download, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function NIOSReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">NIOS Compliance Reports</h1>
          <p className="text-sm text-slate-500">Track and export portfolio evidence for the National Institute of Open Schooling</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#5a8c5c] hover:bg-[#4a7c4c] text-white rounded-lg font-medium transition-colors">
          <Download className="w-4 h-4" /> Download Latest
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
               <FileText className="w-5 h-5" />
             </div>
             <h3 className="font-semibold text-slate-700">Total Credits</h3>
           </div>
           <p className="text-3xl font-bold text-slate-900">24 <span className="text-sm font-normal text-slate-500">/ 40 required</span></p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
               <TrendingUp className="w-5 h-5" />
             </div>
             <h3 className="font-semibold text-slate-700">Tutor Marked Assignments</h3>
           </div>
           <p className="text-3xl font-bold text-slate-900">4 <span className="text-sm font-normal text-slate-500">submitted</span></p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Available Reports</h3>
          <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none">
            <option>All terms</option>
            <option>Term 1 (2025)</option>
            <option>Term 2 (2025)</option>
          </select>
        </div>
        <div className="divide-y divide-slate-100">
           {Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#f0f7f0] rounded-xl flex items-center justify-center text-[#5a8c5c]">
                   <FileText className="w-6 h-6" />
                 </div>
                 <div>
                   <h4 className="font-medium text-slate-900">Term {3 - i} Progress Report - English</h4>
                   <p className="text-sm text-slate-500">Generated on {new Date(new Date().setDate(new Date().getDate() - (i * 30))).toLocaleDateString()}</p>
                 </div>
               </div>
               <button className="text-[#5a8c5c] hover:text-[#4a7c4c] font-medium text-sm flex items-center gap-1">
                 <Download className="w-4 h-4" /> PDF
               </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
