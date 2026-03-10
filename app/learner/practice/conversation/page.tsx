/**
 * CONVERSATIONAL AI TUTOR PAGE
 * 
 * Allows learners to practice real-life dialogue scenarios 
 * with spoken AI interaction.
 */

'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AITutorDialogue } from '@/components/AITutorDialogue';
import { AccessibilityToolbar } from '@/components/AccessibilityToolbar';
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/ui/Logo';

export default function ConversationPracticePage() {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if the browser supports Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Header */}
      <header role="banner" className="bg-white border-b border-[#e8e5e0] fixed top-0 left-0 w-full z-50">
        <div className="w-full pl-6 pr-10 py-4 flex justify-between items-center gap-4">
          <Link href="/" aria-label="LexFix home" className="flex-shrink-0">
            <Logo />
          </Link>
          <nav role="navigation" aria-label="Main navigation" className="flex items-center flex-1 justify-center gap-1 md:gap-2">
            {[
              { href: '/learner/dashboard', key: 'dashboard', active: false },
              { href: '/learner/lessons', key: 'lessons', active: false },
              { href: '/learner/practice/writing', key: 'practice', active: false },
              { href: '/learner/progress', key: 'progress', active: false },
              { href: '/learner/profile', key: 'profile', active: false },
              { href: '/learner/settings', key: 'settings', active: false },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-[#6b6b6b] hover:bg-[#f5f3ef] hover:text-[#2d2d2d]"
              >
                 {item.key}
              </Link>
            ))}
            <div className="w-px h-5 bg-[#e8e5e0] hidden sm:block" />
            <ThemeToggle />
            <div className="w-px h-5 bg-[#e8e5e0] hidden sm:block" />
            <Link href="/logout" className="px-3 py-2 rounded-lg text-sm text-[#8a8a8a] hover:text-[#c27171] hover:bg-red-50/50 flex-shrink-0 whitespace-nowrap">
              Sign out
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8" role="main">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/learner/dashboard" className="p-2 rounded-full hover:bg-white text-gray-600 hover:text-gray-900 transition-colors shadow-sm bg-white/50" aria-label="Back to dashboard">
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-[#9db4a0]" aria-hidden="true" />
              Conversation Practice
            </h1>
            <p className="text-gray-600 mt-1">Practice back-and-forth dialogue with your friendly AI Tutor.</p>
          </div>
        </div>

        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-8 max-w-3xl mx-auto shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h2 className="font-bold text-yellow-900 mb-1">Feature Not Supported</h2>
                <p className="text-yellow-800">
                  Your browser doesn&apos;t support the speech features required for conversation practice. Please try using Google Chrome, Safari, or Microsoft Edge.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pb-20">
          <AITutorDialogue />
        </div>
      </main>

      <AccessibilityToolbar />
    </div>
  );
}
