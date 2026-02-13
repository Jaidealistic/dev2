'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface PatternLockProps {
  onPatternComplete: (pattern: number[]) => void;
  mode: 'create' | 'verify';
  size?: number;
  disabled?: boolean;
  error?: string;
}

const COLORS = [
  '#7da47f', '#5a8c5c', '#9db4a0', '#6b946d', '#4a7c4c',
  '#8ca394', '#3a6c3c', '#a8c5aa', '#78b07a',
];

export default function PatternLock({
  onPatternComplete,
  mode,
  size = 280,
  disabled = false,
  error,
}: PatternLockProps) {
  const [selectedDots, setSelectedDots] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const GRID = 3;
  const dotRadius = size * 0.06;
  const padding = size * 0.15;
  const spacing = (size - 2 * padding) / (GRID - 1);

  const getDotCenter = useCallback(
    (index: number) => {
      const row = Math.floor(index / GRID);
      const col = index % GRID;
      return { x: padding + col * spacing, y: padding + row * spacing };
    },
    [padding, spacing]
  );

  const getIndexFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return -1;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      for (let i = 0; i < 9; i++) {
        const center = getDotCenter(i);
        const dist = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);
        if (dist < dotRadius * 2.5) return i;
      }
      return -1;
    },
    [getDotCenter, dotRadius]
  );

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      if (disabled || completed) return;
      const index = getIndexFromPoint(clientX, clientY);
      if (index >= 0) {
        setSelectedDots([index]);
        setIsDrawing(true);
        setCompleted(false);
      }
    },
    [disabled, completed, getIndexFromPoint]
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDrawing || disabled) return;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({ x: clientX - rect.left, y: clientY - rect.top });
      }
      const index = getIndexFromPoint(clientX, clientY);
      if (index >= 0 && !selectedDots.includes(index)) {
        setSelectedDots((prev) => [...prev, index]);
      }
    },
    [isDrawing, disabled, getIndexFromPoint, selectedDots]
  );

  const handleEnd = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setMousePos(null);
    if (selectedDots.length >= (mode === 'create' ? 4 : 1)) {
      setCompleted(true);
      onPatternComplete(selectedDots);
    } else {
      setSelectedDots([]);
    }
  }, [isDrawing, selectedDots, onPatternComplete, mode]);

  useEffect(() => {
    if (error) {
      setCompleted(false);
      setSelectedDots([]);
    }
  }, [error]);

  const reset = () => {
    setSelectedDots([]);
    setCompleted(false);
    setIsDrawing(false);
    setMousePos(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className={`relative select-none touch-none rounded-2xl bg-white border-2 ${
          error ? 'border-red-300 shadow-red-100' : completed ? 'border-green-300 shadow-green-100' : 'border-[#c5d8c7] shadow-[#9db4a0]/10'
        } shadow-lg transition-all`}
        style={{ width: size, height: size }}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => {
          e.preventDefault();
          const t = e.touches[0];
          handleStart(t.clientX, t.clientY);
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          const t = e.touches[0];
          handleMove(t.clientX, t.clientY);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleEnd();
        }}
      >
        <svg width={size} height={size} className="absolute inset-0">
          {/* Connection lines */}
          {selectedDots.map((dot, i) => {
            if (i === 0) return null;
            const from = getDotCenter(selectedDots[i - 1]);
            const to = getDotCenter(dot);
            return (
              <line
                key={`line-${i}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke={error ? '#f87171' : completed ? '#4ade80' : COLORS[i % COLORS.length]}
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.7}
              />
            );
          })}
          {/* Active line to cursor */}
          {isDrawing && mousePos && selectedDots.length > 0 && (
            <line
              x1={getDotCenter(selectedDots[selectedDots.length - 1]).x}
              y1={getDotCenter(selectedDots[selectedDots.length - 1]).y}
              x2={mousePos.x}
              y2={mousePos.y}
              stroke="#9db4a0"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="6 4"
              opacity={0.5}
            />
          )}
        </svg>

        {/* Dots */}
        {Array.from({ length: 9 }).map((_, i) => {
          const center = getDotCenter(i);
          const isSelected = selectedDots.includes(i);
          const order = selectedDots.indexOf(i);
          return (
            <div
              key={i}
              className={`absolute rounded-full transition-all duration-200 flex items-center justify-center ${
                isSelected
                  ? error ? 'bg-red-400 scale-125 shadow-lg shadow-red-200'
                    : completed ? 'bg-green-400 scale-125 shadow-lg shadow-green-200'
                    : 'scale-125 shadow-lg'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              style={{
                width: dotRadius * 2,
                height: dotRadius * 2,
                left: center.x - dotRadius,
                top: center.y - dotRadius,
                backgroundColor: isSelected && !error && !completed ? COLORS[order % COLORS.length] : undefined,
              }}
            >
              {isSelected && mode === 'create' && !error && (
                <span className="text-white text-xs font-bold">{order + 1}</span>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>
          {mode === 'create'
            ? `Connect at least 4 dots (${selectedDots.length} selected)`
            : completed
              ? 'Pattern entered'
              : 'Draw your pattern'}
        </span>
        <button
          type="button"
          onClick={reset}
          className="text-[#5a8c5c] hover:text-[#4a7c4c] font-medium"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
