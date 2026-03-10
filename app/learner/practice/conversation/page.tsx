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
      <header role="banner" className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#7a9b7e]" />
              <span>LexFix</span>
            </div>
          </Link>
          <nav role="navigation" aria-label="Main navigation" className="flex gap-6">
            <Link href="/learner/dashboard" className="text-gray-700 hover:text-[#7a9b7e] font-medium transition-colors">Dashboard</Link>
            <Link href="/learner/lessons" className="text-gray-700 hover:text-[#7a9b7e] font-medium transition-colors">My Lessons</Link>
            <Link href="/learner/progress" className="text-gray-700 hover:text-[#7a9b7e] font-medium transition-colors">Progress</Link>
            <Link href="/learner/settings" className="text-gray-700 hover:text-[#7a9b7e] font-medium transition-colors">Settings</Link>
            <ThemeToggle />
              <div className="w-px h-5 bg-[#e8e5e0] mx-2" />
              <Link href="/logout" className="text-gray-700 hover:text-red-500 font-medium transition-colors">Logout</Link>
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
