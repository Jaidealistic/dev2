'use client';

/**
 * WRITE PRACTICE COMPONENT
 *
 * Interactive writing practice for English & Tamil:
 *  - Shows a target word/sentence
 *  - User types their attempt
 *  - Character-by-character diff feedback
 *  - Accuracy score
 *  - TTS playback of the target
 *  - Supports both Latin (EN) and Tamil (ta) scripts
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Check, X, RotateCcw, Volume2, ChevronRight, Pencil, Sparkles, Trash2, Eraser, Undo2 } from 'lucide-react';

/* ─── Types ─── */
export interface WritePracticeWord {
  id: string;
  target: string;
  hint?: string;
  translation?: string;
  audioUrl?: string;
}

interface WritePracticeProps {
  words: WritePracticeWord[];
  language: 'en' | 'ta';
  onComplete?: (results: { correct: number; total: number; accuracy: number }) => void;
  className?: string;
}

/* ─── Helpers ─── */
function diffChars(target: string, input: string) {
  const result: { char: string; status: 'correct' | 'wrong' | 'missing' }[] = [];
  const tLower = target.toLowerCase();
  const iLower = input.toLowerCase();

  for (let i = 0; i < tLower.length; i++) {
    if (i < iLower.length) {
      result.push({
        char: target[i],
        status: tLower[i] === iLower[i] ? 'correct' : 'wrong',
      });
    } else {
      result.push({ char: target[i], status: 'missing' });
    }
  }
  return result;
}

function accuracy(target: string, input: string): number {
  if (!target) return 0;
  const tL = target.toLowerCase();
  const iL = input.toLowerCase();
  let match = 0;
  for (let i = 0; i < tL.length; i++) {
    if (i < iL.length && tL[i] === iL[i]) match++;
  }
  return Math.round((match / tL.length) * 100);
}

