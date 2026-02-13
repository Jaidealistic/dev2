/**
 * PRACTICE & ASSESSMENT COMPONENTS
 * 
 * Enhanced practice components with:
 * - Guided practice with progressive hints
 * - Disability-aware answer checking (phonetic spelling, common dyslexic errors)
 * - Non-shaming feedback language
 * - Adaptive difficulty adjustment
 * - Multiple attempt support
 */

'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';

// Phonetic similarity checker for dyslexia-aware validation
function calculatePhoneticSimilarity(answer: string, correct: string): number {
  const normalize = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const a = normalize(answer);
  const c = normalize(correct);
  
  if (a === c) return 1.0;
  
  // Common dyslexic substitutions
  const dyslexicPatterns: { [key: string]: string[] } = {
    'b': ['d', 'p', 'q'],
    'd': ['b', 'p', 'q'],
    'p': ['b', 'd', 'q'],
    'q': ['b', 'd', 'p'],
    'u': ['n'],
    'n': ['u'],
    'was': ['saw'],
    'saw': ['was'],
    'on': ['no'],
    'no': ['on'],
  };
  
  // Check if answer matches with dyslexic substitutions
  let score = 0;
  const minLength = Math.min(a.length, c.length);
  
  for (let i = 0; i < minLength; i++) {
    if (a[i] === c[i]) {
      score += 1;
    } else if (dyslexicPatterns[c[i]]?.includes(a[i])) {
      score += 0.8; // High score for common reversals
    }
  }
  
  // Levenshtein-like similarity
  const similarity = score / Math.max(a.length, c.length);
  return similarity;
}

interface GuidedPracticeProps {
  question: string;
  answer: string;
  hints: string[];
  onCorrect: () => void;
  allowPhoneticMatch?: boolean;
}

