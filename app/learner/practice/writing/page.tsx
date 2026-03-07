'use client';

/**
 * WRITE PRACTICE PAGE
 *
 * Lets learners practice writing in English or Tamil.
 * Fetches word lists and renders the WritePractice component.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WritePractice, { WritePracticeWord } from '@/components/WritePractice';
import { ArrowLeft, Globe } from 'lucide-react';

const EN_WORDS: WritePracticeWord[] = [
  { id: 'w1', target: 'Hello', translation: 'வணக்கம்', hint: 'A common greeting' },
  { id: 'w2', target: 'Thank you', translation: 'நன்றி', hint: 'Showing gratitude' },
  { id: 'w3', target: 'Good morning', translation: 'காலை வணக்கம்', hint: 'Morning greeting' },
  { id: 'w4', target: 'Please', translation: 'தயவுசெய்து', hint: 'Polite request' },
  { id: 'w5', target: 'Sorry', translation: 'மன்னிக்கவும்', hint: 'Apology' },
  { id: 'w6', target: 'Friend', translation: 'நண்பன்', hint: 'Someone you like' },
  { id: 'w7', target: 'Family', translation: 'குடும்பம்', hint: 'Parents and children' },
  { id: 'w8', target: 'School', translation: 'பள்ளி', hint: 'Where you learn' },
  { id: 'w9', target: 'Beautiful', translation: 'அழகான', hint: 'Very pretty' },
  { id: 'w10', target: 'Happy', translation: 'மகிழ்ச்சி', hint: 'Feeling joyful' },
];

const TA_WORDS: WritePracticeWord[] = [
  { id: 't1', target: 'வணக்கம்', translation: 'Hello', hint: 'Common Tamil greeting' },
  { id: 't2', target: 'நன்றி', translation: 'Thank you', hint: 'Expressing thanks' },
  { id: 't3', target: 'அம்மா', translation: 'Mother', hint: 'Your parent' },
  { id: 't4', target: 'அப்பா', translation: 'Father', hint: 'Your parent' },
  { id: 't5', target: 'நண்பன்', translation: 'Friend', hint: 'Companion' },
  { id: 't6', target: 'பள்ளி', translation: 'School', hint: 'Place of learning' },
  { id: 't7', target: 'குடும்பம்', translation: 'Family', hint: 'Your relatives' },
  { id: 't8', target: 'தண்ணீர்', translation: 'Water', hint: 'You drink this' },
  { id: 't9', target: 'உணவு', translation: 'Food', hint: 'You eat this' },
  { id: 't10', target: 'புத்தகம்', translation: 'Book', hint: 'You read this' },
];

export default function WritingPracticePage() {
  const router = useRouter();
  const [language, setLanguage] = useState<'en' | 'ta'>('en');
  const [completed, setCompleted] = useState(false);
  const words = language === 'ta' ? TA_WORDS : EN_WORDS;

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-[#6b6b6b] hover:text-[#2d2d2d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-base font-semibold text-[#2d2d2d]">Writing Practice</h1>
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Language toggle */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Globe className="w-4 h-4 text-[#8a8a8a]" />
          <button
            onClick={() => { setLanguage('en'); setCompleted(false); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              language === 'en'
                ? 'bg-[#7a9b7e] text-white'
                : 'bg-[#f0ede8] text-[#6b6b6b] hover:bg-[#e8e5e0]'
            }`}
          >
            English
          </button>
          <button
            onClick={() => { setLanguage('ta'); setCompleted(false); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              language === 'ta'
                ? 'bg-[#7a9b7e] text-white'
                : 'bg-[#f0ede8] text-[#6b6b6b] hover:bg-[#e8e5e0]'
            }`}
          >
            தமிழ் (Tamil)
          </button>
        </div>

        <WritePractice
          key={language}
          words={words}
          language={language}
          onComplete={(r) => setCompleted(true)}
        />
      </div>
    </div>
  );
}
