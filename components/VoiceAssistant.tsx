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
        if (input.includes('go to') || input.includes('open')) {
            if (input.includes('login') || input.includes('sign in')) {
                setLastAction('Navigating to Login');
                router.push('/login');
                return true;
            }
            if (input.includes('signup') || input.includes('sign up') || input.includes('register')) {
                setLastAction('Navigating to Signup');
                router.push('/signup');
                return true;
            }
            if (input.includes('dashboard')) {
                setLastAction('Navigating to Dashboard');
                router.push('/learner/dashboard');
                return true;
            }
            if (input.includes('settings')) {
                setLastAction('Navigating to Settings');
                router.push('/learner/settings');
                return true;
            }
            if (input.includes('student')) {
                setLastAction('Navigating to Students');
                router.push('/educator/students');
                return true;
            }
            if (input.includes('analytic') || input.includes('stat')) {
                setLastAction('Navigating to Analytics');
                router.push('/admin/analytics');
                return true;
            }
            if (input.includes('lesson')) {
                setLastAction('Navigating to Lessons');
                router.push('/learner/lessons');
                return true;
            }
        }

        // 2. Input Filling Commands
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
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
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
