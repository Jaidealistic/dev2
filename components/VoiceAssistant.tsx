'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import { Mic, Loader2, Sparkles } from 'lucide-react';

/**
 * VOICE ASSISTANT
 * - Always-on toggle (for hand-disability students)
 * - English + Tamil recognition mode
 * - Navigation, email auto-fill, 5s silence detection for spelling
 */

const NAV_ROUTES = [
    { en: ['dashboard', 'home', 'main page', 'take me home'], ta: ['டாஷ்போர்டு', 'முகப்பு'], path: '/learner/dashboard', label: 'Dashboard' },
    { en: ['lessons', 'lesson', 'course', 'study', 'learning', 'class'], ta: ['பாடம்', 'பாடங்கள்', 'படிப்பு'], path: '/learner/lessons', label: 'Lessons' },
    { en: ['writing', 'write', 'letter practice', 'writing practice'], ta: ['எழுத்து', 'எழுதுதல்'], path: '/learner/practice/writing', label: 'Writing Practice' },
    { en: ['pronunciation', 'pronunciation practice'], ta: ['உச்சரிப்பு'], path: '/learner/practice/pronunciation', label: 'Pronunciation' },
    { en: ['progress', 'stats', 'analytics', 'achievements', 'badges', 'my score'], ta: ['முன்னேற்றம்'], path: '/learner/progress', label: 'Progress' },
    { en: ['profile', 'about me', 'my account', 'my details'], ta: ['சுயவிவரம்'], path: '/learner/profile', label: 'Profile' },
    { en: ['settings', 'preferences', 'accessibility', 'options'], ta: ['அமைப்புகள்'], path: '/learner/settings', label: 'Settings' },
    { en: ['logout', 'log out', 'sign out', 'exit', 'bye'], ta: ['வெளியேறு'], path: '/logout', label: 'Logout' },
];

const PHONETIC_MAP: Record<string, string> = {
    'sea': 'c', 'see': 'c', 'tea': 't', 'tee': 't', 'eye': 'i', 'bee': 'b',
    'pea': 'p', 'pee': 'p', 'are': 'r', 'you': 'u', 'why': 'y', 'oh': 'o',
    'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
    'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
};

function buildEmail(str: string): string {
    // Apply phonetic map first
    let s = str.toLowerCase();
    Object.keys(PHONETIC_MAP).forEach(k => {
        s = s.replace(new RegExp(`\\b${k}\\b`, 'g'), PHONETIC_MAP[k]);
    });
    // Replace spoken separators
    s = s.replace(/\s+at\s+/gi, '@').replace(/\s+dot\s+/gi, '.');
    // Strip remaining spaces and trailing punctuation
    s = s.replace(/\s+/g, '').replace(/[.,!?]+$/, '');
    return s;
}

/** Try to fill the email input on the current page. Returns true if successful.
 *  Uses the native HTMLInputElement setter to bypass React's controlled-input override,
 *  so React's onChange handler fires correctly.
 */
function tryFillEmail(emailStr: string, speakFeedback: (t: string) => void, setLastAction: (a: string) => void): boolean {
    const normalized = emailStr.replace(/[.,!?\s]+$/, '').toLowerCase();
    if (!normalized.includes('@') || !normalized.includes('.')) return false;
    const el = document.querySelector('input[type="email"], input[name="email"]') as HTMLInputElement;
    if (!el) return false;

    // Use the native setter — bypasses React's override so React detects the change
    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
    if (nativeSetter) {
        nativeSetter.call(el, normalized);
    } else {
        el.value = normalized; // Fallback for non-standard browsers
    }

    // Fire both events so React's synthetic onChange and any native listeners catch it
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.focus();
    speakFeedback(`Email entered: ${normalized}`);
    setLastAction(`✓ ${normalized}`);
    return true;
}

