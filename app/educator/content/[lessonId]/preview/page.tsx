'use client';

import { ArrowLeft, Play, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function LessonPreviewPage({ params }: { params: { lessonId: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/educator/content" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Lesson Preview: {params.lessonId}</h1>
            <p className="text-sm text-slate-500">Student view of the lesson structure</p>
          </div>
        </div>
        
        <Link href={`/educator/content/${params.lessonId}/edit`} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" /> Edit mode
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="h-48 bg-slate-100 relative group">
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
               <Play className="w-6 h-6 text-[#5a8c5c] ml-1" />
             </div>
           </div>
        </div>
        
        <div className="p-8 flex-1">
          <div className="inline-block px-3 py-1 bg-[#f0f7f0] text-[#5a8c5c] rounded-full text-xs font-bold tracking-wide uppercase mb-4">
            Interactive Lesson Preview
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Sample Lesson Title</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            This is a preview rendering of how the content will appear to a student on their device.
            The multimedia elements and interactive checks are active.
          </p>
          
          <div className="space-y-4">
            <div className="h-12 bg-slate-50 rounded-xl border border-slate-100"></div>
            <div className="h-12 bg-slate-50 rounded-xl border border-slate-100"></div>
            <div className="h-12 bg-slate-50 rounded-xl border border-slate-100"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
