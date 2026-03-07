'use client';

/**
 * VOICE NAVIGATOR — Global Voice Command System
 *
 * Provides hands-free navigation across all pages via spoken commands.
 * Uses the Web Speech API (same as SpeechRecognition.tsx).
 *
 * Supported commands:
 *   "go to dashboard"    → /learner/dashboard
 *   "go to lessons"      → /learner/lessons
 *   "go to progress"     → /learner/progress
 *   "go to settings"     → /learner/settings
 *   "go to practice"     → /learner/practice
 *   "go back"            → history.back()
 *   "next lesson"        → click first lesson link
 *   "scroll down / up"   → smooth scroll
 *   "stop listening"     → deactivate
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, X } from 'lucide-react';

/* ───────── Context ───────── */
interface VoiceNavContextValue {
  isListening: boolean;
  isSupported: boolean;
  isPermissionGranted: boolean;
  toggleListening: () => void;
  lastCommand: string;
}

const VoiceNavContext = createContext<VoiceNavContextValue>({
  isListening: false,
  isSupported: false,
  isPermissionGranted: false,
  toggleListening: () => {},
  lastCommand: '',
});

export const useVoiceNav = () => useContext(VoiceNavContext);


/* ───────── Provider ───────── */
export function VoiceNavigatorProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [lastCommand, setLastCommand] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef<any>(null);

  /* Check support on mount */
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      setIsSupported(true);
      const granted = localStorage.getItem('voiceNavPermission');
      if (granted === 'granted') {
        setIsPermissionGranted(true);
      } else if (granted !== 'denied') {
        setShowBanner(true);
      }
    }
  }, []);

  /* Interpret command — uses fuzzy/includes matching for real speech recognition */
  const handleCommand = useCallback((raw: string) => {
    const cmd = raw.toLowerCase().trim();
    setLastCommand(cmd);

    // Stop listening command (check first)
    if (cmd.includes('stop listening') || cmd.includes('stop voice') || cmd.includes('stop navigation')) {
      stopListening();
      return;
    }

    // Scroll commands
    if (cmd.includes('scroll down') || cmd.includes('go down')) {
      window.scrollBy({ top: 400, behavior: 'smooth' });
      setFeedback('Scrolling down');
      return;
    }
    if (cmd.includes('scroll up') || cmd.includes('go up')) {
      window.scrollBy({ top: -400, behavior: 'smooth' });
      setFeedback('Scrolling up');
      return;
    }

    // Back / forward
    if (cmd.includes('go back') || cmd === 'back') {
      setFeedback('Going back');
      router.back();
      return;
    }

    // Keyword-based navigation — order from most specific to least
    const KEYWORD_ROUTES: [string[], string, string][] = [
      [['writing', 'write practice', 'write'], '/learner/practice/writing', 'Writing Practice'],
      [['pronunciation', 'pronounce'], '/learner/practice/pronunciation', 'Pronunciation Practice'],
      [['practice'], '/learner/practice', 'Practice'],
      [['achievement', 'achievements', 'badges'], '/learner/achievements', 'Achievements'],
      [['profile', 'my profile'], '/learner/profile', 'Profile'],
      [['progress', 'my progress'], '/learner/progress', 'Progress'],
      [['lesson', 'lessons', 'my lessons'], '/learner/lessons', 'Lessons'],
      [['setting', 'settings', 'preferences'], '/learner/settings', 'Settings'],
      [['dashboard', 'home page', 'main page'], '/learner/dashboard', 'Dashboard'],
      [['collaboration', 'collab', 'chat room', 'room'], '/collaboration', 'Collaboration'],
      [['parent dashboard', 'parent'], '/parent/dashboard', 'Parent Dashboard'],
      [['educator', 'teacher'], '/educator/dashboard', 'Educator Dashboard'],
      [['admin'], '/admin/dashboard', 'Admin Dashboard'],
      [['log in', 'login', 'sign in'], '/login', 'Login'],
      [['sign up', 'signup', 'register'], '/signup', 'Sign Up'],
      [['home'], '/', 'Home'],
    ];

    for (const [keywords, route, label] of KEYWORD_ROUTES) {
      if (keywords.some(kw => cmd.includes(kw))) {
        setFeedback(`Navigating to ${label}`);
        router.push(route);
        return;
      }
    }

    setFeedback(`Heard: "${cmd}" — Try "go to dashboard" or "lessons"`);
  }, [router]);

  /* Start / stop recognition */
  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      if (last.isFinal) {
        handleCommand(last[0].transcript);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        console.error('Voice nav error:', event.error);
      }
    };

    recognition.onend = () => {
      // Auto-restart if still listening
      if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch { /* already started */ }
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
    setFeedback('Listening for commands…');
  }, [handleCommand]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setFeedback('');
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  /* Permission banner handlers */
  const grantPermission = () => {
    localStorage.setItem('voiceNavPermission', 'granted');
    setIsPermissionGranted(true);
    setShowBanner(false);
    startListening();
  };

  const denyPermission = () => {
    localStorage.setItem('voiceNavPermission', 'denied');
    setShowBanner(false);
  };

  /* Clear feedback after 3 s */
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(''), 3000);
    return () => clearTimeout(t);
  }, [feedback]);

  return (
    <VoiceNavContext.Provider value={{ isListening, isSupported, isPermissionGranted, toggleListening, lastCommand }}>
      {children}

      {/* Permission banner */}
      {showBanner && (
        <div
          role="dialog"
          aria-label="Voice navigation permission"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] bg-white border border-[#e8e5e0] rounded-2xl shadow-lg px-6 py-4 flex items-center gap-4 max-w-md w-[calc(100%-2rem)]"
        >
          <div className="w-10 h-10 rounded-full bg-[#f0f4f0] flex items-center justify-center shrink-0">
            <Mic className="w-5 h-5 text-[#5d7e61]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#2d2d2d]">Enable Voice Navigation?</p>
            <p className="text-xs text-[#6b6b6b] mt-0.5">
              Navigate the app hands-free using spoken commands like &quot;go to lessons&quot;.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={grantPermission}
              className="px-3 py-1.5 bg-[#7a9b7e] text-white text-xs font-medium rounded-lg hover:bg-[#6b8c6f] transition-colors"
            >
              Enable
            </button>
            <button
              onClick={denyPermission}
              className="p-1.5 text-[#8a8a8a] hover:text-[#2d2d2d] transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating mic + feedback toast */}
      <button
        onClick={() => {
          if (isPermissionGranted) {
            toggleListening();
          } else {
            setShowBanner(true);
          }
        }}
        aria-label={isListening ? 'Stop voice navigation' : 'Start voice navigation'}
        className={`fixed bottom-20 right-6 z-[9998] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
          isListening
            ? 'bg-[#10b981] text-white animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.5)]'
            : 'bg-white text-[#2d2d2d] border-2 border-[#e8e5e0] hover:bg-[#f5f3ef] hover:scale-105'
        }`}
      >
        {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-4 z-[9998] bg-[#2d2d2d] text-white text-xs px-4 py-2 rounded-lg shadow-lg max-w-[240px]"
        >
          {feedback}
        </div>
      )}
    </VoiceNavContext.Provider>
  );
}

export default VoiceNavigatorProvider;
