'use client';

import { ArrowLeft, Save, Plus, Settings2, Image as ImageIcon, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function EditLessonPage({ params }: { params: { lessonId: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/educator/content" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Editing: {params.lessonId}</h1>
            <p className="text-sm text-slate-500">Draft mode - Changes auto-save</p>
          </div>
        </div>
        
        <div className="flex gap-2">
           <Link href={`/educator/content/${params.lessonId}/preview`} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-600">
             Preview
           </Link>
           <button className="flex items-center gap-2 px-6 py-2 bg-[#5a8c5c] hover:bg-[#4a7c4c] text-white rounded-lg font-medium transition-colors">
             <Save className="w-4 h-4" /> Publish
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
           {/* Section 1 */}
           <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-slate-800 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-slate-400" /> Cover Media</h3>
               <button className="text-[#5a8c5c] hover:underline text-sm font-medium">Replace</button>
             </div>
             <div className="h-40 bg-slate-100 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                Drag & drop image or video here
             </div>
           </div>

           {/* Section 2 */}
           <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-semibold text-slate-800 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-slate-400" /> Text Content</h3>
               <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><Settings2 className="w-4 h-4" /></button>
             </div>
             <textarea rows={6} className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7da47f] resize-y" placeholder="Start typing the lesson content..." defaultValue="This is the introduction module..."></textarea>
           </div>
           
           <button className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:text-[#5a8c5c] hover:border-[#5a8c5c] hover:bg-[#f0f7f0] transition-colors flex items-center justify-center gap-2 font-medium">
             <Plus className="w-5 h-5" /> Add New Content Block
           </button>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Lesson Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Language</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7da47f]">
                  <option>English</option>
                  <option>Tamil</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty Level</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7da47f]">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Duration</label>
                <div className="flex items-center gap-2">
                  <input type="number" defaultValue={15} className="w-20 px-3 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#7da47f]" />
                  <span className="text-sm text-slate-500">minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