/* ─── ScribbleCanvas Component ─── */
function ScribbleCanvas({ onRecognized, targetWord, language }: { onRecognized: (text: string) => void; targetWord: string; language: 'en' | 'ta' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [strokes, setStrokes] = useState<{ x: number[]; y: number[]; t: number[] }[]>([]);
  const [lastRecognized, setLastRecognized] = useState<string>('');
  const [drawMode, setDrawMode] = useState<'pen' | 'eraser'>('pen');
  const currentStroke = useRef<{ x: number[]; y: number[]; t: number[] }>({ x: [], y: [], t: [] });

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set style for pen
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#2d2d2d';

    strokes.forEach(stroke => {
      ctx.beginPath();
      ctx.moveTo(stroke.x[0], stroke.y[0]);
      for (let i = 1; i < stroke.x.length; i++) {
        ctx.lineTo(stroke.x[i], stroke.y[i]);
      }
      ctx.stroke();
    });
  }, [strokes]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);

    currentStroke.current = { x: [Math.round(x)], y: [Math.round(y)], t: [Date.now()] };
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e, canvas);

    if (drawMode === 'pen') {
      ctx.lineTo(x, y);
      ctx.stroke();
      currentStroke.current.x.push(Math.round(x));
      currentStroke.current.y.push(Math.round(y));
      currentStroke.current.t.push(Date.now());
    } else {
      // Eraser Mode: Remove strokes near current point
      const eraserRadius = 15;
      const strokesToRemove = new Set<number>();

      strokes.forEach((stroke, idx) => {
        for (let i = 0; i < stroke.x.length; i++) {
          const dx = stroke.x[i] - x;
          const dy = stroke.y[i] - y;
          if (dx * dx + dy * dy < eraserRadius * eraserRadius) {
            strokesToRemove.add(idx);
            break;
          }
        }
      });

      if (strokesToRemove.size > 0) {
        setStrokes(prev => prev.filter((_, idx) => !strokesToRemove.has(idx)));
      }
    }
  };

  const endDraw = () => {
    if (isDrawing && drawMode === 'pen' && currentStroke.current.x.length > 0) {
      setStrokes(prev => [...prev, { ...currentStroke.current }]);
    }
    setIsDrawing(false);
  };

  const handleUndo = () => {
    setStrokes(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokes([]);
    canvas.dataset.empty = 'true';
  };

  const handleRecognize = async () => {
    if (strokes.length === 0) {
      alert('Please draw something first!');
      return;
    }
    console.log('Starting handwriting recognition. Strokes:', strokes.length);
    setAnalyzing(true);

    try {
      // Format strokes for Google Input Tools API
      const ink = strokes.map(s => [s.x, s.y, s.t]);
      console.log('Formatted ink data:', JSON.stringify(ink).substring(0, 100) + '...');

      const response = await fetch('/api/recognize-handwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ink: ink,
          language: language
        })
      });

      const data = await response.json();
      console.log('Recognition Response:', data);
      if (data[0] === 'SUCCESS') {
        const topCandidate = data[1][0][1][0];
        console.log('Top Candidate:', topCandidate);
        setLastRecognized(topCandidate || '');
        onRecognized(topCandidate || '');
        // Clear strokes after successful recognition to show it "took"
        handleClear();
      } else {
        console.warn('Recognition failed with status:', data[0]);
        throw new Error('Recognition failed');
      }
    } catch (error) {
      console.error('Handwriting API error:', error);
      alert('Handwriting recognition failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative rounded-2xl border-2 border-dashed border-[#c5d8c7] dark:border-gray-600 bg-[#faf9f7] dark:bg-gray-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={500}
          height={200}
          className="w-full h-[200px] cursor-crosshair touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        <div className="absolute inset-x-0 bottom-4 flex justify-between px-4 pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => setDrawMode('pen')}
              className={`p-1.5 rounded-lg transition-colors ${drawMode === 'pen' ? 'bg-[#7a9b7e] text-white shadow-sm' : 'bg-white/80 text-gray-500 hover:text-gray-700'}`}
              title="Pen Tool"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDrawMode('eraser')}
              className={`p-1.5 rounded-lg transition-colors ${drawMode === 'eraser' ? 'bg-[#7a9b7e] text-white shadow-sm' : 'bg-white/80 text-gray-500 hover:text-gray-700'}`}
              title="Eraser Tool"
            >
              <Eraser className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleUndo}
              className="p-1.5 rounded-lg bg-white/80 text-gray-500 hover:text-gray-700 transition-colors"
              title="Undo"
              disabled={strokes.length === 0}
            >
              <Undo2 className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-red-500 pointer-events-auto flex items-center gap-1 transition-colors bg-white/80 px-2 py-1 rounded-lg"
          >
            Clear <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
      <button
        onClick={handleRecognize}
        disabled={analyzing}
        className="w-full py-3 bg-[#5a8c5c] text-white font-medium rounded-xl hover:bg-[#4a7a4b] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
      >
        {analyzing ? (
          <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Recognizing...</>
        ) : (
          <><Sparkles className="w-4 h-4" /> Analyze Handwriting</>
        )}
      </button>

      {lastRecognized && (
        <div className={`p-3 rounded-xl border mt-1 transition-colors ${lastRecognized.toLowerCase().trim() === targetWord.toLowerCase().trim()
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30'
          : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
          }`}>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Last Recognized</p>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold ${lastRecognized.toLowerCase().trim() === targetWord.toLowerCase().trim()
              ? 'text-green-700 dark:text-green-400'
              : 'text-slate-700 dark:text-slate-200'
              }`}>
              {lastRecognized}
            </span>
            {lastRecognized.toLowerCase().trim() === targetWord.toLowerCase().trim() ? (
              <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">
                <Check className="w-3 h-3" /> Match
              </span>
            ) : (
              <span className="text-[10px] bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                No Match
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Component ─── */
export default function WritePractice({ words, language, onComplete, className = '' }: WritePracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ wordId: string; acc: number }[]>([]);
  const [done, setDone] = useState(false);
  const [inputMode, setInputMode] = useState<'type' | 'draw'>('type');
  const inputRef = useRef<HTMLInputElement>(null);

  const current = words[currentIndex];
  const diff = submitted ? diffChars(current.target, userInput) : [];
  const score = submitted ? accuracy(current.target, userInput) : 0;

  useEffect(() => {
    if (!submitted && inputRef.current) inputRef.current.focus();
  }, [currentIndex, submitted]);

  /* TTS */
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined') return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = language === 'ta' ? 'ta-IN' : 'en-US';
    utter.rate = 0.85;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  }, [language]);

  /* Submit */
  const handleSubmit = () => {
    if (!userInput.trim()) return;
    setSubmitted(true);
    setResults((prev) => [...prev, { wordId: current.id, acc: accuracy(current.target, userInput) }]);
  };

  /* Next */
  const handleNext = () => {
    if (currentIndex + 1 >= words.length) {
      setDone(true);
      const correct = results.filter((r) => r.acc >= 80).length + (accuracy(current.target, userInput) >= 80 ? 1 : 0);
      const total = words.length;
      onComplete?.({ correct, total, accuracy: Math.round(results.reduce((s, r) => s + r.acc, 0) / total) });
      return;
    }
    setCurrentIndex((i) => i + 1);
    setUserInput('');
    setSubmitted(false);
  };

  /* Retry current */
  const handleRetry = () => {
    setUserInput('');
    setSubmitted(false);
    setResults((prev) => prev.slice(0, -1)); // remove last result
  };

  /* ─── Done Screen ─── */
  if (done) {
    const correct = results.filter((r) => r.acc >= 80).length;
    const avg = Math.round(results.reduce((s, r) => s + r.acc, 0) / results.length);
    return (
      <div className={`bg-white rounded-2xl border border-[#e8e5e0] p-8 text-center ${className}`}>
        <Sparkles className="w-12 h-12 text-[#7a9b7e] mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-[#2d2d2d] mb-2">Practice Complete!</h2>
        <p className="text-[#6b6b6b] text-sm mb-6">
          You got <span className="font-bold text-[#5d7e61]">{correct}/{results.length}</span> words correct
          with an average accuracy of <span className="font-bold text-[#5d7e61]">{avg}%</span>.
        </p>
        <button
          onClick={() => { setCurrentIndex(0); setUserInput(''); setSubmitted(false); setResults([]); setDone(false); }}
          className="px-6 py-2.5 bg-[#7a9b7e] text-white text-sm font-medium rounded-xl hover:bg-[#6b8c6f] transition-colors"
        >
          Practice Again
        </button>
      </div>
    );
  }

  /* ─── Main UI ─── */
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border border-[#e8e5e0] dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Progress bar */}
      <div className="h-1.5 bg-[#f0ede8]">
        <div
          className="h-full bg-[#7a9b7e] transition-all duration-300"
          style={{ width: `${((currentIndex + (submitted ? 1 : 0)) / words.length) * 100}%` }}
        />
      </div>

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-medium text-[#8a8a8a] dark:text-gray-400">
            {currentIndex + 1} / {words.length}
          </span>
          <div className="flex items-center gap-1">
            <Pencil className="w-4 h-4 text-[#7a9b7e]" />
            <span className="text-xs font-medium text-[#5d7e61] dark:text-[#a0c4a4]">
              {language === 'ta' ? 'Tamil' : 'English'} Writing
            </span>
          </div>
        </div>

        {/* Target word display */}
        <div className="text-center mb-6">
          <p className="text-xs text-[#8a8a8a] dark:text-gray-400 mb-2 uppercase tracking-wide">Write this word</p>
          <div className="flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-800 py-4 px-6 rounded-2xl mx-auto w-max max-w-full">
            <span className={`text-4xl font-bold text-slate-800 dark:text-white tracking-widest`}>
              {current.target}
            </span>
            <button
              onClick={() => speak(current.target)}
              className="p-2 rounded-lg text-[#7a9b7e] hover:bg-[#f0f4f0] dark:hover:bg-gray-700 transition-colors"
              aria-label="Listen to word"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          {current.translation && (
            <p className="text-sm text-[#6b6b6b] dark:text-gray-300 mt-2">{current.translation}</p>
          )}
          {current.hint && (
            <p className="text-xs text-[#8a8a8a] dark:text-gray-400 mt-1 italic">{current.hint}</p>
          )}
        </div>

        {/* Input / Feedback */}
        {!submitted ? (
          <div className="space-y-4">
            <div className="flex gap-4 mb-4 justify-center border-b border-gray-200 dark:border-gray-700 pb-2">
              <button
                className={`text-sm font-medium pb-1 ${inputMode === 'type' ? 'text-[#7a9b7e] border-b-2 border-[#7a9b7e]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setInputMode('type')}
              >
                Keyboard
              </button>
              <button
                className={`text-sm font-medium pb-1 ${inputMode === 'draw' ? 'text-[#7a9b7e] border-b-2 border-[#7a9b7e]' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setInputMode('draw')}
              >
                Scribble to Text
              </button>
            </div>

            {inputMode === 'type' ? (
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={language === 'ta' ? 'இங்கே எழுதுங்கள்…' : 'Type the word here…'}
                className="w-full px-4 py-3 text-lg text-center border border-[#e8e5e0] dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7a9b7e] focus:border-transparent bg-[#faf9f7] dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400"
                aria-label="Your answer"
                autoComplete="off"
                spellCheck={false}
              />
            ) : (
              <ScribbleCanvas
                onRecognized={(text) => {
                  setUserInput(text);
                }}
                targetWord={current.target}
                language={language}
              />
            )}

            {inputMode === 'type' && (
              <button
                onClick={handleSubmit}
                disabled={!userInput.trim()}
                className="w-full py-3 bg-[#7a9b7e] text-white font-medium rounded-xl hover:bg-[#6b8c6f] transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                Check
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Character diff */}
            <div className="flex flex-wrap justify-center gap-1 text-2xl font-mono" aria-label="Character feedback">
              {diff.map((d, i) => (
                <span
                  key={i}
                  className={`px-1.5 py-1 rounded ${d.status === 'correct'
                    ? 'bg-green-100 text-green-700'
                    : d.status === 'wrong'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                    }`}
                >
                  {d.char === ' ' ? '\u00A0' : d.char}
                </span>
              ))}
            </div>

            {/* Score badge */}
            <div className="text-center">
              {score >= 80 ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  <Check className="w-4 h-4" /> {score}% — Great job!
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium">
                  <X className="w-4 h-4" /> {score}% — Try again
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleRetry}
                className="flex-1 py-3 border border-[#e8e5e0] dark:border-gray-600 text-[#2d2d2d] dark:text-white font-medium rounded-xl hover:bg-[#f5f3ef] dark:hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Retry
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-3 bg-[#7a9b7e] text-white font-medium rounded-xl hover:bg-[#6b8c6f] transition-colors text-sm flex items-center justify-center gap-2"
              >
                {currentIndex + 1 >= words.length ? 'Finish' : 'Next'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
