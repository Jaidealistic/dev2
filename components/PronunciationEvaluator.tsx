/**
 * PRONUNCIATION EVALUATION COMPONENT
 * 
 * Helps learners practice pronunciation with real-time feedback
 * Compares spoken words with expected pronunciation
 */

'use client';

import { useState, useRef } from 'react';
import { Mic, Check, X, Volume2 } from 'lucide-react';

interface PronunciationEvaluatorProps {
    targetWord: string;
    targetLanguage?: 'en-US' | 'ta-IN';
    onScoreUpdate?: (score: number) => void;
    className?: string;
}

export function PronunciationEvaluator({
    targetWord,
    targetLanguage = 'en-US',
    onScoreUpdate,
    className = ''
}: PronunciationEvaluatorProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [spokenText, setSpokenText] = useState('');
    const [score, setScore] = useState<number | null>(null);
    const [feedback, setFeedback] = useState('');
    const [attempts, setAttempts] = useState(0);

    const recognitionRef = useRef<any>(null);

    const startRecording = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Speech recognition not supported in this browser');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = targetLanguage;
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsRecording(true);
            setSpokenText('');
            setScore(null);
            setFeedback('');
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            const confidence = event.results[0][0].confidence;

            setSpokenText(transcript);
            setAttempts(prev => prev + 1);

            const targetLower = targetWord.toLowerCase().trim();

            // ===== ULTRA-STRICT EXACT MATCHING =====

            // 1. EXACT MATCH - 100% score only
            if (transcript === targetLower) {
                setScore(100);
                setFeedback('🎉 PERFECT! Exact word match!');
                if (onScoreUpdate) onScoreUpdate(100);
                return;
            }

            // 2. Very close variations (articles, plurals) - 70-80%
            // Remove common articles and plurals for comparison
            const normalizeWord = (w: string) => {
                return w.replace(/^(a|an|the)\s+/i, '').replace(/s$/i, '');
            };

            const normalizedTranscript = normalizeWord(transcript);
            const normalizedTarget = normalizeWord(targetLower);

            if (normalizedTranscript === normalizedTarget) {
                setScore(75);
                setFeedback(`⚠️ Close! You said "${transcript}" but expected exactly "${targetWord}". Almost there!`);
                if (onScoreUpdate) onScoreUpdate(75);
                return;
            }

            // 3. Calculate strict Levenshtein similarity
            const distance = levenshteinDistance(transcript, targetLower);
            const maxLen = Math.max(transcript.length, targetLower.length);
            const similarity = (maxLen - distance) / maxLen;

            // 4. VERY STRICT THRESHOLDS
            let finalScore = 0;

            if (similarity >= 0.95) {
                // 95%+ similarity = minor typo (e.g., "helo" vs "hello")
                finalScore = Math.round(similarity * confidence * 85); // Cap at 85%
                setFeedback(`⚠️ Very close but not exact. You said "${transcript}" but we need "${targetWord}".`);
            } else if (similarity >= 0.85) {
                // 85%+ = similar word
                finalScore = Math.round(similarity * confidence * 60);
                setFeedback(`❌ Not quite. You said "${transcript}" but expected "${targetWord}". Try again!`);
            } else if (similarity >= 0.70) {
                // 70%+ = somewhat similar
                finalScore = Math.round(similarity * confidence * 40);
                setFeedback(`❌ Different word. You said "${transcript}" but we need "${targetWord}".`);
            } else {
                // < 70% = completely different
                finalScore = 0;
                setFeedback(`❌ Wrong word! You said "${transcript}" but expected "${targetWord}". Listen again!`);
            }

            // 5. Check for common confusions and apply heavy penalty
            const isConfusion = [
                ['hi', 'hello', 'hey'],
                ['good morning', 'morning', 'good'],
                ['bye', 'goodbye'],
                ['thanks', 'thank you']
            ].some(group =>
                group.includes(targetLower) &&
                group.includes(transcript) &&
                targetLower !== transcript
            );

            if (isConfusion) {
                finalScore = Math.min(finalScore, 20); // Max 20% for confused words
                setFeedback(`❌ Wrong! You said "${transcript}" but we need exactly "${targetWord}". They are different words!`);
            }

            setScore(finalScore);
            if (onScoreUpdate) onScoreUpdate(finalScore);
        };

        recognition.onerror = (event: any) => {
            console.error('Recognition error:', event.error);
            setIsRecording(false);
            setFeedback('Could not hear you. Please try again.');
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const playTargetAudio = () => {
        // Use text-to-speech to say the target word
        const utterance = new SpeechSynthesisUtterance(targetWord);
        utterance.lang = targetLanguage;
        utterance.rate = 0.8; // Slower for clarity
        window.speechSynthesis.speak(utterance);
    };

    // STRICT similarity calculation
    const calculateStrictSimilarity = (str1: string, str2: string): number => {
        // Normalize strings: remove extra spaces, punctuation
        const normalize = (s: string) => s.replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
        const s1 = normalize(str1);
        const s2 = normalize(str2);

        // Exact match after normalization
        if (s1 === s2) return 1.0;

        // If one is substring of other with very different lengths, low score
        const longerLen = Math.max(s1.length, s2.length);
        const shorterLen = Math.min(s1.length, s2.length);

        if (longerLen > shorterLen * 1.5) {
            // If one word is 50% longer, they're probably different words
            return 0.3;
        }

        // Calculate Levenshtein distance
        const distance = levenshteinDistance(s1, s2);
        const maxLen = longerLen;

        // Normalized similarity (0 to 1)
        const similarity = (maxLen - distance) / maxLen;

        // Apply stricter threshold
        // If similarity is below 0.7, reduce it further
        if (similarity < 0.7) {
            return similarity * 0.7; // Make it even lower
        }

        return similarity;
    };

    const levenshteinDistance = (str1: string, str2: string): number => {
        const matrix: number[][] = [];

        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[str2.length][str1.length];
    };

    return (
        <div className={`bg-white rounded-xl border-2 border-[#e8e5e0] p-6 ${className}`}>
            {/* Version Indicator - Remove after testing */}
            <div className="text-xs text-gray-400 text-right mb-2">v2.0 - Ultra Strict (Updated {new Date().toLocaleTimeString()})</div>

            {/* Target Word */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center gap-3 bg-[#f5f3ef] px-6 py-3 rounded-xl border-2 border-[#7a9b7e]">
                    <span className="text-3xl font-bold text-[#2d2d2d]">{targetWord}</span>
                    <button
                        onClick={playTargetAudio}
                        className="p-2 rounded-lg bg-[#7a9b7e] text-white hover:bg-[#6b8c6f] transition-colors"
                        aria-label="Listen to pronunciation"
                        title="Listen"
                    >
                        <Volume2 className="w-4 h-4" />
                    </button>
                </div>
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto">
                    <p className="text-xs text-yellow-800 font-medium">
                        ⚠️ <strong>Exact Match Required!</strong> Only saying exactly "{targetWord}" will give you 100%.
                        Similar words like "hi" instead of "hello" will score very low.
                    </p>
                </div>
            </div>

            {/* Record Button */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={startRecording}
                    disabled={isRecording}
                    className={`p-6 rounded-full transition-all ${isRecording
                        ? 'bg-red-500 animate-pulse cursor-not-allowed'
                        : 'bg-[#7a9b7e] hover:bg-[#6b8c6f] hover:scale-105'
                        } text-white shadow-lg`}
                    aria-label="Start pronunciation test"
                >
                    <Mic className="w-8 h-8" />
                </button>
            </div>

            {isRecording && (
                <div className="text-center text-red-600 font-medium mb-4 animate-pulse">
                    🎤 Listening...
                </div>
            )}

            {/* Results */}
            {score !== null && (
                <div className="space-y-4">
                    {/* Score Display with Strict Grading */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg ${score === 100 ? 'bg-green-100 text-green-700 ring-4 ring-green-300' :
                            score >= 75 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-300' :
                                score >= 50 ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                            }`}>
                            {score}
                        </div>
                        <div className="text-left">
                            <div className={`text-xl font-bold ${score === 100 ? 'text-green-700' :
                                score >= 75 ? 'text-yellow-700' :
                                    'text-red-700'
                                }`}>
                                {score === 100 ? 'PERFECT!' :
                                    score >= 75 ? 'Close' :
                                        score >= 50 ? 'Not Quite' :
                                            'Try Again'}
                            </div>
                            <div className="text-sm text-gray-600">
                                {score === 100 ? 'Exact match! 🎉' : 'Only exact matches get 100%'}
                            </div>
                        </div>
                    </div>

                    {/* What you said vs What we expected */}
                    <div className="bg-[#f5f3ef] rounded-lg p-4 border-l-4 border-[#7a9b7e]">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Expected:</div>
                                <div className="text-lg font-bold text-[#2d2d2d]">"{targetWord}"</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">You said:</div>
                                <div className={`text-lg font-bold ${score >= 95 ? 'text-green-700' : score >= 60 ? 'text-yellow-700' : 'text-red-700'
                                    }`}>
                                    "{spokenText}"
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                {score >= 95 ? (
                                    <Check className="w-5 h-5 text-green-600" />
                                ) : score >= 60 ? (
                                    <span className="text-yellow-600 text-xl">⚠️</span>
                                ) : (
                                    <X className="w-5 h-5 text-red-600" />
                                )}
                                <span className={`text-sm font-medium ${score >= 95 ? 'text-green-700' : score >= 60 ? 'text-yellow-700' : 'text-red-700'
                                    }`}>
                                    {score >= 100 ? 'Exact match! Perfect!' :
                                        score >= 95 ? 'Very close!' :
                                            score >= 60 ? 'Not exact - try to match word for word' :
                                                'Different word - listen to target again'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200">
                        <span>Attempts: {attempts}</span>
                        <button
                            onClick={startRecording}
                            className="text-[#7a9b7e] hover:underline font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
