/**
 * TEACHING INTERFACE - Dual-Pane View
 * 
 * For parent-educators (homeschool):
 * - Left: Student lesson view
 * - Right: Teaching guide sidebar with:
 *   - Scripted instructions ("What to say")
 *   - Disability-specific tips
 *   - Timer + step tracker
 *   - Controls (simplify, pause, skip)
 *   - Notes field for observations
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play,
  Pause,
  Clock,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  FileText,
  Maximize2,
  Minimize2,
  Save
} from 'lucide-react';

interface LessonStep {
  id: string;
  stepNumber: number;
  studentView: {
    type: 'text' | 'audio' | 'video' | 'exercise';
    content: string;
    media?: string;
  };
  teachingGuide: {
    script: string; // What to say
    disabilityTips: {
      dyslexia?: string;
      adhd?: string;
      autism?: string;
      apd?: string;
    };
    estimatedDuration: number; // minutes
    materials?: string[];
  };
}

interface Lesson {
  id: string;
  title: string;
  language: 'English' | 'Tamil';
  totalSteps: number;
  estimatedDuration: number;
  steps: LessonStep[];
}

interface TeachingInterfaceProps {
  lessonId: string;
  studentId: string;
  languageAvailable: 'English' | 'Tamil';
}

export default function TeachingInterface({ lessonId, studentId, languageAvailable }: TeachingInterfaceProps) {
  const router = useRouter();

  // Lesson state
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [teacherNotes, setTeacherNotes] = useState('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Student disabilities (fetched from profile)
  const [studentDisabilities, setStudentDisabilities] = useState<string[]>([]);

  useEffect(() => {
    loadLesson();
    loadStudentProfile();
  }, [lessonId, studentId]);

  // Timer
  useEffect(() => {
    if (!isPaused && lesson) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isPaused, lesson]);

  async function loadLesson() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/parent/teaching/lessons/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load lesson');
      }

      // const data = await response.json();

      // Mock lesson data for now
      const mockLesson: Lesson = {
        id: lessonId,
        title: languageAvailable === 'English' ? 'English Greetings' : 'தமிழ் வாழ்த்துகள்',
        language: languageAvailable,
        totalSteps: 5,
        estimatedDuration: 25,
        steps: [
          {
            id: 'step-1',
            stepNumber: 1,
            studentView: {
              type: 'text' as const,
              content: languageAvailable === 'English' 
                ? 'Welcome! Today we\'ll learn how to greet people in English.' 
                : 'வணக்கம்! இன்று நாம் மக்களை வாழ்த்துவது பற்றி கற்றுக்கொள்வோம்.',
            },
            teachingGuide: {
              script: languageAvailable === 'English'
                ? 'Start by reading the introduction together. Ask your child: "When do we greet people?" Give examples like meeting friends, starting school, or answering the phone.'
                : 'அறிமுகத்தை ஒன்றாக படிப்பதன் மூலம் தொடங்கவும். உங்கள் குழந்தையிடம் கேளுங்கள்: "நாம் எப்போது மக்களை வாழ்த்துகிறோம்?"',
              disabilityTips: {
                dyslexia: 'Read slowly and point to each word. Use larger text if needed. Break sentences into smaller chunks.',
                adhd: 'Set a timer for 3 minutes. Let them fidget or stand while listening. Praise attention every 30 seconds.',
                autism: 'Show a visual schedule of today\'s lesson steps. Use simple, literal language. Avoid idioms.',
                apd: 'Reduce background noise. Speak slowly and clearly. Repeat instructions if needed. Show visual cues.',
              },
              estimatedDuration: 5,
              materials: ['Large print worksheet', 'Visual calendar'],
            },
          },
          {
            id: 'step-2',
            stepNumber: 2,
            studentView: {
              type: 'audio' as const,
              content: 'Listen to these greetings:',
              media: '/audio/greetings.mp3',
            },
            teachingGuide: {
              script: 'Play the audio once. Then play it again, pausing after each greeting. Ask your child to repeat each one. Model the pronunciation clearly.',
              disabilityTips: {
                dyslexia: 'Provide written text with the audio. Highlight each word as it\'s spoken.',
                adhd: 'Play short segments (10-15 seconds). Allow movement breaks between repetitions.',
                autism: 'Tell them exactly how many greetings they\'ll hear (e.g., "We will hear 4 greetings"). Use headphones if they prefer.',
                apd: 'Use slower playback speed (0.75x). Show written transcripts simultaneously. Point to words as they\'re spoken.',
              },
              estimatedDuration: 7,
              materials: ['Headphones', 'Transcript printout', 'Audio player with speed control'],
            },
          },
          {
            id: 'step-3',
            stepNumber: 3,
            studentView: {
              type: 'exercise' as const,
              content: 'Practice: Match the greeting to the time of day',
            },
            teachingGuide: {
              script: 'Read each greeting together. Ask: "When would we say this?" Let them think before answering. If they\'re unsure, give hints like "Do we see the sun or moon?"',
              disabilityTips: {
                dyslexia: 'Accept phonetic spellings. Focus on understanding, not perfect spelling. Use color-coded options.',
                adhd: 'Make it a timed game (2 minutes). Give immediate feedback. Use physical cards they can move around.',
                autism: 'Provide exact expectations: "There are 4 greetings to match." Show a completed example first.',
                apd: 'Read all options aloud first. Let them point instead of speaking if preferred. Reduce verbal instructions.',
              },
              estimatedDuration: 8,
              materials: ['Matching cards', 'Timer', 'Example sheet'],
            },
          },
          {
            id: 'step-4',
            stepNumber: 4,
            studentView: {
              type: 'video' as const,
              content: 'Watch a conversation using greetings',
              media: '/video/conversation.mp4',
            },
            teachingGuide: {
              script: 'Watch the video together. Pause at key moments and ask: "What did they say?" or "How did they greet each other?" Replay if needed.',
              disabilityTips: {
                dyslexia: 'Turn on captions. Use larger caption font if available.',
                adhd: 'Watch in 1-minute segments with discussion breaks. Let them predict what happens next.',
                autism: 'Warn about any sudden sounds or scene changes. Explain social cues explicitly: "They smiled because they are happy to meet."',
                apd: 'Lower background music volume. Use captions. Replay with just visuals, then just audio to separate inputs.',
              },
              estimatedDuration: 5,
              materials: ['Captions enabled', 'Pause/replay ready'],
            },
          },
        ],
      };

      setLesson(mockLesson);
    } catch (error) {
      console.error('Error loading lesson:', error);
      alert('Failed to load lesson');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadStudentProfile() {
    try {
      const response = await fetch(`/api/learner/${studentId}/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudentDisabilities(data.disabilities || []);
      }
    } catch (error) {
      console.error('Error loading student profile:', error);
    }
  }

  async function saveNotes() {
    try {
      await fetch(`/api/parent/teaching/lessons/${lessonId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          lessonId,
          studentId,
          notes: teacherNotes,
          timeSpent: elapsedTime,
          completedSteps: completedSteps.length,
        }),
      });

      alert('Notes saved!');
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes');
    }
  }

  function handleStepComplete() {
    if (!lesson) return;
    const currentStep = lesson.steps[currentStepIndex];
    if (!completedSteps.includes(currentStep.id)) {
      setCompletedSteps([...completedSteps, currentStep.id]);
    }
  }

  function handleNext() {
    if (!lesson) return;
    handleStepComplete();
    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Lesson complete
      router.push(`/parent/teaching/lessons/${lessonId}/complete`);
    }
  }

  function handlePrevious() {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f1eb]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#9db4a0] border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading teaching interface...</p>
        </div>
      </div>
    );
  }

  if (!lesson) return null;

  const currentStep = lesson.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / lesson.totalSteps) * 100;
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-sm text-gray-600">Teaching Mode • {languageAvailable}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{minutes}:{seconds.toString().padStart(2, '0')}</span>
            </div>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-4 py-2 rounded-full font-medium ${
                isPaused ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isPaused ? <><Play className="w-4 h-4 inline mr-2" />Resume</> : <><Pause className="w-4 h-4 inline mr-2" />Pause</>}
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="container mx-auto mt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step {currentStepIndex + 1} of {lesson.totalSteps}</span>
            <span className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#9db4a0] h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main: Dual-Pane Layout */}
      <main className="container mx-auto px-6 py-8">
        <div className={`grid ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} gap-6`}>
          {/* LEFT PANE: Student View */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
              <BookOpen className="w-6 h-6 text-[#9db4a0]" />
              <h2 className="text-2xl font-bold text-gray-900">Student View</h2>
            </div>

            {/* Student Content */}
            <div className="prose prose-lg max-w-none">
              {currentStep.studentView.type === 'text' && (
                <p className="text-xl text-gray-800 leading-relaxed">
                  {currentStep.studentView.content}
                </p>
              )}

              {currentStep.studentView.type === 'audio' && (
                <div>
                  <p className="text-xl text-gray-800 mb-6">{currentStep.studentView.content}</p>
                  <audio controls className="w-full" src={currentStep.studentView.media}>
                    Your browser does not support audio.
                  </audio>
                </div>
              )}

              {currentStep.studentView.type === 'video' && (
                <div>
                  <p className="text-xl text-gray-800 mb-6">{currentStep.studentView.content}</p>
                  <video controls className="w-full rounded-2xl" src={currentStep.studentView.media}>
                    Your browser does not support video.
                  </video>
                </div>
              )}

              {currentStep.studentView.type === 'exercise' && (
                <div>
                  <p className="text-xl font-bold text-gray-900 mb-6">{currentStep.studentView.content}</p>
                  <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
                    <p className="text-gray-700">Exercise interface would appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANE: Teaching Guide */}
          {!isFullscreen && (
            <div className="bg-gradient-to-br from-[#f0f7f0] to-[#e0ede1] rounded-3xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#c5d8c7]">
                <Lightbulb className="w-6 h-6 text-[#5a8c5c]" />
                <h2 className="text-2xl font-bold text-gray-900">Teaching Guide</h2>
              </div>

              {/* Scripted Instructions */}
              <div className="mb-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                  💬 What to Say:
                </h3>
                <div className="p-5 bg-white rounded-2xl border-2 border-[#c5d8c7]">
                  <p className="text-gray-800 leading-relaxed">{currentStep.teachingGuide.script}</p>
                </div>
              </div>

              {/* Disability-Specific Tips */}
              <div className="mb-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Disability-Specific Tips:
                </h3>
                <div className="space-y-3">
                  {studentDisabilities.map((disability) => {
                    const tip = currentStep.teachingGuide.disabilityTips[disability.toLowerCase() as keyof typeof currentStep.teachingGuide.disabilityTips];
                    if (!tip) return null;

                    return (
                      <div key={disability} className="p-4 bg-white rounded-2xl border-2 border-yellow-300">
                        <p className="font-semibold text-gray-900 mb-2">
                          {disability === 'dyslexia' && '📖 Dyslexia'}
                          {disability === 'adhd' && '⚡ ADHD'}
                          {disability === 'autism' && '🧠 Autism'}
                          {disability === 'apd' && '🎧 APD'}
                        </p>
                        <p className="text-sm text-gray-800">{tip}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Materials Needed */}
              {currentStep.teachingGuide.materials && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">📦 Materials Needed:</h3>
                  <ul className="space-y-2">
                    {currentStep.teachingGuide.materials.map((material: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 p-3 bg-white rounded-xl">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-gray-800">{material}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Estimated Duration */}
              <div className="mb-6 p-4 bg-white rounded-2xl">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-5 h-5" />
                  <span>Estimated time: <strong>{currentStep.teachingGuide.estimatedDuration} minutes</strong></span>
                </div>
              </div>

              {/* Teacher Notes */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                  <FileText className="w-5 h-5" />
                  Your Notes:
                </h3>
                <textarea
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  placeholder="Record observations, challenges, successes..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#9db4a0] focus:outline-none resize-none"
                  rows={4}
                />
                <button
                  onClick={saveNotes}
                  className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium text-sm"
                >
                  <Save className="w-4 h-4" />
                  Save Notes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-full font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous Step
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleStepComplete}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium"
            >
              <CheckCircle className="w-5 h-5" />
              Mark Complete
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-[#9db4a0] hover:bg-[#8ca394] text-white rounded-full font-medium"
            >
              {currentStepIndex === lesson.steps.length - 1 ? 'Finish Lesson' : 'Next Step'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
