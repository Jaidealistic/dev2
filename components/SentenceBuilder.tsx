'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle, Info } from 'lucide-react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';

interface SentenceBuilderProps {
  sourceSentence: { text: string; translation?: string }[];
  expectedWords: string[];
  wordBank: string[]; // Shuffled word bank including distractors
  onMatch: (isCorrect: boolean) => void;
  fullAudioHint?: string; // Optional audio URL or just text to speech
}

export function SentenceBuilder({ sourceSentence, expectedWords, wordBank, onMatch, fullAudioHint }: SentenceBuilderProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(wordBank);
  const [isChecking, setIsChecking] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activeHintIndex, setActiveHintIndex] = useState<number | null>(null);

  const { preferences } = useAccessibility();

  function speakWord(text: string, lang = 'en-US') {
    if (preferences.apdMode) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  }

  function handleSelect(word: string, index: number) {
    if (isChecking || isCorrect) return;
    const newAvailable = [...availableWords];
    newAvailable.splice(index, 1);
    setAvailableWords(newAvailable);
    setSelectedWords([...selectedWords, word]);
    speakWord(word); 
  }

  function handleDeselect(word: string, index: number) {
    if (isChecking || isCorrect) return;
    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
  }

  function handleCheck() {
    setIsChecking(true);
    const assembled = selectedWords.join(' ');
    const expected = expectedWords.join(' ');
    
    if (assembled === expected) {
      setIsCorrect(true);
      if (!preferences.apdMode) {
        try {
          const audio = new Audio('/sounds/correct.mp3');
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch(e) {}
      }
      onMatch(true);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        setIsChecking(false);
        setIsCorrect(null);
        onMatch(false);
      }, 1500);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border-2 border-[#e8e5e0] overflow-hidden flex flex-col">
      {/* Question Area */}
      <div className="p-6 sm:p-8 bg-[#faf9f7] border-b-2 border-[#e8e5e0] flex flex-col items-center">
        <button 
          onClick={() => speakWord(sourceSentence.map(s => s.text).join(' '))}
          className="mb-4 bg-[#7a9b7e] text-white p-3 rounded-full hover:bg-[#6b8c6f] transition-colors shadow-md flex-shrink-0"
          aria-label="Play full sentence"
        >
          <Volume2 className="w-6 h-6" />
        </button>
        
        <div className="flex flex-wrap justify-center gap-2 items-end min-h-[60px]">
          {sourceSentence.map((word, i) => (
            <div key={i} className="relative flex flex-col items-center group cursor-pointer" onClick={() => {
              setActiveHintIndex(activeHintIndex === i ? null : i);
              speakWord(word.text);
            }}>
              <span className="text-2xl sm:text-3xl font-bold text-[#2d2d2d] border-b-[3px] border-dotted border-[#8a8a8a] pb-1 hover:text-[#7a9b7e] hover:border-[#7a9b7e] transition-colors">
                {word.text}
              </span>
              
              {/* Hint Popup */}
              <AnimatePresence>
                {activeHintIndex === i && word.translation && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-full mb-3 bg-[#1e293b] text-white text-sm font-bold py-2 px-4 rounded-xl shadow-xl z-20 whitespace-nowrap"
                  >
                    {word.translation}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1e293b]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8 flex flex-col items-center gap-8 bg-white">
        {/* Construction Zone */}
        <div className={`w-full min-h-[120px] rounded-2xl p-4 flex flex-wrap gap-2 items-start content-start transition-colors duration-300 ${isCorrect === true ? 'bg-green-100 border-2 border-green-400' : isCorrect === false ? 'bg-red-50 border-2 border-red-300' : 'bg-[#1e293b] border-2 border-[#0f172a] shadow-inner'}`}>
          <AnimatePresence>
            {selectedWords.map((word, i) => (
              <motion.button
                key={`${word}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => handleDeselect(word, i)}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-bold shadow-md transform transition-transform hover:scale-105 active:scale-95 text-lg sm:text-xl
                  ${isCorrect === true ? 'bg-green-500 text-white shadow-green-600/50' : isCorrect === false ? 'bg-red-500 text-white shadow-red-600/50' : 'bg-white text-blue-900 border-b-4 border-slate-200'}`}
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
          {selectedWords.length === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center opacity-70 absolute inset-0 pt-8 pointer-events-none">
              <span className="text-slate-400 font-bold tracking-wide">Tap words to build the sentence</span>
            </div>
          )}
        </div>

        {/* Word Bank */}
        <div className="w-full flex justify-center mt-2">
          <div className="flex flex-wrap justify-center gap-3">
            <AnimatePresence>
              {availableWords.map((word, i) => (
                <motion.button
                  key={`bank-${word}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => handleSelect(word, i)}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-white text-[#2d2d2d] border-2 border-[#e8e5e0] border-b-4 border-b-[#d4dcd5] rounded-xl font-bold text-lg sm:text-xl transform transition-transform active:translate-y-1 active:border-b-2 flex-shrink-0"
                >
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Check Button */}
        <div className="w-full mt-4 flex justify-center">
          <button
            onClick={handleCheck}
            disabled={selectedWords.length === 0 || isChecking || isCorrect === true}
            className={`w-full max-w-sm py-4 rounded-2xl font-black text-xl uppercase tracking-wider transition-all duration-300 shadow-lg border-b-4 transform active:translate-y-1 active:border-b-0
              ${selectedWords.length === 0 ? 'bg-[#e8e5e0] text-[#a3a3a3] border-[#d4dcd5] shadow-none cursor-not-allowed' : 
                isCorrect === true ? 'bg-[#4ade80] text-green-900 border-green-600 shadow-green-500/30' :
                isCorrect === false ? 'bg-[#f87171] text-white border-red-600' :
                'bg-[#0ea5e9] text-white border-[#0284c7] hover:bg-[#0284c7] hover:shadow-[#0ea5e9]/50 shadow-[#0ea5e9]/30'
              }
            `}
          >
            {isCorrect === true ? 'Excellent!' : isCorrect === false ? 'Try Again' : 'Check'}
          </button>
        </div>
      </div>
    </div>
  );
}
