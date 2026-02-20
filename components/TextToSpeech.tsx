/**
 * TEXT-TO-SPEECH COMPONENT
 * 
 * Professional implementation using Web Speech API
 * - Offline (no API costs)
 * - Multiple languages (English, Tamil)
 * - Speed control (0.5x - 2x)
 * - Play/Pause/Stop controls
 * - Word highlighting sync
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Settings } from 'lucide-react';

interface TextToSpeechProps {
    text: string;
    language?: 'en-US' | 'ta-IN';
    autoHighlight?: boolean;
    onHighlight?: (index: number) => void;
    className?: string;
}

export function TextToSpeech({
    text,
    language = 'en-US',
    autoHighlight = false,
    onHighlight,
    className = ''
}: TextToSpeechProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const [showSettings, setShowSettings] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        // Check if browser supports Speech Synthesis
        if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
            setIsSupported(false);
            console.warn('Text-to-Speech not supported in this browser');
        }

        // Cleanup on unmount
        return () => {
            if (utteranceRef.current) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const speak = () => {
        if (!isSupported) return;

        // Cancel any existing speech
        window.speechSynthesis.cancel();

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = speed;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Event handlers
        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
            setIsPlaying(false);
            setIsPaused(false);
        };

        // Optional: Word boundary highlighting
        if (autoHighlight) {
            utterance.onboundary = (event) => {
                if (onHighlight) {
                    onHighlight(event.charIndex);
                }
            };
        }

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    };

    const pause = () => {
        if (!isSupported) return;
        window.speechSynthesis.pause();
        setIsPaused(true);
    };

    const resume = () => {
        if (!isSupported) return;
        window.speechSynthesis.resume();
        setIsPaused(false);
    };

    const stop = () => {
        if (!isSupported) return;
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
        if (isPlaying) {
            // Restart with new speed
            stop();
            setTimeout(speak, 100);
        }
    };

    if (!isSupported) {
        return (
            <div className={`text-xs text-gray-500 italic ${className}`}>
                Text-to-speech not available in this browser
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Main Controls */}
            <div className="flex items-center gap-1.5 bg-[#f5f3ef] rounded-lg p-1.5 border border-[#e8e5e0]">
                {!isPlaying ? (
                    <button
                        onClick={speak}
                        className="p-2 rounded-md hover:bg-[#7a9b7e] hover:text-white transition-colors text-[#7a9b7e]"
                        aria-label="Play text-to-speech"
                        title="Read aloud"
                    >
                        <Play className="w-4 h-4" fill="currentColor" />
                    </button>
                ) : isPaused ? (
                    <button
                        onClick={resume}
                        className="p-2 rounded-md hover:bg-[#7a9b7e] hover:text-white transition-colors text-[#7a9b7e]"
                        aria-label="Resume"
                        title="Resume"
                    >
                        <Play className="w-4 h-4" fill="currentColor" />
                    </button>
                ) : (
                    <button
                        onClick={pause}
                        className="p-2 rounded-md hover:bg-[#7a9b7e] hover:text-white transition-colors text-[#7a9b7e]"
                        aria-label="Pause"
                        title="Pause"
                    >
                        <Pause className="w-4 h-4" />
                    </button>
                )}

                {isPlaying && (
                    <button
                        onClick={stop}
                        className="p-2 rounded-md hover:bg-red-500 hover:text-white transition-colors text-red-600"
                        aria-label="Stop"
                        title="Stop"
                    >
                        <Square className="w-4 h-4" fill="currentColor" />
                    </button>
                )}

                {/* Settings Toggle */}
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-md transition-colors ${showSettings
                        ? 'bg-[#7a9b7e] text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    aria-label="Settings"
                    title="Speed settings"
                >
                    <Settings className="w-4 h-4" />
                </button>
            </div>

            {/* Speed Control (Expanded) */}
            {showSettings && (
                <div className="flex items-center gap-2 bg-white rounded-lg p-2 border border-[#e8e5e0] shadow-sm animate-in fade-in slide-in-from-left-2 duration-200">
                    <Volume2 className="w-3.5 h-3.5 text-gray-500" />
                    <label className="text-xs text-gray-600 font-medium whitespace-nowrap">
                        Speed:
                    </label>
                    <div className="flex gap-1">
                        {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                            <button
                                key={s}
                                onClick={() => handleSpeedChange(s)}
                                className={`px-2 py-1 text-xs rounded-md transition-colors ${speed === s
                                    ? 'bg-[#7a9b7e] text-white font-semibold'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                aria-label={`Speed ${s}x`}
                            >
                                {s}x
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Playing Indicator */}
            {isPlaying && !isPaused && (
                <div className="flex items-center gap-1.5 text-xs text-[#7a9b7e]">
                    <div className="flex gap-0.5">
                        <div className="w-0.5 h-3 bg-[#7a9b7e] animate-pulse" style={{ animationDelay: '0ms' }} />
                        <div className="w-0.5 h-3 bg-[#7a9b7e] animate-pulse" style={{ animationDelay: '150ms' }} />
                        <div className="w-0.5 h-3 bg-[#7a9b7e] animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="font-medium">Playing</span>
                </div>
            )}
        </div>
    );
}

// Export a simpler inline version for lesson content
export function InlineTextToSpeech({ text, className = '' }: { text: string; className?: string }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const speak = () => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    };

    return (
        <button
            onClick={isPlaying ? stop : speak}
            className={`inline-flex items-center gap-1 text-xs text-[#7a9b7e] hover:text-[#5d7e61] transition-colors ${className}`}
            aria-label={isPlaying ? 'Stop reading' : 'Read aloud'}
        >
            {isPlaying ? (
                <>
                    <Square className="w-3 h-3" fill="currentColor" />
                    <span>Stop</span>
                </>
            ) : (
                <>
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                </>
            )}
        </button>
    );
}
