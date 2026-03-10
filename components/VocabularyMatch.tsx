'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { CheckCircle, Volume2 } from 'lucide-react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';

interface VocabularyMatchProps {
  sourceWord: string; // The English word, e.g. "father"
  options: {
    id: string;
    targetWord: string; // The target language word
    imageUrl: string;
    isCorrect: boolean;
  }[];
  onMatch: (isCorrect: boolean) => void;
}

export function VocabularyMatch({ sourceWord, options, onMatch }: VocabularyMatchProps) {
  const [matchedId, setMatchedId] = useState<string | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const pillControls = useAnimation();
  const { preferences } = useAccessibility();

  // Reset state when options change
  useEffect(() => {
    setMatchedId(null);
    setWrongId(null);
    pillControls.start({ x: 0, y: 0, scale: 1 });
  }, [sourceWord, options, pillControls]);

  function playSuccessChime() {
    if (preferences.apdMode) return; // Respect auditory sensitivity if needed
    try {
      const audio = new Audio('/sounds/correct.mp3'); // Fallback if no file exists: just visual
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch(e) {}
  }

  function handleCheck(id: string) {
    const selected = options.find(o => o.id === id);
    if (!selected) return;

    if (selected.isCorrect) {
      setMatchedId(id);
      setWrongId(null);
      playSuccessChime();
      
      // Move pill to the center of the correct card
      onMatch(true);
    } else {
      setWrongId(id);
      pillControls.start({ 
        x: [0, -10, 10, -10, 10, 0], 
        transition: { duration: 0.4 } 
      });
      setTimeout(() => setWrongId(null), 1500);
      onMatch(false);
    }
  }

  function handleDragEnd(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    setIsDragging(false);
    
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const dropX = info.point.x - containerRect.left;
    const dropY = info.point.y - containerRect.top;
    
    const width = containerRect.width;
    const height = containerRect.height;

    // Determine quadrant
    let droppedQuadrant = -1;
    if (dropX < width / 2 && dropY < height / 2) droppedQuadrant = 0; // Top-Left
    else if (dropX >= width / 2 && dropY < height / 2) droppedQuadrant = 1; // Top-Right
    else if (dropX < width / 2 && dropY >= height / 2) droppedQuadrant = 2; // Bottom-Left
    else if (dropX >= width / 2 && dropY >= height / 2) droppedQuadrant = 3; // Bottom-Right

    if (droppedQuadrant >= 0 && droppedQuadrant < options.length) {
      handleCheck(options[droppedQuadrant].id);
    } else {
      // Snap back if dropped outside
      pillControls.start({ x: 0, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
    
    // Snap back visually anyway until matched state transforms it
    if (!matchedId) {
      pillControls.start({ x: 0, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } });
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-square sm:aspect-[4/3] bg-[#f5f3ef] rounded-3xl p-4 sm:p-6" ref={containerRef}>
      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 w-full h-full relative">
        {options.map((opt, idx) => {
          const isMatched = matchedId === opt.id;
          const isWrong = wrongId === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => handleCheck(opt.id)}
              disabled={!!matchedId}
              className={`relative flex flex-col items-center justify-end rounded-2xl overflow-hidden border-4 transition-all duration-300 shadow-sm
                ${isMatched ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-[0.98]' : 
                  isWrong ? 'border-red-400 bg-red-50' : 
                  'border-transparent hover:border-blue-300 hover:shadow-md bg-white'
                }`}
            >
              <div 
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${isMatched ? 'scale-110 blur-[2px]' : ''}`} 
                style={{ backgroundImage: `url(${opt.imageUrl})` }}
              />
              
              {/* Dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Success Overlay */}
              {isMatched && (
                <div className="absolute inset-0 bg-green-500/20 flex flex-col items-center justify-center animate-in fade-in duration-300">
                  <CheckCircle className="w-16 h-16 text-white drop-shadow-md mb-2" />
                </div>
              )}

              {/* Word Bar */}
              <div className={`relative w-full p-3 sm:p-4 transition-colors duration-300 z-10 ${
                isMatched ? 'bg-green-600' : 'bg-blue-600/90 backdrop-blur-sm'
              }`}>
                <p className="text-white font-bold text-center text-lg sm:text-xl drop-shadow-sm tracking-wide">
                  {isMatched ? sourceWord : opt.targetWord}
                </p>
                {isMatched && (
                  <p className="text-green-100 font-medium text-center text-sm opacity-90">
                    {opt.targetWord}
                  </p>
                )}
              </div>
            </button>
          );
        })}

        {/* Center Draggable Source Pill */}
        {!matchedId && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <motion.div
              drag
              dragConstraints={containerRef}
              dragElastic={0.2}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              animate={pillControls}
              whileDrag={{ scale: 1.15, cursor: 'grabbing', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              className={`pointer-events-auto bg-[#fb8c00] text-white px-8 py-4 sm:px-10 sm:py-5 rounded-full font-bold text-xl sm:text-2xl shadow-xl border-4 border-white flex items-center gap-3 cursor-grab ${isDragging ? 'shadow-2xl' : ''}`}
            >
              <Volume2 className="w-6 h-6 opacity-80" />
              {sourceWord}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
