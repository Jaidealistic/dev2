'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, RotateCcw, Sparkles, MessageCircle, ArrowRight, User } from 'lucide-react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface DialogueStep {
  id: string;
  aiText: string;
  expectedKeywords: string[];
  successResponse: string;
  failResponse: string;
  hint: string;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  steps: DialogueStep[];
}

const SAMPLE_SCENARIO: Scenario = {
  id: 'cafe-order',
  title: 'Ordering at a Cafe',
  description: 'Practice ordering drinks and food in a friendly cafe.',
  steps: [
    {
      id: 'step-1',
      aiText: "Hello! Welcome to the Star Cafe. What would you like to drink today?",
      expectedKeywords: ['coffee', 'tea', 'water', 'juice', 'latte', 'cappuccino', 'espresso'],
      successResponse: "Excellent choice! I'll get that started for you.",
      failResponse: "I didn't quite catch that. We have coffee, tea, and water.",
      hint: "Try saying: 'I would like a coffee please' or 'Water'.",
    },
    {
      id: 'step-2',
      aiText: "Would you like anything to eat with that? We have sandwiches and pastries.",
      expectedKeywords: ['sandwich', 'pastry', 'cake', 'croissant', 'muffin', 'no', 'nothing', 'good'],
      successResponse: "Perfect. That will be ready in just a minute.",
      failResponse: "Sorry, what was that? You can say 'a sandwich' or 'no thank you'.",
      hint: "Try saying: 'A sandwich please' or 'No, thank you'.",
    },
    {
      id: 'step-3',
      aiText: "Your order is ready! That will be 5 dollars, please. Are you paying with cash or card?",
      expectedKeywords: ['cash', 'card', 'credit', 'debit', 'money'],
      successResponse: "Thank you! Have a wonderful day!",
      failResponse: "I missed that. Cash or card?",
      hint: "Try saying: 'I will pay with card' or 'Cash'.",
    }
  ]
};

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isError?: boolean;
}