export default function VoiceAssistant() {
    const { preferences } = useAccessibility();
    const router = useRouter();

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [lastAction, setLastAction] = useState<string | null>(null);
    const [awaitingInput, setAwaitingInput] = useState<string | null>(null);
    const [voiceLang, setVoiceLang] = useState<'en-US' | 'ta-IN'>('en-US');

    const awaitingInputRef = useRef<string | null>(null);
    const accumulatedTextRef = useRef('');
    const recognitionRef = useRef<any>(null);
    const isActiveRef = useRef(false);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const voiceLangRef = useRef<'en-US' | 'ta-IN'>('en-US');
    const cooldownRef = useRef(false);
    const isSpeakingRef = useRef(false);

    const enabled = preferences.enableSpeechRec;

    useEffect(() => { voiceLangRef.current = voiceLang; }, [voiceLang]);

    const speakFeedback = useCallback((text: string, lang = 'en-US') => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        isSpeakingRef.current = true;
        try { recognitionRef.current?.stop(); } catch { /* ok */ }
        u.onend = () => {
            isSpeakingRef.current = false;
            if (isActiveRef.current && recognitionRef.current) {
                try { recognitionRef.current.start(); } catch { /* already running */ }
            }
        };
        window.speechSynthesis.speak(u);
    }, []);

    const processCommand = useCallback((text: string, forceInputType?: string) => {
        if (cooldownRef.current) return false;

        const META = ['enter in', 'type in', 'small case', 'lower case', 'smallcase',
            'lowercase', 'capital', 'uppercase', 'into the', 'field', 'specifically'];
        let input = text.toLowerCase().trim();
        META.forEach(p => { input = input.replace(new RegExp(`\\b${p}\\b`, 'gi'), ''); });
        input = input.trim();

        if (!input || input.length < 2) return false;

        console.log('[VoiceAssistant]', input, forceInputType ?? '');
        setTranscript(text);

        // ── Helper: Translate feedback based on current language mode ──
        const getLocalizedFeedback = (enText: string): { text: string, lang: string } => {
            const isTamil = voiceLangRef.current === 'ta-IN';
            if (!isTamil) return { text: enText, lang: 'en-US' };

            // Simple translation map for Tamil mode
            const taMap: Record<string, string> = {
                'Tamil voice mode on.': 'தமிழ் குரல் முறை செயல்படுத்தப்பட்டது.',
                'English voice mode on.': 'ஆங்கில குரல் முறை செயல்படுத்தப்பட்டது.',
                'UI switched to Tamil.': 'தமிழ் மொழிக்கு மாற்றப்பட்டது.',
                'UI switched to English.': 'ஆங்கில மொழிக்கு மாற்றப்பட்டது.',
                'Say: go to lessons, dashboard, progress, profile, settings — or say your email directly.': 'நீங்கள் கூறலாம்: பாடங்கள், முகப்பு, முன்னேற்றம், கணக்கு, அமைப்புகள் — அல்லது உங்கள் மின்னஞ்சலை கூறலாம்.',
                "Spell your email character by character. I'll wait 5 seconds of silence before submitting.": "உங்கள் மின்னஞ்சலை ஒவ்வொரு எழுத்தாக கூறவும். நான் ஐந்து விநாடிகள் காத்திருப்பேன்.",
                'No email field found on this page.': 'இந்த பக்கத்தில் மின்னஞ்சல் பெட்டி இல்லை.',
                'Processing your spelling...': 'உங்கள் எழுத்துக்களை சரிபார்க்கிறேன்...',
            };

            // Dynamic translations
            if (enText.startsWith('Email entered:')) {
                return { text: `மின்னஞ்சல் பதிவு செய்யப்பட்டது: ${enText.replace('Email entered:', '').trim()}`, lang: 'ta-IN' };
            }
            if (enText.startsWith('Navigating to')) {
                const routeNameEn = enText.replace('Navigating to ', '').trim();
                const route = NAV_ROUTES.find(r => r.label === routeNameEn);
                const routeNameTa = route && route.ta && route.ta.length > 0 ? route.ta[0] : routeNameEn;
                return { text: `${routeNameTa} பக்கத்திற்கு செல்கிறேன்`, lang: 'ta-IN' };
            }
            if (enText.startsWith('Got it. Email entered as:')) {
                return { text: `மின்னஞ்சல் பதிவு செய்யப்பட்டது: ${enText.replace('Got it. Email entered as:', '').trim()}`, lang: 'ta-IN' };
            }
            if (enText.startsWith('Name set to')) {
                return { text: `பெயர் ${enText.replace('Name set to ', '').trim()} என அமைக்கப்பட்டது`, lang: 'ta-IN' };
            }

            return { text: taMap[enText] || enText, lang: 'ta-IN' };
        };

        const trySpeak = (enText: string) => {
            const { text, lang } = getLocalizedFeedback(enText);
            speakFeedback(text, lang);
        };

        const cooldown = () => {
            cooldownRef.current = true;
            setTimeout(() => { cooldownRef.current = false; }, 2000);
        };

        // ── Email spelling commit (from 5s silence timer) ──────────────
        if (forceInputType === 'email_spelling') {
            const emailStr = buildEmail(input);
            const ok = tryFillEmail(emailStr, (t) => trySpeak(t), setLastAction);
            if (!ok) {
                trySpeak('No email field found on this page.');
                setLastAction('No email field');
            }
            setAwaitingInput(null);
            awaitingInputRef.current = null;
            accumulatedTextRef.current = '';
            cooldown();
            return true;
        }

        // ── Voice lang switch ──────────────────────────────────────────
        if (input.includes('tamil mode') || input.includes('switch to tamil voice')) {
            setVoiceLang('ta-IN'); voiceLangRef.current = 'ta-IN';
            setLastAction('🎙 Tamil Mode');
            // Try translating immediately
            speakFeedback('தமிழ் குரல் முறை செயல்படுத்தப்பட்டது.', 'ta-IN');
            cooldown(); return true;
        }
        if (input.includes('english mode') || input.includes('switch to english voice')) {
            setVoiceLang('en-US'); voiceLangRef.current = 'en-US';
            setLastAction('🎙 English Mode');
            speakFeedback('English voice mode on.', 'en-US');
            cooldown(); return true;
        }

        // ── UI language switch ─────────────────────────────────────────
        if ((input.includes('switch to tamil') || input.includes('change to tamil')) && !input.includes('mode')) {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.trim() === 'த') as HTMLButtonElement;
            btn?.click();
            trySpeak('UI switched to Tamil.'); setLastAction('UI → Tamil');
            cooldown(); return true;
        }
        if (input.includes('switch to english') || input.includes('change to english')) {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.trim() === 'EN') as HTMLButtonElement;
            btn?.click();
            trySpeak('UI switched to English.'); setLastAction('UI → English');
            cooldown(); return true;
        }

        // ── Help ───────────────────────────────────────────────────────
        if (input.includes('help') || input.includes('what can i say') || input.includes('உதவி')) {
            trySpeak("Say: go to lessons, dashboard, progress, profile, settings — or say your email directly.");
            setLastAction('📖 Help'); cooldown(); return true;
        }

        // ── Navigation ─────────────────────────────────────────────────
        for (const route of NAV_ROUTES) {
            const allKw = [...route.en, ...route.ta];
            if (allKw.some(kw => input.includes(kw.toLowerCase()))) {
                trySpeak(`Navigating to ${route.label}`);
                setLastAction(`→ ${route.label}`); cooldown();
                router.push(route.path);
                return true;
            }
        }

        // ── Direct email detection (user says email like "swas@gmail dot com") ──
        const builtEmail = buildEmail(input);
        if (builtEmail.includes('@') && builtEmail.includes('.') && builtEmail.length > 5) {
            if (tryFillEmail(builtEmail, (t) => trySpeak(t), setLastAction)) {
                cooldown(); return true;
            }
        }

        // ── Email keyword flow ─────────────────────────────────────────
        if (input.includes('email') || input.includes('மின்னஞ்சல்')) {
            const afterKw = input.split(/\bemail\b|\baddress\b|\bமின்னஞ்சல்\b/).pop()?.trim() || '';
            const emailStr = buildEmail(afterKw);
            if (tryFillEmail(emailStr, (t) => trySpeak(t), setLastAction)) {
                cooldown(); return true;
            }
            trySpeak("Spell your email character by character. I'll wait 5 seconds of silence before submitting.");
            setAwaitingInput('email_spelling');
            awaitingInputRef.current = 'email_spelling';
            setLastAction('✏ Spell email...');
            accumulatedTextRef.current = '';
            cooldown(); return true;
        }

        // ── Name Input ─────────────────────────────────────────────────
        if (input.includes('my name is') || input.includes('name is') || input.includes('பெயர்')) {
            const name = input.split(/\bname is\b|பெயர்/).pop()?.trim();
            if (name) {
                const el = document.querySelector('input[name="name"], input[name="firstName"], input[placeholder*="Name" i]') as HTMLInputElement;
                if (el) {
                    el.value = name;
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                    trySpeak(`Name set to ${name}`); setLastAction(`✓ Name: ${name}`);
                    cooldown(); return true;
                }
            }
        }

        // ── No feedback on unrecognized (silent fail prevents TTS loops) ──
        return false;
    }, [router, speakFeedback]);

    const startListening = useCallback(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Speech recognition not supported in this browser.');
            return;
        }
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SR();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = voiceLangRef.current;

        recognition.onstart = () => { setIsListening(true); isActiveRef.current = true; setTranscript('Listening...'); };

        recognition.onresult = (event: any) => {
            if (isSpeakingRef.current) return; // Ignore while TTS speaks
            let finalText = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
            }
            if (!finalText.trim()) return;

            if (awaitingInputRef.current) {
                accumulatedTextRef.current = (accumulatedTextRef.current + ' ' + finalText).trim();
                setTranscript(`Spelling: ${accumulatedTextRef.current}`);
                setLastAction('✏ Accumulating...');
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = setTimeout(() => {
                    const isTamil = voiceLangRef.current === 'ta-IN';
                    speakFeedback(isTamil ? 'உங்கள் எழுத்துக்களை சரிபார்க்கிறேன்...' : 'Processing your spelling...', isTamil ? 'ta-IN' : 'en-US');
                    processCommand(accumulatedTextRef.current, awaitingInputRef.current as string);
                }, 5000);
            } else {
                processCommand(finalText);
            }
        };

        recognition.onerror = (event: any) => {
            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please allow microphone in browser settings.');
                isActiveRef.current = false; setIsListening(false);
            }
            // Ignore no-speech, network errors — normal for continuous listening
        };

        recognition.onend = () => {
            if (isActiveRef.current && enabled && !isSpeakingRef.current) {
                recognition.lang = voiceLangRef.current;
                try { recognition.start(); } catch { setIsListening(false); }
            } else if (!isActiveRef.current) {
                setIsListening(false);
            }
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [processCommand, enabled, speakFeedback]);

    const stopListening = useCallback(() => {
        isActiveRef.current = false;
        try { recognitionRef.current?.stop(); } catch { /* ok */ }
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        window.speechSynthesis?.cancel();
        isSpeakingRef.current = false;
        setIsListening(false); setAwaitingInput(null);
        setTranscript(''); setLastAction(null);
        accumulatedTextRef.current = '';
    }, []);

    useEffect(() => {
        return () => {
            isActiveRef.current = false;
            try { recognitionRef.current?.stop(); } catch { /* ok */ }
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, []);

    if (!enabled) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100000] flex flex-col items-end gap-3">
            {isListening && (
                <div className="bg-white/95 backdrop-blur-md border border-[#7a9b7e]/30 p-4 rounded-2xl shadow-2xl max-w-[280px] animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-[#7a9b7e] animate-pulse" />
                            <span className="text-xs font-semibold text-[#7a9b7e] uppercase tracking-wider">Voice Assistant</span>
                        </div>
                        <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity
                                ${voiceLang === 'ta-IN' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}
                            title="Click to toggle Tamil/English recognition"
                            onClick={() => {
                                const next = voiceLang === 'en-US' ? 'ta-IN' : 'en-US';
                                setVoiceLang(next); voiceLangRef.current = next;
                                setLastAction(next === 'ta-IN' ? '🎙 Tamil Mode' : '🎙 English Mode');
                            }}>
                            {voiceLang === 'ta-IN' ? 'TA' : 'EN'}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-[#2d2d2d] leading-relaxed min-h-[20px] break-words">
                        {transcript || 'Say a command...'}
                    </p>
                    {lastAction && (
                        <div className={`mt-2 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1.5
                            ${awaitingInput ? 'text-amber-600 bg-amber-50 ring-1 ring-amber-200' : 'text-[#5a8c5c] bg-[#5a8c5c]/10'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${awaitingInput ? 'bg-amber-500 animate-pulse' : 'bg-[#5a8c5c] animate-ping'}`} />
                            <span className="truncate">{lastAction}</span>
                            {awaitingInput && <span className="ml-auto text-[10px] text-amber-500/70 font-normal whitespace-nowrap">5s → submit</span>}
                        </div>
                    )}
                </div>
            )}

            <button
                onClick={isListening ? stopListening : startListening}
                className={`group relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform active:scale-95
                    ${isListening ? 'bg-[#7a9b7e] text-white ring-4 ring-[#7a9b7e]/30' : 'bg-white text-[#6b6b6b] hover:bg-gray-50 border border-gray-200'}`}
                aria-label={isListening ? 'Stop voice assistant' : 'Start voice assistant'}
                title="Voice Assistant — say 'help' for commands"
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
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>
                )}
            </button>
        </div>
    );
}
