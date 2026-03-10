'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Image, Type, Mic, FileText } from 'lucide-react';

interface LessonBlock {
  id: string;
  type: 'text' | 'image' | 'audio' | 'quiz';
  content: string;
}

export default function LessonEditor() {
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('English');
  const [level, setLevel] = useState('Beginner');
  const [blocks, setBlocks] = useState<LessonBlock[]>([
    { id: '1', type: 'text', content: '' },
  ]);

  const addBlock = (type: LessonBlock['type']) => {
    setBlocks(prev => [...prev, { id: String(Date.now()), type, content: '' }]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const BLOCK_ICONS = { text: Type, image: Image, audio: Mic, quiz: FileText };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/educator/dashboard" className="text-[#6b6b6b] hover:text-[#2d2d2d]"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="text-lg font-semibold text-[#2d2d2d]">Lesson Editor</h1>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-[#e8e5e0] text-sm text-[#6b6b6b] rounded-xl hover:bg-[#f0ede8]">Save Draft</button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#7a9b7e] text-white text-sm font-medium rounded-xl hover:bg-[#6b8c6f]"><Save className="w-4 h-4" /> Publish</button>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Metadata */}
        <div className="bg-white rounded-2xl border border-[#e8e5e0] p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Lesson title"
              className="col-span-3 sm:col-span-1 px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm outline-none focus:ring-2 focus:ring-[#7a9b7e]" />
            <select value={language} onChange={e => setLanguage(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm outline-none focus:ring-2 focus:ring-[#7a9b7e]">
              <option>English</option><option>Tamil</option>
            </select>
            <select value={level} onChange={e => setLevel(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm outline-none focus:ring-2 focus:ring-[#7a9b7e]">
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
        </div>

        {/* Content blocks */}
        <div className="space-y-3 mb-6">
          {blocks.map(block => {
            const Icon = BLOCK_ICONS[block.type];
            return (
              <div key={block.id} className="flex gap-3 items-start bg-white rounded-2xl border border-[#e8e5e0] p-4">
                <div className="flex flex-col items-center gap-2 pt-1">
                  <GripVertical className="w-4 h-4 text-[#d0d0d0] cursor-grab" />
                  <div className="w-8 h-8 rounded-lg bg-[#f0f4f0] flex items-center justify-center"><Icon className="w-4 h-4 text-[#7a9b7e]" /></div>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-[#8a8a8a] uppercase mb-1">{block.type} Block</p>
                  {block.type === 'text' ? (
                    <textarea value={block.content} onChange={e => updateBlock(block.id, e.target.value)}
                      rows={3} placeholder="Enter lesson content..." className="w-full px-3 py-2 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm outline-none focus:ring-2 focus:ring-[#7a9b7e] resize-y" />
                  ) : block.type === 'quiz' ? (
                    <input type="text" value={block.content} onChange={e => updateBlock(block.id, e.target.value)}
                      placeholder="Enter quiz question..." className="w-full px-3 py-2 rounded-xl border border-[#e8e5e0] bg-[#faf9f7] text-sm outline-none focus:ring-2 focus:ring-[#7a9b7e]" />
                  ) : (
                    <div className="border-2 border-dashed border-[#e8e5e0] rounded-xl p-6 text-center text-sm text-[#8a8a8a]">
                      <p>Drop or click to upload {block.type} file</p>
                    </div>
                  )}
                </div>
                <button onClick={() => removeBlock(block.id)} className="p-1.5 text-[#d0d0d0] hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            );
          })}
        </div>

        {/* Add block buttons */}
        <div className="flex gap-2">
          {(['text', 'image', 'audio', 'quiz'] as const).map(type => {
            const Icon = BLOCK_ICONS[type];
            return (
              <button key={type} onClick={() => addBlock(type)} className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e8e5e0] text-xs text-[#6b6b6b] rounded-xl hover:bg-[#f0ede8]">
                <Icon className="w-3.5 h-3.5" /> {type}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