export function AITutorDialogue() {
  const { preferences } = useAccessibility();
  const { t } = useLanguage();
  
  const [scenario, setScenario] = useState<Scenario>(SAMPLE_SCENARIO);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis and start first message
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    startScenario();
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecording, transcript]);

  const speakAiMessage = useCallback((text: string, onEnd?: () => void) => {
    if (!synthRef.current || preferences.apdMode) {
      if (onEnd) setTimeout(onEnd, 1000); // Simulate delay if muted
      return;
    }

    synthRef.current.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for language learners
    utterance.pitch = 1.1; // Friendly tone
    
    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => {
      setIsAiSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      setIsAiSpeaking(false);
      if (onEnd) onEnd();
    };

    synthRef.current.speak(utterance);
  }, [preferences.apdMode]);

  const addMessage = (sender: 'ai' | 'user', text: string, isError = false) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), sender, text, isError }]);
  };

  const startScenario = () => {
    setMessages([]);
    setCurrentStepIndex(0);
    setShowHint(false);
    setIsCompleted(false);
    
    const firstStep = SAMPLE_SCENARIO.steps[0];
    addMessage('ai', firstStep.aiText);
    speakAiMessage(firstStep.aiText);
  };

  const handleUserResponse = (spokenText: string) => {
    addMessage('user', spokenText);
    setShowHint(false);
    
    if (currentStepIndex >= scenario.steps.length) return;
    
    const currentStep = scenario.steps[currentStepIndex];
    const normalizedInput = spokenText.toLowerCase().replace(/[.,!?]/g, '');
    
    // Check if any expected keyword is in the spoken text
    const isCorrect = currentStep.expectedKeywords.some(keyword => 
      normalizedInput.includes(keyword.toLowerCase())
    );

    setTimeout(() => {
      if (isCorrect) {
        addMessage('ai', currentStep.successResponse);
        speakAiMessage(currentStep.successResponse, () => {
          // Move to next step or complete
          if (currentStepIndex < scenario.steps.length - 1) {
            setTimeout(() => {
              const nextStep = scenario.steps[currentStepIndex + 1];
              setCurrentStepIndex(currentStepIndex + 1);
              addMessage('ai', nextStep.aiText);
              speakAiMessage(nextStep.aiText);
            }, 1000);
          } else {
            setIsCompleted(true);
          }
        });
      } else {
        addMessage('ai', currentStep.failResponse, true);
        speakAiMessage(currentStep.failResponse);
        setShowHint(true);
      }
    }, 500); // Small natural pause
  };

  const startRecording = () => {
    if (isAiSpeaking && synthRef.current) {
      synthRef.current.cancel();
      setIsAiSpeaking(false);
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition isn't supported in your browser.");
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal) {
        setIsRecording(false);
        handleUserResponse(text);
      }
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7a9b7e] to-[#5a8c5c] p-6 text-white flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            AI Language Tutor
          </h2>
          <p className="text-green-100 text-sm mt-1">{scenario.title}</p>
        </div>
        <button 
          onClick={startScenario}
          className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          title="Restart Scenario"
        >
          <RotateCcw className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#fbf9f6] flex flex-col gap-6" role="log" aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex w-full ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${
                  message.sender === 'ai' ? 'bg-[#9db4a0] text-white' : 'bg-[#e8e5e0] text-gray-500'
                }`}>
                  {message.sender === 'ai' ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>
                
                {/* Bubble */}
                <div className={`p-4 rounded-2xl relative ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : message.isError
                      ? 'bg-amber-50 text-amber-900 border border-amber-200 rounded-tl-none'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  <p className="text-[1.05rem] leading-relaxed select-text">{message.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Active listening indicator & transcript preview */}
          {(isRecording || transcript) && (
            <motion.div 
              key="transcript-preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex w-full justify-end"
            >
               <div className="flex gap-3 max-w-[80%] flex-row-reverse">
                  <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center shadow-sm bg-[#e8e5e0] text-gray-500">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 text-blue-800 border-2 border-dashed border-blue-300 rounded-tr-none min-w-[120px]">
                    {transcript ? (
                      <p className="text-[1.05rem] leading-relaxed italic">{transcript}</p>
                    ) : (
                      <div className="flex justify-center gap-1.5 h-6 items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    )}
                  </div>
               </div>
            </motion.div>
          )}

          {/* Hint Dropdown */}
          {showHint && currentStepIndex < scenario.steps.length && (
            <motion.div
              key="hint-dropdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="w-full flex justify-center my-2"
            >
              <div className="bg-white border-2 border-indigo-100 px-6 py-3 rounded-full shadow-sm text-indigo-700 text-sm font-medium flex items-center gap-2">
                <span className="text-xl">💡</span>
                {scenario.steps[currentStepIndex].hint}
              </div>
            </motion.div>
          )}

          {/* Completion State */}
          {isCompleted && (
            <motion.div
              key="completion-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center mt-4"
            >
              <h3 className="text-xl font-bold text-green-800 mb-2">🎉 Wonderful Conversation!</h3>
              <p className="text-green-700 mb-4">You successfully completed this scenario.</p>
              <button 
                onClick={startScenario}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-colors"
              >
                Practice Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} className="h-4 shrink-0" />
      </div>

      {/* Controls Container */}
      <div className="p-6 bg-white border-t border-gray-100 shrink-0 flex flex-col items-center">
        {!isCompleted ? (
          <>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform active:scale-95 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-100 animate-pulse' 
                  : 'bg-[#9db4a0] hover:bg-[#8ca394] ring-4 ring-[#9db4a0]/20'
              }`}
              aria-label={isRecording ? 'Stop listening' : 'Start speaking'}
            >
              {isRecording ? (
                <MicOff className="w-8 h-8 text-white" />
              ) : (
                <Mic className="w-8 h-8 text-white" />
              )}
            </button>
            <p className="text-gray-500 mt-4 text-sm font-medium">
              {isRecording ? "Listening... click to stop" : "Tap the mic and speak to the tutor"}
            </p>
          </>
        ) : (
          <p className="text-gray-400 font-medium italic">Scenario Complete</p>
        )}
      </div>
    </div>
  );
}
