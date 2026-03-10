'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react';

/**
 * VOICE ASSISTANT COMPONENT
 * 
 * Provides voice-controlled navigation and automated form filling.
 * - "Go to [page]" -> Navigate
 * - "My email is [value]" -> Fill email field
 * - "My name is [value]" -> Fill name field
 */

export default function VoiceAssistant() {
    const { preferences } = useAccessibility();
    const router = useRouter();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [lastAction, setLastAction] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const enabled = preferences.enableSpeechRec;

    const processCommand = useCallback((text: string) => {
        const input = text.toLowerCase().trim();
        setTranscript(text);

        // 1. Navigation Commands
        // General Route Keywords
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
            if (keywords.some(kw => input.includes(kw))) {
                setLastAction(`Navigating to ${label}`);
                router.push(route);
                return true;
            }
        }

        // 2. Utility Commands
        if (input.includes('scroll down') || input.includes('go down')) {
            window.scrollBy({ top: 400, behavior: 'smooth' });
            setLastAction('Scrolling down');
            return true;
        }
        if (input.includes('scroll up') || input.includes('go up')) {
            window.scrollBy({ top: -400, behavior: 'smooth' });
            setLastAction('Scrolling up');
            return true;
        }
        if (input.includes('go back') || input === 'back') {
            setLastAction('Going back');
            router.back();
            return true;
        }

        // 3. Input Filling Commands
        if (input.includes('my email is') || input.includes('email is')) {
            const email = input.split('is').pop()?.trim();
            if (email) {
                const emailInput = document.querySelector('input[type="email"], input[name="email"]') as HTMLInputElement;
                if (emailInput) {
                    emailInput.value = email;
                    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                    setLastAction(`Filled email: ${email}`);
                    return true;
                }
            }
        }

        if (input.includes('my name is') || input.includes('name is')) {
            const name = input.split('is').pop()?.trim();
            if (name) {
                const nameInput = document.querySelector('input[name="name"], input[name="firstName"], input[placeholder*="Name"]') as HTMLInputElement;
                if (nameInput) {
                    nameInput.value = name;
                    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                    setLastAction(`Filled name: ${name}`);
                    return true;
                }
            }
        }

        // 4. Action Commands
        if (input.includes('focus mode')) {
            const current = (preferences as any).focusMode;
            (updatePreference as any)('focusMode', !current);
            setLastAction(`${!current ? 'Enabling' : 'Disabling'} Focus Mode`);
            return true;
        }

        if (input.includes('continue') || input.includes('next') || input.includes('finish')) {
            const nextButton = Array.from(document.querySelectorAll('button')).find(b => {
                const text = b.innerText.toLowerCase();
                return text.includes('next') || text.includes('continue') || text.includes('finish');
            });
            if (nextButton) {
                setLastAction('Clicking Next/Continue');
                (nextButton as HTMLElement).click();
                return true;
            }
        }

        if (input.includes('analyze') || input.includes('recognition')) {
            const analyzeBtn = Array.from(document.querySelectorAll('button')).find(b => {
                const text = b.innerText.toLowerCase();
                return text.includes('analyze') || text.includes('handwriting');
            });
            if (analyzeBtn) {
                setLastAction('Triggering Analysis');
                (analyzeBtn as HTMLElement).click();
                return true;
            }
        }

        if (input.includes('tamil') || input.includes('english')) {
            const lang = input.includes('tamil') ? 'tamil' : 'english';
            const langBtn = Array.from(document.querySelectorAll('button')).find(b => {
                const text = b.innerText.toLowerCase();
                return text.includes(lang);
            });
            if (langBtn) {
                setLastAction(`Switching to ${lang}`);
                (langBtn as HTMLElement).click();
                return true;
            }
        }

        return false;
    }, [router]);

    const startListening = useCallback(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Speech recognition is not supported in this browser.');
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('Listening...');
            setLastAction(null);
        };

        recognition.onresult = (event: any) => {
            const result = event.results[event.results.length - 1];
            const text = result[0].transcript;
            setTranscript(text);

            if (result.isFinal) {
                const handled = processCommand(text);
                if (handled) {
                    setTimeout(() => setIsListening(false), 1500);
                }
            }
        };

        recognition.onerror = (event: any) => {
            if (event.error === 'no-speech' || event.error === 'aborted') {
                // Handle timeout or manual abort silently
                setIsListening(false);
                return;
            }
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        try {
            console.log('VoiceAssistant: Starting Web Speech API...');
            recognition.start();
        } catch (err) {
            console.error('VoiceAssistant: Failed to start recognition:', err);
            setIsListening(false);
            alert('Could not start voice assistant. Please check microphone permissions.');
        }
    }, [processCommand]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    if (!enabled) return null;

    return (
        <div className="fixed bottom-6 right-24 z-[100000] flex flex-col items-end gap-3">
            {isListening && (
                <div className="bg-white/90 backdrop-blur-md border border-[#7a9b7e]/30 p-4 rounded-2xl shadow-2xl max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#7a9b7e] animate-pulse" />
                        <span className="text-xs font-semibold text-[#7a9b7e] uppercase tracking-wider">Voice Assistant</span>
                    </div>
                    <p className="text-sm font-medium text-[#2d2d2d] leading-relaxed">
                        {transcript || 'How can I help you?'}
                    </p>
                    {lastAction && (
                        <div className="mt-2 text-xs font-bold text-[#5a8c5c] bg-[#5a8c5c]/10 px-2 py-1 rounded-md flex items-center gap-1.5 animate-in zoom-in-95">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#5a8c5c] animate-ping" />
                            {lastAction}
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={isListening ? stopListening : startListening}
                className={`group relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform active:scale-95 ${isListening
                    ? 'bg-[#7a9b7e] text-white ring-4 ring-[#7a9b7e]/20'
                    : 'bg-white text-[#6b6b6b] hover:bg-gray-50 border border-gray-200'
                    }`}
                aria-label={isListening ? 'Stop listening' : 'Start voice navigation'}
                title="Voice Navigation (e.g., 'Go to sign in' or 'My email is...')"
            >
                {isListening ? (
                    <div className="relative">
                        <Loader2 className="w-7 h-7 animate-spin opacity-20" />
                        <Mic className="w-6 h-6 absolute inset-0 m-auto" />
                    </div>
                ) : (
                    <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
                )}

                {isListening && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </button>
        </div>
    );
}
