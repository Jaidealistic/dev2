'use client';

import { ArrowLeft, Users, Save } from 'lucide-react';
import Link from 'next/link';

export default function CreateCoOpPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/homeschool/co-op" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Form a Homeschool Co-op</h1>
          <p className="text-sm text-slate-500">Create a collaborative learning group with other families.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-center w-16 h-16 bg-[#f0f7f0] text-[#5a8c5c] rounded-2xl mb-6">
            <Users className="w-8 h-8" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Co-op Name</label>
            <input type="text" placeholder="e.g. Sunny Days Homeschool Collective" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#7da47f] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description & Philosophy</label>
            <textarea placeholder="Describe the goals and teaching philosophy of your co-op..." rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#7da47f] outline-none resize-y"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Families</label>
              <input type="number" defaultValue={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#7da47f] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Meeting Frequency</label>
              <select className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#7da47f]">
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 mt-2">
            <h3 className="font-semibold text-slate-800 mb-2">Privacy Settings</h3>
            <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input type="radio" name="privacy" className="mt-1" defaultChecked />
              <div>
                <p className="font-medium text-slate-900">Private (Invite only)</p>
                <p className="text-sm text-slate-500">Only families with the invite code can join your co-op.</p>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors mt-3">
              <input type="radio" name="privacy" className="mt-1" />
              <div>
                <p className="font-medium text-slate-900">Public (Request to join)</p>
                <p className="text-sm text-slate-500">Other local families can find your co-op and request membership.</p>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button className="flex items-center gap-2 px-8 py-3 bg-[#5a8c5c] hover:bg-[#4a7c4c] text-white rounded-xl font-medium transition-colors w-full justify-center text-lg">
              <Save className="w-5 h-5" /> Create Co-op
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
