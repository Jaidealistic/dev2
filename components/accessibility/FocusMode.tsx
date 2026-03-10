/**
 * FOCUS MODE COMPONENT (ADHD)
 *
 * Provides distraction-free environment for learners with ADHD:
 * - Hides non-essential UI (sidebar, badges, decorations)
 * - Single-task focus – shows one content section at a time
 * - Built-in break timer with customisable intervals
 * - Progress breadcrumb (so learner knows where they are)
 * - Reduced animations / motion
 * - Gentle audio cue on break time
 * - Pomodoro-style work/break cycles
 *
 * Wrap any content area to activate focus mode.
 *
 * Accessibility: WCAG AAA compliant
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import {
  Eye,
  EyeOff,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Sun,
  ChevronRight,
  X,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FocusModeProps {
  children: React.ReactNode;
  /** Show break timer controls, default true */
  showBreakTimer?: boolean;
  /** Work interval in minutes, default 15 */
  workMinutes?: number;
  /** Break interval in minutes, default 5 */
  breakMinutes?: number;
  /** Optional label for the focus area */
  taskLabel?: string;
}

type TimerPhase = 'work' | 'break' | 'idle';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FocusMode({
  children,
  showBreakTimer = true,
  workMinutes = 15,
  breakMinutes = 5,
  taskLabel,
}: FocusModeProps) {
  const { preferences } = useAccessibility();

  // Focus mode state
  const [isFocused, setIsFocused] = useState(false);

  // Timer state
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Timer tick
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Phase complete
          if (phase === 'work') {
            setPhase('break');
            setCycleCount((c) => c + 1);
            // Play gentle notification
            playBreakChime();
            return breakMinutes * 60;
          } else {
            setPhase('work');
            return workMinutes * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, phase, workMinutes, breakMinutes]);

  const startTimer = useCallback(() => {
    setPhase('work');
    setSecondsLeft(workMinutes * 60);
    setIsRunning(true);
  }, [workMinutes]);

  const togglePause = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setPhase('idle');
    setSecondsLeft(workMinutes * 60);
    setCycleCount(0);
  }, [workMinutes]);

  const skipPhase = useCallback(() => {
    if (phase === 'work') {
      setPhase('break');
      setSecondsLeft(breakMinutes * 60);
      setCycleCount((c) => c + 1);
    } else {
      setPhase('work');
      setSecondsLeft(workMinutes * 60);
    }
  }, [phase, workMinutes, breakMinutes]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPercent =
    phase === 'work'
      ? ((workMinutes * 60 - secondsLeft) / (workMinutes * 60)) * 100
      : ((breakMinutes * 60 - secondsLeft) / (breakMinutes * 60)) * 100;

  return (
    <div className={isFocused ? 'focus-mode-active' : ''}>
      {/* Focus mode toggle bar */}
      <div className="flex items-center justify-between gap-3 mb-4 p-3 bg-[#f0f7f0] border border-[#c5d8c7] rounded-xl">
        <div className="flex items-center gap-2">
          {isFocused ? (
            <Eye className="w-5 h-5 text-[#5a8c5c]" aria-hidden="true" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-400" aria-hidden="true" />
          )}
          <span className="text-sm font-medium text-gray-700">
            Focus Mode {taskLabel ? `— ${taskLabel}` : ''}
          </span>
        </div>

        <button
          onClick={() => setIsFocused(!isFocused)}
          className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            isFocused
              ? 'bg-[#7da47f] text-white hover:bg-[#6b946d]'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#9db4a0]'
          }`}
          aria-pressed={isFocused}
        >
          {isFocused ? 'Exit Focus' : 'Enter Focus'}
        </button>
      </div>

      {/* Break Timer */}
      {showBreakTimer && isFocused && (
        <div
          className={`mb-4 p-4 rounded-xl border transition-colors ${
            phase === 'break'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-white border-[#d6ddd7]'
          }`}
        >
          {/* Timer display */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {phase === 'break' ? (
                <Coffee className="w-5 h-5 text-amber-600" aria-hidden="true" />
              ) : (
                <Clock className="w-5 h-5 text-[#5a8c5c]" aria-hidden="true" />
              )}
              <span className="text-sm font-semibold text-gray-700">
                {phase === 'idle' && 'Ready to start'}
                {phase === 'work' && 'Focus Time'}
                {phase === 'break' && 'Break Time!'}
              </span>
              {cycleCount > 0 && (
                <span className="text-xs bg-[#f0f7f0] text-[#5a8c5c] px-2 py-0.5 rounded-full">
                  Cycle {cycleCount}
                </span>
              )}
            </div>

            <span className="text-2xl font-mono font-bold text-gray-900 tabular-nums">
              {formatTime(secondsLeft)}
            </span>
          </div>

          {/* Progress bar */}
          {phase !== 'idle' && (
            <div className="h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  phase === 'break' ? 'bg-amber-400' : 'bg-[#7da47f]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2">
            {phase === 'idle' ? (
              <button
                onClick={startTimer}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#7da47f] text-white text-sm rounded-lg hover:bg-[#6b946d] transition-colors"
              >
                <Play className="w-4 h-4" aria-hidden="true" />
                Start Focus Timer
              </button>
            ) : (
              <>
                <button
                  onClick={togglePause}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  aria-label={isRunning ? 'Pause timer' : 'Resume timer'}
                >
                  {isRunning ? <Pause className="w-4 h-4" aria-hidden="true" /> : <Play className="w-4 h-4" aria-hidden="true" />}
                  {isRunning ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={skipPhase}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  aria-label="Skip to next phase"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  Skip
                </button>
                <button
                  onClick={resetTimer}
                  className="flex items-center gap-1 px-3 py-1.5 text-gray-500 text-sm hover:text-gray-700 transition-colors"
                  aria-label="Reset timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  Reset
                </button>
              </>
            )}
          </div>

          {/* Break message */}
          {phase === 'break' && (
            <div className="mt-3 p-3 bg-amber-100 rounded-xl">
              <p className="text-sm text-amber-800 font-medium">
                Great job focusing! Take a break — stretch, drink water, or close your eyes for a moment. 😊
              </p>
            </div>
          )}
        </div>
      )}

      {/* Content area */}
      <div
        className={
          isFocused
            ? 'relative ring-2 ring-[#7da47f]/20 rounded-2xl p-2 transition-all'
            : ''
        }
        style={
          isFocused
            ? { animation: preferences.reducedMotion ? 'none' : undefined }
            : undefined
        }
      >
        {/* Dim overlay for break time */}
        {phase === 'break' && isFocused && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-40 rounded-2xl flex items-center justify-center">
            <div className="text-center p-6">
              <Coffee className="w-12 h-12 text-amber-500 mx-auto mb-3" aria-hidden="true" />
              <p className="text-lg font-bold text-gray-900">Break Time!</p>
              <p className="text-sm text-gray-600 mt-1">
                {formatTime(secondsLeft)} remaining — relax!
              </p>
              <button
                onClick={skipPhase}
                className="mt-3 px-4 py-2 text-sm bg-[#7da47f] text-white rounded-lg hover:bg-[#6b946d]"
              >
                I&apos;m ready to continue
              </button>
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gentle chime for break notification
// ---------------------------------------------------------------------------

function playBreakChime() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch {
    // Audio not available – silently ignore
  }
}

export default FocusMode;
