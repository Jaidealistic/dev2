/**
 * MULTI-MODAL LESSON INTERFACE
 * 
 * Core lesson delivery component supporting multiple modalities:
 * - Text with adjustable typography
 * - Audio with playback controls and transcripts
 * - Video with captions and speed control
 * - Interactive exercises with immediate feedback
 * - Speech recognition for pronunciation practice
 * 
 * Based on specification requirements for:
 * - Dyslexia: Synchronized highlighting, adjustable fonts
 * - ADHD: Chunked content, progress indicators, timers
 * - Autism: Predictable structure, clear instructions
 * - APD: Full transcripts, visual indicators, adjustable speed
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { TextToSpeech, InlineTextToSpeech } from '@/components/TextToSpeech';
import { VisualSchedule } from '@/components/VisualSchedule';
import { GuidedPractice, MultipleChoice, FillInBlank } from '@/components/PracticeComponents';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  CheckCircle,
  XCircle,
  MessageSquare,
  Mic,
  Clock,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Subtitles,
  Save,
} from 'lucide-react';

interface LessonSection {
  id: string;
  type: 'text' | 'audio' | 'video' | 'exercise' | 'speech';
  title: string;
  content: {
    text?: string;
    audioUrl?: string;
    videoUrl?: string;
    transcript?: string;
    exercise?: {
      question: string;
      type: 'multiple-choice' | 'fill-blank' | 'matching' | 'speech';
      options?: string[];
      correctAnswer?: string;
    };
  };
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  competencies: string[];
  disabilityTypes?: string[];
  sections: LessonSection[];
}

interface MultiModalLessonProps {
  lessonId: string;
  onComplete: (score: number, duration: number) => void;
}

export function MultiModalLesson({ lessonId, onComplete }: MultiModalLessonProps) {
  const { preferences } = useAccessibility();
  const { info } = useToast();
  const router = useRouter();

  // Lesson state
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProgress, setIsSavingProgress] = useState(false);

  // Media player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showTranscript, setShowTranscript] = useState(true);
  const [showCaptions, setShowCaptions] = useState(true);

  // Exercise state
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [feedback, setFeedback] = useState<{ [key: string]: { correct: boolean; message: string } }>({});
  const [score, setScore] = useState(0);

  // Speech recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<string>('');

  // Timer
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ADHD single-sentence mode (OpenProject #12620)
  const [activeSentenceIdx, setActiveSentenceIdx] = useState(0);

  // Dyslexia word highlighting state
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  // Reset indices when section changes
  useEffect(() => {
    setActiveSentenceIdx(0);
    setHighlightIndex(null);
  }, [currentSectionIndex]);

  // Audio/Video refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Load lesson data
  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  // Start timer when lesson loads
  useEffect(() => {
    if (lesson) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [lesson]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    if (!lesson) return;

    const autoSaveInterval = setInterval(() => {
      saveProgress();
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [lesson, currentSectionIndex, score]);

  // Save progress when section changes
  useEffect(() => {
    if (lesson && currentSectionIndex > 0) {
      saveProgress();
    }
  }, [currentSectionIndex]);

  // Determine active disability modes based on Lesson Tags OR User Preferences
  const isAdhdMode = (lesson?.disabilityTypes?.includes('ADHD')) || preferences.adhdMode;
  const isDyslexiaMode = (lesson?.disabilityTypes?.includes('DYSLEXIA')) || preferences.dyslexiaMode || preferences.fontFamily === 'opendyslexic';
  const isApdMode = (lesson?.disabilityTypes?.includes('APD')) || preferences.apdMode;
  const isAutismMode = (lesson?.disabilityTypes?.includes('AUTISM')) || preferences.autismMode;

  // Notify user if a special mode is auto-activated by the lesson
  useEffect(() => {
    if (lesson && !isLoading) {
      if (lesson.disabilityTypes?.includes('ADHD')) {
        info('ADHD Focus Mode Active', 'We enabled short steps and focus timers for you.');
      } else if (lesson.disabilityTypes?.includes('DYSLEXIA')) {
        info('Dyslexia Support Active', 'Text is optimised for reading ease.');
      } else if (lesson.disabilityTypes?.includes('AUTISM')) {
        info('structured Learning Active', 'Clear, predictable steps enabled.');
      }
    }
  }, [lesson, isLoading]);

  async function loadLesson() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/learner/lessons/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load lesson');
      }

      const data = await response.json();

      if (!data.success || !data.lesson) {
        throw new Error(data.message || 'Lesson not found');
      }

      // Map backend Lesson type to LessonData interface
      const backendLesson = data.lesson;
      const mappedLesson: LessonData = {
        id: backendLesson.id,
        title: backendLesson.title,
        description: backendLesson.description || '',
        duration: backendLesson.estimatedDuration || 15,
        competencies: backendLesson.competencies || [],
        disabilityTypes: backendLesson.disabilityTypes || [],
        sections: backendLesson.steps.map((step: any) => ({
          id: step.id,
          type: step.stepType,
          title: step.title,
          content: step.content || {},
        })),
      };
      setLesson(mappedLesson);
    } catch (error) {
      console.error('Error loading lesson:', error);
      alert('Failed to load lesson. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleNext() {
    if (lesson && currentSectionIndex < lesson.sections.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      if (videoRef.current) videoRef.current.pause();
    } else {
      // Lesson complete
      handleLessonComplete();
    }
  }

  function handlePrevious() {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
      setIsPlaying(false);
    }
  }

  async function saveProgress() {
    if (!lesson || isSavingProgress) return;

    try {
      setIsSavingProgress(true);
      const response = await fetch(`/api/learner/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentSection: currentSectionIndex,
          totalSections: lesson.sections.length,
          timeSpent: elapsedTime,
          score,
          answers: userAnswers,
        }),
      });

      if (!response.ok) {
        console.error('Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsSavingProgress(false);
    }
  }

  async function handleLessonComplete() {
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score based on correct answers
    const totalExercises = lesson?.sections.filter(s => s.type === 'exercise' || s.type === 'speech').length || 1;
    const correctAnswers = Object.values(feedback).filter(f => f.correct).length;
    const finalScore = Math.round((correctAnswers / totalExercises) * 100);

    // Save final progress
    await saveProgress();

    // Mark lesson as complete
    try {
      await fetch(`/api/learner/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          score: finalScore,
          duration: elapsedTime,
          sectionsCompleted: lesson?.sections.length,
        }),
      });
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }

    // Redirect to completion page
    router.push(`/learner/lessons/${lessonId}/complete`);
  }

  function handleExerciseSubmit(sectionId: string, answer: string) {
    const section = lesson?.sections.find(s => s.id === sectionId);
    if (!section || !section.content.exercise) return;

    const isCorrect = answer === section.content.exercise.correctAnswer;

    setFeedback({
      ...feedback,
      [sectionId]: {
        correct: isCorrect,
        message: isCorrect
          ? '✨ Excellent work! You got it!'
          : `Good effort! Let's try that again. Remember: ${section.content.exercise.correctAnswer}`,
      },
    });

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  }

  function handleCorrectAnswer(sectionId: string) {
    setFeedback({
      ...feedback,
      [sectionId]: {
        correct: true,
        message: '✨ Excellent work! You got it!',
      },
    });
    setScore((prev) => prev + 1);
  }

  function togglePlayPause() {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  function changePlaybackSpeed() {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);

    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
    if (videoRef.current) videoRef.current.playbackRate = nextSpeed;
  }

  // Speech recognition refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  async function startSpeechRecognition() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await evaluateSpeech(audioBlob);

        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setSpeechFeedback('Listening... Speak clearly!');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setSpeechFeedback('Error: Could not access microphone.');
    }
  }

  function stopSpeechRecognition() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setSpeechFeedback('Processing your pronunciation...');
    }
  }

  async function evaluateSpeech(audioBlob: Blob) {
    const currentSection = lesson?.sections[currentSectionIndex];
    if (!currentSection || !currentSection.content.exercise) return;

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('expectedText', currentSection.content.exercise.correctAnswer || '');
      formData.append('language', preferences.speechRecLang || 'es-ES');

      const response = await fetch('/api/ml/pronunciation/evaluate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.data) {
        const result = data.data;
        const score = Math.round(result.overall_score);

        setSpeechFeedback(`Score: ${score}% - ${result.feedback}`);

        if (score >= 70) {
          setFeedback({
            ...feedback,
            [currentSection.id]: {
              correct: true,
              message: `✓ Excellent! Pronunciation score: ${score}%`,
            },
          });
          setScore((prev) => prev + 1);
        } else {
          setFeedback({
            ...feedback,
            [currentSection.id]: {
              correct: false,
              message: `Keep practicing! You said: "${result.spoken_text}". Try to match: "${result.expected_text}"`,
            },
          });
        }
      } else {
        throw new Error(data.message || 'Evaluation failed');
      }
    } catch (error) {
      console.error('Error evaluating speech:', error);
      setSpeechFeedback('Sorry, evaluation failed. Please try again.');
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f1eb]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#9db4a0] border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f1eb]">
        <div className="text-center">
          <p className="text-lg text-gray-600">Lesson not found</p>
        </div>
      </div>
    );
  }

  const currentSection = lesson.sections[currentSectionIndex];
  const progress = ((currentSectionIndex + 1) / lesson.sections.length) * 100;

  return (
    <div
      className="min-h-screen bg-[#f5f1eb]"
      style={{
        fontSize: `${preferences.fontSize}px`,
        fontFamily: preferences.fontFamily === 'lexend' ? 'Lexend' :
          preferences.fontFamily === 'opendyslexic' ? 'OpenDyslexic' :
            preferences.fontFamily === 'atkinson' ? 'Atkinson Hyperlegible' : 'system-ui',
      }}
    >
      {/* Header with Progress */}
      <header className="bg-white border-b-2 border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
              </div>
              {isSavingProgress && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Save className="w-4 h-4 animate-pulse" />
                  <span>Saving...</span>
                </div>
              )}
              {!preferences.adhdMode && (
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <Subtitles className="w-5 h-5" />
                  Transcripts
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="bg-[#9db4a0] h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Section {currentSectionIndex + 1} of {lesson.sections.length}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Autism: Visual Schedule */}
        {isAutismMode && (
          <VisualSchedule
            sections={lesson.sections}
            currentIndex={currentSectionIndex}
          />
        )}

        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-between">
            <span>{currentSection.title}</span>
            {/* TTS Control for Text Sections */}
            {currentSection.type === 'text' && (
              <InlineTextToSpeech text={currentSection.content.text || ''} />
            )}
          </h2>
          {/* Active Mode Badge */}
          {isAdhdMode && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Clock className="w-5 h-5 text-yellow-700" />
              </div>
              <div>
                <p className="font-bold text-yellow-900 text-sm">Focus Mode Active</p>
                <p className="text-xs text-yellow-800">
                  Estimated time: {Math.ceil(lesson.duration / lesson.sections.length)} min/step
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section Content */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          {/* APD / Dyslexia Helper: Full Audio Player for Text */}
          {(isApdMode || isDyslexiaMode) && currentSection.type === 'text' && (
            <div className="mb-6 p-4 bg-[#f0f4f0] rounded-xl border border-[#d4dcd5]">
              <p className="text-xs font-semibold text-[#5d7e61] mb-2 uppercase tracking-wide">
                Audio Support Enabled
              </p>
              <TextToSpeech
                text={currentSection.content.text || ''}
                autoHighlight={true}
                onHighlight={setHighlightIndex}
              />
            </div>
          )}

          {/* TEXT SECTION */}
          {currentSection.type === 'text' && (
            <div
              style={{
                lineHeight: preferences.lineSpacing,
                letterSpacing: `${preferences.letterSpacing}em`,
              }}
            >
              {isAdhdMode ? (
                /* ── ADHD mode: one sentence at a time ── */
                (() => {
                  const allText = currentSection.content.text || '';
                  // Split into sentences (keep punctuation)
                  const sentences = allText
                    .split(/(?<=[.!?]\s+)|(?<=[.!?]$)/)
                    .map(s => s.trim())
                    .filter(Boolean);
                  const total = sentences.length;
                  const active = Math.min(activeSentenceIdx, total - 1);

                  return (
                    <div>
                      {/* Sentence progress dots */}
                      {total > 1 && (
                        <div className="flex gap-1.5 mb-5 flex-wrap">
                          {sentences.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveSentenceIdx(i)}
                              className={`w-2 h-2 rounded-full transition-colors ${i === active ? 'bg-[#7a9b7e] scale-125' :
                                i < active ? 'bg-[#c5d9c7]' : 'bg-[#e8e5e0]'
                                }`}
                              aria-label={`Go to sentence ${i + 1}`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Active sentence — highlighted */}
                      <div
                        className="rounded-xl px-5 py-4 mb-4 transition-all"
                        style={{ background: '#fffbea', borderLeft: '3px solid #c4a44a' }}
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        <p className="text-[#2d2d2d] text-lg" style={{ lineHeight: '1.9' }}>
                          {sentences[active]}
                        </p>
                      </div>

                      {/* Sentence counter + nav */}
                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={() => setActiveSentenceIdx(i => Math.max(0, i - 1))}
                          disabled={active === 0}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-[#6b6b6b] bg-[#f5f3ef] hover:bg-[#ede9e3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" /> Prev
                        </button>
                        <span className="text-xs text-[#8a8a8a]">{active + 1} / {total}</span>
                        <button
                          onClick={() => setActiveSentenceIdx(i => Math.min(total - 1, i + 1))}
                          disabled={active === total - 1}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#7a9b7e] hover:bg-[#6b8c6f] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                /* ── Normal mode: all paragraphs with optional highlighting ── */
                <div className="prose prose-lg max-w-none text-[#2d2d2d]">
                  {(() => {
                    const text = currentSection.content.text || '';
                    if (highlightIndex === null) {
                      return text.split('\n').map((paragraph, idx) => (
                        <p key={idx} className="mb-4">{paragraph}</p>
                      ));
                    }

                    // Highlight logic: find word at highlightIndex
                    // We need to render segments before and after, preserving newlines
                    const markerIndex = highlightIndex;

                    // Find word boundaries (simple regex approx)
                    const after = text.slice(markerIndex);
                    const match = after.match(/^(\S+)/);
                    const wordLength = match ? match[0].length : 0;

                    const beforeText = text.slice(0, markerIndex);
                    const highlightedWord = text.slice(markerIndex, markerIndex + wordLength);
                    const afterText = text.slice(markerIndex + wordLength);

                    // Helper to render text with newlines as <p>
                    const renderSegment = (segmentText: string, keyPrefix: string) => {
                      return segmentText.split('\n').map((chunk, i, arr) => {
                        // If it's the last chunk, it's inline with the next element (highlight)
                        // But wait, splitting by \n means we get paragraphs.
                        // This is tricky to mix with inline highlighting span.
                        // SIMPLIFIED APPROACH: Just render text with <br/> for newlines inside a single wrapper? 
                        // No, prose expects <p>.
                        return chunk ? <span key={`${keyPrefix}-${i}`}>{chunk}{i < arr.length - 1 ? <br /> : ''}</span> : <br key={`${keyPrefix}-${i}`} />;
                      });
                    };

                    // Actually, keeping <p> structure is hard with cross-boundary highlighting.
                    // For Dyslexia mode, readability is key. <p> spacing matters.
                    // Let's assume TTS reads linear text.
                    // We will iterate paragraphs and find which one contains the index.

                    let currentIndex = 0;
                    return text.split('\n').map((paragraph, pIdx) => {
                      const pStart = currentIndex;
                      const pEnd = currentIndex + paragraph.length;
                      // +1 for the newline that was split away, unless last
                      currentIndex += paragraph.length + 1;

                      // Check if highlight is inside this paragraph
                      if (highlightIndex >= pStart && highlightIndex < pEnd) {
                        // The highlight is here!
                        const localIndex = highlightIndex - pStart;
                        const pBefore = paragraph.slice(0, localIndex);
                        const pafter = paragraph.slice(localIndex);
                        const pMatch = pafter.match(/^(\S+)/);
                        const pWord = pMatch ? pMatch[0] : '';
                        const pRest = paragraph.slice(localIndex + pWord.length);

                        return (
                          <p key={pIdx} className="mb-4">
                            {pBefore}
                            <mark className="bg-[#ffeb3b] rounded-sm px-0.5 text-black font-medium transition-all duration-300">
                              {pWord}
                            </mark>
                            {pRest}
                          </p>
                        );
                      }

                      return <p key={pIdx} className="mb-4">{paragraph}</p>;
                    });
                  })()}
                </div>
              )}
            </div>
          )}

          {/* AUDIO SECTION */}
          {currentSection.type === 'audio' && (
            <div>
              <div className="mb-6">
                <p className="text-lg text-gray-800 mb-4">
                  {currentSection.content.text}
                </p>
              </div>

              {/* Audio Player Controls */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <audio
                  ref={audioRef}
                  src={currentSection.content.audioUrl}
                  onEnded={() => setIsPlaying(false)}
                />

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
                      }
                    }}
                    className="p-3 bg-white rounded-full hover:bg-gray-100 border-2 border-gray-300"
                    aria-label="Rewind 5 seconds"
                  >
                    <SkipBack className="w-6 h-6" />
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className="p-6 bg-[#9db4a0] hover:bg-[#8ca394] text-white rounded-full"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </button>

                  <button
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
                      }
                    }}
                    className="p-3 bg-white rounded-full hover:bg-gray-100 border-2 border-gray-300"
                    aria-label="Forward 5 seconds"
                  >
                    <SkipForward className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-3 bg-white rounded-full hover:bg-gray-100 border-2 border-gray-300"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={changePlaybackSpeed}
                    className="px-4 py-2 bg-white rounded-full hover:bg-gray-100 border-2 border-gray-300 font-semibold"
                    aria-label={`Playback speed ${playbackSpeed}x`}
                  >
                    {playbackSpeed}x
                  </button>
                </div>
              </div>

              {/* Transcript */}
              {showTranscript && currentSection.content.transcript && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Transcript
                  </h3>
                  <p className="text-gray-800" style={{ lineHeight: preferences.lineSpacing }}>
                    {currentSection.content.transcript}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* VIDEO SECTION */}
          {currentSection.type === 'video' && (
            <div>
              <div className="mb-4">
                <p className="text-lg text-gray-800">
                  {currentSection.content.transcript}
                </p>
              </div>

              <div className="relative bg-black rounded-2xl overflow-hidden">
                <video
                  ref={videoRef}
                  src={currentSection.content.videoUrl}
                  className="w-full"
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <track kind="captions" src="/captions/greeting-conversation.vtt" srcLang="en" label="English" default />
                </video>
              </div>
            </div>
          )}

          {/* EXERCISE SECTION */}
          {currentSection.type === 'exercise' && currentSection.content.exercise && (
            <div>
              {currentSection.content.exercise.type === 'multiple-choice' && (
                <MultipleChoice
                  question={currentSection.content.exercise.question}
                  options={currentSection.content.exercise.options || []}
                  correctAnswer={currentSection.content.exercise.correctAnswer || ''}
                  onAnswer={(correct) => {
                    if (correct) {
                      handleCorrectAnswer(currentSection.id);
                    }
                  }}
                  allowMultipleAttempts={true}
                />
              )}

              {currentSection.content.exercise.type === 'fill-blank' && (
                <FillInBlank
                  sentence={currentSection.content.exercise.question}
                  correctAnswer={currentSection.content.exercise.correctAnswer || ''}
                  hints={[
                    'Think about the context of the sentence',
                    'What word would make the most sense here?',
                  ]}
                  onCorrect={() => handleCorrectAnswer(currentSection.id)}
                  acceptPhonetic={true}
                />
              )}
            </div>
          )}

          {/* SPEECH RECOGNITION SECTION */}
          {currentSection.type === 'speech' && (
            <div className="text-center"
              style={{
                fontSize: `${preferences.fontSize}px`,
                fontFamily: preferences.fontFamily === 'lexend' ? 'Lexend' :
                  preferences.fontFamily === 'opendyslexic' ? 'OpenDyslexic' :
                    preferences.fontFamily === 'atkinson' ? '"Atkinson Hyperlegible"' : 'system-ui',
              }}
            >
              <p className="text-xl text-gray-800 mb-8">
                {currentSection.content.text}
              </p>

              <div className="mb-8">
                <button
                  onClick={isRecording ? stopSpeechRecognition : startSpeechRecognition}
                  className={`p-12 rounded-full ${isRecording
                    ? 'bg-red-500 animate-pulse'
                    : 'bg-[#9db4a0] hover:bg-[#8ca394]'
                    } text-white transition-all`}
                  aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  <Mic className="w-16 h-16" />
                </button>
              </div>

              {speechFeedback && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                  <p className="text-lg text-blue-900">{speechFeedback}</p>
                </div>
              )}

              {feedback[currentSection.id] && (
                <div className="mt-6 bg-green-50 border-2 border-green-500 rounded-2xl p-6">
                  <p className="text-lg font-medium text-green-900">
                    {feedback[currentSection.id].message}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentSectionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-[#9db4a0] hover:bg-[#8ca394] text-white rounded-full font-medium"
          >
            {currentSectionIndex === lesson.sections.length - 1 ? 'Complete Lesson' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