export function GuidedPractice({ 
  question, 
  answer, 
  hints, 
  onCorrect,
  allowPhoneticMatch = true 
}: GuidedPracticeProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'close' | 'incorrect' | null; message: string }>({ type: null, message: '' });
  const [isComplete, setIsComplete] = useState(false);

  function handleSubmit() {
    const similarity = calculatePhoneticSimilarity(userAnswer, answer);
    
    if (similarity >= 0.95) {
      // Exact or very close match
      setFeedback({ 
        type: 'correct', 
        message: '✨ Excellent work! You got it!' 
      });
      setIsComplete(true);
      onCorrect();
    } else if (similarity >= 0.7 && allowPhoneticMatch) {
      // Close enough - phonetic match
      setFeedback({ 
        type: 'close', 
        message: `🌟 Great effort! Your answer "${userAnswer}" is very close. The exact spelling is "${answer}". Let's count this as correct!` 
      });
      setIsComplete(true);
      onCorrect();
    } else {
      // Incorrect - offer hint
      setAttempts(prev => prev + 1);
      setFeedback({ 
        type: 'incorrect', 
        message: `Not quite there yet. ${attempts >= 1 ? 'Would you like a hint?' : 'Try again!'}` 
      });
    }
  }

  function handleShowHint() {
    setShowHint(true);
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
  }

  function handleReset() {
    setUserAnswer('');
    setFeedback({ type: null, message: '' });
    setAttempts(0);
    setShowHint(false);
    setCurrentHintIndex(0);
    setIsComplete(false);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{question}</h3>
        
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={isComplete}
          placeholder="Type your answer here..."
          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-[#9db4a0] focus:outline-none focus:ring-2 focus:ring-[#9db4a0] focus:ring-opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isComplete) {
              handleSubmit();
            }
          }}
        />

        <div className="flex gap-3 mt-4">
          {!isComplete && (
            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-[#9db4a0] hover:bg-[#8ca394] text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Answer
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {attempts >= 1 && !isComplete && hints.length > 0 && (
            <button
              onClick={handleShowHint}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded-full font-medium border-2 border-yellow-300"
            >
              <Lightbulb className="w-5 h-5" />
              Get Hint
            </button>
          )}

          {isComplete && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
          )}
        </div>
      </div>

      {/* Hint Display */}
      {showHint && hints[currentHintIndex] && (
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-yellow-900 mb-1">Hint {currentHintIndex + 1}:</h4>
              <p className="text-yellow-900">{hints[currentHintIndex]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Display */}
      {feedback.type && (
        <div className={`rounded-2xl p-5 border-2 ${
          feedback.type === 'correct' ? 'bg-green-50 border-green-500' :
          feedback.type === 'close' ? 'bg-blue-50 border-blue-500' :
          'bg-orange-50 border-orange-300'
        }`}>
          <div className="flex items-start gap-3">
            {feedback.type === 'correct' || feedback.type === 'close' ? (
              <CheckCircle className={`w-6 h-6 flex-shrink-0 mt-1 ${
                feedback.type === 'correct' ? 'text-green-600' : 'text-blue-600'
              }`} />
            ) : (
              <Sparkles className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            )}
            <p className={`text-lg ${
              feedback.type === 'correct' ? 'text-green-900' :
              feedback.type === 'close' ? 'text-blue-900' :
              'text-orange-900'
            }`}>
              {feedback.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface MultipleChoiceProps {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  onAnswer: (correct: boolean) => void;
  allowMultipleAttempts?: boolean;
}

export function MultipleChoice({ 
  question, 
  options, 
  correctAnswer, 
  explanation,
  onAnswer,
  allowMultipleAttempts = true 
}: MultipleChoiceProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  function handleSelect(option: string) {
    if (!isSubmitted || allowMultipleAttempts) {
      setSelectedAnswer(option);
    }
  }

  function handleSubmit() {
    if (!selectedAnswer) return;
    
    setIsSubmitted(true);
    setAttempts(prev => prev + 1);
    const isCorrect = selectedAnswer === correctAnswer;
    onAnswer(isCorrect);
  }

  function handleReset() {
    setSelectedAnswer(null);
    setIsSubmitted(false);
  }

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{question}</h3>

        <div className="space-y-3">
          {options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const showCorrect = isSubmitted && option === correctAnswer;
            const showIncorrect = isSubmitted && isSelected && option !== correctAnswer;

            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                disabled={isSubmitted && !allowMultipleAttempts}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  showCorrect
                    ? 'bg-green-50 border-green-500'
                    : showIncorrect
                    ? 'bg-orange-50 border-orange-300'
                    : isSelected
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-gray-50 border-gray-300 hover:border-[#9db4a0] hover:bg-gray-100'
                } disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                  {showCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                  {showIncorrect && <Sparkles className="w-6 h-6 text-orange-600" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 mt-6">
          {!isSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="flex items-center gap-2 px-6 py-3 bg-[#9db4a0] hover:bg-[#8ca394] text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {isSubmitted && allowMultipleAttempts && !isCorrect && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium"
            >
              <RotateCcw className="w-5 h-5" />
              Try Different Answer
            </button>
          )}
        </div>
      </div>

      {/* Feedback */}
      {isSubmitted && (
        <div className={`rounded-2xl p-5 border-2 ${
          isCorrect ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-300'
        }`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            ) : (
              <Sparkles className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            )}
            <div>
              <p className={`text-lg font-bold mb-2 ${isCorrect ? 'text-green-900' : 'text-orange-900'}`}>
                {isCorrect 
                  ? '✨ Excellent! That\'s correct!' 
                  : `Good effort! ${allowMultipleAttempts && attempts < 2 ? 'Would you like to try another answer?' : `The correct answer is "${correctAnswer}".`}`
                }
              </p>
              {explanation && isCorrect && (
                <p className="text-green-800 mt-2">{explanation}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FillInBlankProps {
  sentence: string; // Use {{blank}} to indicate blank position
  correctAnswer: string;
  hints?: string[];
  onCorrect: () => void;
  acceptPhonetic?: boolean;
}

export function FillInBlank({ 
  sentence, 
  correctAnswer, 
  hints = [], 
  onCorrect,
  acceptPhonetic = true
}: FillInBlankProps) {
  const parts = sentence.split('{{blank}}');
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="text-xl text-gray-900 mb-6">
          <span>{parts[0]}</span>
          <span className="inline-block min-w-[200px] border-b-4 border-[#9db4a0] mx-2 px-2 font-bold">
            [blank]
          </span>
          <span>{parts[1]}</span>
        </div>

        <GuidedPractice
          question="Fill in the blank:"
          answer={correctAnswer}
          hints={hints}
          onCorrect={onCorrect}
          allowPhoneticMatch={acceptPhonetic}
        />
      </div>
    </div>
  );
}
