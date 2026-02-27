/**
 * ADHD FOCUS MODE LESSON VIEWER
 * 
 * Distraction-free learning interface for ADHD users:
 * - One sentence at a time
 * - Large, clear typography
 * - Minimal UI (no sidebars)
 * - Timer with breaks (25min work, 5min break - Pomodoro)
 * - Progress dots instead of overwhelming bars
 * - Calm colors, no bright animations
 */

'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Clock, Coffee } from 'lucide-react';
import { TextToSpeech } from '@/components/TextToSpeech';

interface ADHDLessonStep {
    id: string;
    type: 'instruction' | 'content' | 'question' | 'break';
    text: string;
    options?: string[];
    correctAnswer?: number;
}

interface ADHDLessonProps {
    lessonId: string;
    steps: ADHDLessonStep[];
    onComplete: (score: number) => void;
}

export function ADHDLesson({ lessonId, steps, onComplete }: ADHDLessonProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timer, setTimer] = useState(25 * 60); // 25 minutes in seconds
    const [isBreak, setIsBreak] = useState(false);
    const [showBreakReminder, setShowBreakReminder] = useState(false);

    // Pomodoro Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    // Timer finished
                    if (!isBreak) {
                        setShowBreakReminder(true);
                    } else {
                        setIsBreak(false);
                        return 25 * 60; // Reset to work time
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isBreak]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const takeBreak = () => {
        setIsBreak(true);
        setTimer(5 * 60); // 5 minute break
        setShowBreakReminder(false);
    };

    const skipBreak = () => {
        setTimer(25 * 60); // Reset work timer
        setShowBreakReminder(false);
    };

    const handleAnswer = (optionIndex: number) => {
        setAnswers({ ...answers, [currentStep]: optionIndex });
        // Auto-advance after selecting answer
        setTimeout(() => {
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                // Calculate score
                const correctCount = steps.filter((step, idx) =>
                    step.type === 'question' && answers[idx] === step.correctAnswer
                ).length;
                const totalQuestions = steps.filter(s => s.type === 'question').length;
                const score = Math.round((correctCount / totalQuestions) * 100);
                onComplete(score);
            }
        }, 500);
    };

    const currentStepData = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="min-h-screen bg-[#faf9f7] flex flex-col">
            {/* Minimal Header */}
            <header className="bg-white border-b border-[#e8e5e0] px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    {/* Timer */}
                    <div className="flex items-center gap-2 text-[#6b6b6b]">
                        <Clock className="w-4 h-4" aria-hidden="true" />
                        <span className="text-sm font-mono font-medium">
                            {formatTime(timer)}
                        </span>
                        {isBreak && (
                            <span className="text-xs bg-[#7a9b7e] text-white px-2 py-0.5 rounded-full">
                                Break Time
                            </span>
                        )}
                    </div>

                    {/* Progress Dots */}
                    <div className="flex items-center gap-1.5">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-colors ${idx < currentStep
                                        ? 'bg-[#7a9b7e]'
                                        : idx === currentStep
                                            ? 'bg-[#7a9b7e] ring-2 ring-[#7a9b7e]/30'
                                            : 'bg-[#e8e5e0]'
                                    }`}
                                aria-label={`Step ${idx + 1} of ${steps.length}`}
                            />
                        ))}
                    </div>

                    <div className="w-20" /> {/* Spacer for balance */}
                </div>
            </header>

            {/* Break Reminder Modal */}
            {showBreakReminder && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-[#f0f4f0] rounded-full flex items-center justify-center mb-4">
                                <Coffee className="w-8 h-8 text-[#7a9b7e]" aria-hidden="true" />
                            </div>
                            <h2 className="text-2xl font-bold text-[#2d2d2d] mb-2">
                                Time for a Break!
                            </h2>
                            <p className="text-[#6b6b6b] mb-6" style={{ lineHeight: '1.7' }}>
                                You've been focused for 25 minutes. Take a 5-minute break to stretch,
                                grab water, or rest your eyes.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={skipBreak}
                                    className="flex-1 px-4 py-2.5 border-2 border-[#e8e5e0] rounded-xl text-[#6b6b6b] hover:bg-[#f5f3ef] transition-colors font-medium"
                                >
                                    Skip Break
                                </button>
                                <button
                                    onClick={takeBreak}
                                    className="flex-1 px-4 py-2.5 bg-[#7a9b7e] text-white rounded-xl hover:bg-[#6b8c6f] transition-colors font-medium"
                                >
                                    Take Break
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content - One Sentence Focus */}
            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="max-w-2xl w-full">
                    {/* Step Content */}
                    <div className="bg-white rounded-2xl border-2 border-[#e8e5e0] p-12 shadow-sm">
                        {/* Step Type Badge */}
                        <div className="flex items-center justify-center mb-8">
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${currentStepData.type === 'question'
                                    ? 'bg-[#fff9e6] text-[#856404] border border-[#f0e4b8]'
                                    : currentStepData.type === 'instruction'
                                        ? 'bg-[#e8f5e9] text-[#2d5f31] border border-[#c8e6c9]'
                                        : 'bg-[#f5f3ef] text-[#6b6b6b] border border-[#e8e5e0]'
                                }`}>
                                {currentStepData.type.charAt(0).toUpperCase() + currentStepData.type.slice(1)}
                            </span>
                        </div>

                        {/* Main Text - Large & Clear */}
                        <div className="text-center mb-8">
                            <p
                                className="text-2xl leading-relaxed text-[#2d2d2d] font-medium"
                                style={{ lineHeight: '1.8' }}
                            >
                                {currentStepData.text}
                            </p>
                        </div>

                        {/* Text-to-Speech */}
                        <div className="flex justify-center mb-8">
                            <TextToSpeech text={currentStepData.text} />
                        </div>

                        {/* Question Options */}
                        {currentStepData.type === 'question' && currentStepData.options && (
                            <div className="space-y-3">
                                {currentStepData.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${answers[currentStep] === idx
                                                ? 'border-[#7a9b7e] bg-[#e8f5e9] ring-2 ring-[#7a9b7e]/30'
                                                : 'border-[#e8e5e0] hover:border-[#7a9b7e]/50 hover:bg-[#f5f3ef]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[currentStep] === idx
                                                    ? 'border-[#7a9b7e] bg-[#7a9b7e]'
                                                    : 'border-[#d4dcd5]'
                                                }`}>
                                                {answers[currentStep] === idx && (
                                                    <Check className="w-4 h-4 text-white" aria-hidden="true" />
                                                )}
                                            </div>
                                            <span className="text-lg text-[#2d2d2d]">{option}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8">
                        <button
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#e8e5e0] text-[#6b6b6b] hover:bg-[#f5f3ef] transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                        >
                            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                            Back
                        </button>

                        <div className="text-sm text-[#8a8a8a]">
                            Step {currentStep + 1} of {steps.length}
                        </div>

                        <button
                            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                            disabled={currentStep === steps.length - 1}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7a9b7e] text-white hover:bg-[#6b8c6f] transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
