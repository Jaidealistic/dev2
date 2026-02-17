/**
 * SPEECH RECOGNITION COMPONENT
 * 
 * Voice input for dysgraphia and accessibility support
 * Uses Web Speech API (offline, no API costs)
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface SpeechRecognitionProps {
    onTranscript: (text: string) => void;
    language?: 'en-US' | 'ta-IN';
    placeholder?: string;
    className?: string;
}

// TypeScript types for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

export function SpeechRecognition({
    onTranscript,
    language = 'en-US',
    placeholder = 'Click the microphone and speak...',
    className = ''
}: SpeechRecognitionProps) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(true);
    const [interimTranscript, setInterimTranscript] = useState('');

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check browser support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            console.warn('Speech Recognition not supported in this browser');
            return;
        }

        // Initialize recognition
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const transcriptText = result[0].transcript;

                if (result.isFinal) {
                    final += transcriptText + ' ';
                } else {
                    interim += transcriptText;
                }
            }

            if (final) {
                const newTranscript = transcript + final;
                setTranscript(newTranscript);
                onTranscript(newTranscript);
            }

            setInterimTranscript(interim);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [language]);

    const startListening = () => {
        if (!isSupported || !recognitionRef.current) return;

        try {
            recognitionRef.current.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
        }
    };

    const stopListening = () => {
        if (!isSupported || !recognitionRef.current) return;

        try {
            recognitionRef.current.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    };

    const clearTranscript = () => {
        setTranscript('');
        setInterimTranscript('');
        onTranscript('');
    };

    if (!isSupported) {
        return (
            <div className={`text-sm text-gray-500 italic ${className}`}>
                Voice input not available in this browser. Please type instead.
            </div>
        );
    }

    return (
        <div className={className}>
            {/* Input Display */}
            <div className="relative">
                <textarea
                    value={transcript + interimTranscript}
                    onChange={(e) => {
                        setTranscript(e.target.value);
                        onTranscript(e.target.value);
                    }}
                    placeholder={placeholder}
                    className="w-full min-h-[120px] p-4 pr-32 border-2 border-[#e8e5e0] rounded-xl focus:border-[#7a9b7e] focus:ring-2 focus:ring-[#7a9b7e]/20 focus:outline-none resize-none text-[#2d2d2d]"
                    style={{ lineHeight: '1.7' }}
                />

                {/* Microphone Button */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                    {transcript && (
                        <button
                            onClick={clearTranscript}
                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                            Clear
                        </button>
                    )}

                    <button
                        onClick={isListening ? stopListening : startListening}
                        className={`p-3 rounded-xl transition-all ${isListening
                                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                                : 'bg-[#7a9b7e] hover:bg-[#6b8c6f] text-white'
                            }`}
                        aria-label={isListening ? 'Stop recording' : 'Start recording'}
                        title={isListening ? 'Stop recording' : 'Click to speak'}
                    >
                        {isListening ? (
                            <MicOff className="w-5 h-5" />
                        ) : (
                            <Mic className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Listening Indicator */}
                {isListening && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm text-red-600 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="flex gap-0.5">
                            <div className="w-1 h-3 bg-red-600 animate-pulse" style={{ animationDelay: '0ms' }} />
                            <div className="w-1 h-3 bg-red-600 animate-pulse" style={{ animationDelay: '150ms' }} />
                            <div className="w-1 h-3 bg-red-600 animate-pulse" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="font-medium">Listening...</span>
                    </div>
                )}

                {/* Interim Text Indicator */}
                {interimTranscript && !isListening && (
                    <div className="absolute bottom-4 left-4 text-xs text-gray-500 italic">
                        Processing...
                    </div>
                )}
            </div>

            {/* Helper Text */}
            <p className="mt-2 text-xs text-gray-500">
                <Volume2 className="w-3 h-3 inline mr-1" />
                You can type or click the microphone to speak. Your voice will be converted to text.
            </p>
        </div>
    );
}

// Simpler inline version for quick voice input
export function InlineSpeechRecognition({
    onTranscript,
    buttonText = 'Voice Input',
    className = ''
}: {
    onTranscript: (text: string);
    buttonText?: string;
    className?: string;
}) {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = event.results[0][0].transcript;
            onTranscript(transcript);
        };

        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, []);

    const toggle = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <button
            onClick={toggle}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-[#f0f4f0] text-[#7a9b7e] hover:bg-[#e8f5e9]'
                } ${className}`}
        >
            <Mic className="w-3.5 h-3.5" />
            {isListening ? 'Listening...' : buttonText}
        </button>
    );
}
