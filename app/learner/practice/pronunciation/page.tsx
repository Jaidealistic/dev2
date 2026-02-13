/**
 * PRONUNCIATION PRACTICE PAGE
 * 
 * Speech recognition-based pronunciation practice with:
 * - Microphone recording via Web Speech API
 * - Visual feedback on pronunciation accuracy
 * - Phoneme-level practice
 * - Disability-aware scoring (dyslexia, APD friendly)
 * - Word and sentence practice modes
 * 
 * Accessibility: WCAG AAA compliant
 */

'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { AccessibilityToolbar } from '@/components/AccessibilityToolbar';
import {
  Mic,
  MicOff,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Volume2,
  CheckCircle,
  Star,
  AlertCircle,
} from 'lucide-react';

interface PracticeWord {
  id: string;
  word: string;
  phonetic: string;
  translation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  audioHint?: string;
  category: string;
}

// Sample practice words (in production, these come from the API)
const PRACTICE_WORDS: PracticeWord[] = [
  { id: '1', word: 'Hello', phonetic: '/həˈloʊ/', difficulty: 'easy', category: 'Greetings' },
  { id: '2', word: 'Thank you', phonetic: '/θæŋk juː/', difficulty: 'easy', category: 'Greetings' },
  { id: '3', word: 'Good morning', phonetic: '/ɡʊd ˈmɔːrnɪŋ/', difficulty: 'easy', category: 'Greetings' },
  { id: '4', word: 'How are you?', phonetic: '/haʊ ɑːr juː/', difficulty: 'easy', category: 'Conversation' },
  { id: '5', word: 'My name is', phonetic: '/maɪ neɪm ɪz/', difficulty: 'easy', category: 'Introduction' },
  { id: '6', word: 'Beautiful', phonetic: '/ˈbjuːtɪfəl/', difficulty: 'medium', category: 'Adjectives' },
  { id: '7', word: 'Comfortable', phonetic: '/ˈkʌmftəbəl/', difficulty: 'medium', category: 'Adjectives' },
  { id: '8', word: 'Restaurant', phonetic: '/ˈrestərɒnt/', difficulty: 'medium', category: 'Places' },
  { id: '9', word: 'Library', phonetic: '/ˈlaɪbrəri/', difficulty: 'medium', category: 'Places' },
  { id: '10', word: 'Pronunciation', phonetic: '/prəˌnʌnsiˈeɪʃən/', difficulty: 'hard', category: 'Academic' },
  { id: '11', word: 'Extraordinary', phonetic: '/ɪkˈstrɔːrdɪneri/', difficulty: 'hard', category: 'Adjectives' },
  { id: '12', word: 'Enthusiasm', phonetic: '/ɪnˈθjuːziæzəm/', difficulty: 'hard', category: 'Emotions' },
];

type PracticeMode = 'words' | 'sentences' | 'phonemes';
type Difficulty = 'easy' | 'medium' | 'hard' | 'all';

export default function PronunciationPracticePage() {
  const [isSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'close' | 'tryagain' | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [practiceHistory, setPracticeHistory] = useState<Array<{ word: string; score: number; correct: boolean }>>([]);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Filter words by difficulty
  const filteredWords = difficulty === 'all'
    ? PRACTICE_WORDS
    : PRACTICE_WORDS.filter(w => w.difficulty === difficulty);

  const currentWord = filteredWords[currentWordIndex] || filteredWords[0];

  async function startRecording() {
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
        await evaluatePronunciation(audioBlob, currentWord.word);

        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTranscript('');
      setScore(null);
      setFeedback('Listening... Speak the word clearly!');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setFeedback('Please allow microphone access to use pronunciation practice.');
      setFeedbackType('tryagain');
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setFeedback('Analyzing your pronunciation...');
    }
  }

  async function evaluatePronunciation(audioBlob: Blob, target: string) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('expectedText', target);
      formData.append('language', 'en-US'); // Practice words are currently English

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

        setScore(score);
        setTranscript(result.spoken_text);
        setTotalAttempts(prev => prev + 1);
        setFeedback(result.feedback);

        if (score >= 90) {
          setFeedbackType('success');
          setCorrectAttempts(prev => prev + 1);
          setPracticeHistory(prev => [...prev, { word: target, score: score, correct: true }]);
        } else if (score >= 70) {
          setFeedbackType('close');
          setPracticeHistory(prev => [...prev, { word: target, score: score, correct: true }]);
          setCorrectAttempts(prev => prev + 1);
        } else {
          setFeedbackType('tryagain');
          setPracticeHistory(prev => [...prev, { word: target, score: score, correct: false }]);
        }
      } else {
        throw new Error(data.message || 'Evaluation failed');
      }
    } catch (error) {
      console.error('Error evaluating pronunciation:', error);
      setFeedback('Sorry, the AI scoring service is unavailable. Please try again later.');
      setFeedbackType('tryagain');
    }
  }

  function nextWord() {
    setCurrentWordIndex(prev => (prev + 1) % filteredWords.length);
    setTranscript('');
    setScore(null);
    setFeedback('');
    setFeedbackType(null);
  }

  function prevWord() {
    setCurrentWordIndex(prev => (prev - 1 + filteredWords.length) % filteredWords.length);
    setTranscript('');
    setScore(null);
    setFeedback('');
    setFeedbackType(null);
  }

  function speakWord() {
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  }

  function resetPractice() {
    setCurrentWordIndex(0);
    setTranscript('');
    setScore(null);
    setFeedback('');
    setFeedbackType(null);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setPracticeHistory([]);
  }

  const accuracyRate = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f5f1eb]">
      {/* Header */}
      <header role="banner" className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">Lexfix</Link>
          <nav role="navigation" aria-label="Main navigation" className="flex gap-6">
            <Link href="/learner/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</Link>
            <Link href="/learner/lessons" className="text-gray-700 hover:text-gray-900 font-medium">My Lessons</Link>
            <Link href="/learner/progress" className="text-gray-700 hover:text-gray-900 font-medium">Progress</Link>
            <Link href="/learner/settings" className="text-gray-700 hover:text-gray-900 font-medium">Settings</Link>
            <Link href="/logout" className="text-gray-700 hover:text-gray-900 font-medium">Logout</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8" role="main">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/learner/dashboard" className="p-2 rounded-full hover:bg-gray-200" aria-label="Back to dashboard">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Mic className="w-8 h-8 text-[#9db4a0]" />
              Pronunciation Practice
            </h1>
            <p className="text-gray-600 mt-1">Practice speaking and improve your pronunciation</p>
          </div>
        </div>

        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-bold text-yellow-900 mb-1">Speech Recognition Not Available</h2>
                <p className="text-yellow-800">
                  Your browser doesn&apos;t support the Web Speech API. Please use Google Chrome or Microsoft Edge for the best experience.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Difficulty Selection */}
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">Difficulty:</span>
              {(['easy', 'medium', 'hard', 'all'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => { setDifficulty(d); setCurrentWordIndex(0); setTranscript(''); setScore(null); setFeedback(''); setFeedbackType(null); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${difficulty === d
                    ? 'bg-[#9db4a0] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Session Stats */}
            <div className="flex items-center gap-6 text-sm">
              <span className="text-gray-600">
                Attempts: <strong className="text-gray-900">{totalAttempts}</strong>
              </span>
              <span className="text-gray-600">
                Correct: <strong className="text-green-600">{correctAttempts}</strong>
              </span>
              <span className="text-gray-600">
                Accuracy: <strong className={accuracyRate >= 70 ? 'text-green-600' : 'text-orange-600'}>{accuracyRate}%</strong>
              </span>
              <button
                onClick={resetPractice}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Practice Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Practice Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              {/* Word Display */}
              <div className="bg-gradient-to-r from-[#9db4a0] to-[#6b9d6b] p-8 text-white text-center">
                <p className="text-sm font-medium opacity-80 mb-2">
                  {currentWord.category} &bull; Word {currentWordIndex + 1} of {filteredWords.length}
                </p>
                <h2 className="text-5xl font-bold mb-3">{currentWord.word}</h2>
                <p className="text-xl opacity-90 font-mono">{currentWord.phonetic}</p>

                {/* Listen Button */}
                <button
                  onClick={speakWord}
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full text-white font-medium transition-colors"
                  aria-label={`Listen to pronunciation of ${currentWord.word}`}
                >
                  <Volume2 className="w-5 h-5" />
                  Listen
                </button>
              </div>

              {/* Recording Controls */}
              <div className="p-8 text-center">
                {/* Microphone Button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={!isSupported}
                  className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all ${isRecording
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-200'
                    : 'bg-[#9db4a0] hover:bg-[#8ca394] shadow-lg shadow-green-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {isRecording ? (
                    <MicOff className="w-10 h-10 text-white" />
                  ) : (
                    <Mic className="w-10 h-10 text-white" />
                  )}
                </button>

                <p className="text-gray-600 mb-4">
                  {isRecording ? '🎙️ Listening... Speak now!' : 'Tap the microphone and say the word'}
                </p>

                {/* Transcript Display */}
                {transcript && (
                  <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <p className="text-sm text-gray-500 mb-1">You said:</p>
                    <p className="text-2xl font-bold text-gray-900">&ldquo;{transcript}&rdquo;</p>
                  </div>
                )}

                {/* Score Display */}
                {score !== null && (
                  <div className={`rounded-2xl p-4 mb-4 ${score >= 90 ? 'bg-green-50 border-2 border-green-300' :
                    score >= 70 ? 'bg-blue-50 border-2 border-blue-300' :
                      'bg-orange-50 border-2 border-orange-300'
                    }`}>
                    <div className="flex items-center justify-center gap-3 mb-2">
                      {score >= 90 ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : score >= 70 ? (
                        <Star className="w-8 h-8 text-blue-600" />
                      ) : (
                        <RotateCcw className="w-8 h-8 text-orange-600" />
                      )}
                      <span className={`text-4xl font-bold ${score >= 90 ? 'text-green-600' :
                        score >= 70 ? 'text-blue-600' :
                          'text-orange-600'
                        }`}>
                        {score}%
                      </span>
                    </div>
                    <p className={`text-lg ${feedbackType === 'success' ? 'text-green-800' :
                      feedbackType === 'close' ? 'text-blue-800' :
                        'text-orange-800'
                      }`}>
                      {feedback}
                    </p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={prevWord}
                    className="flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Previous
                  </button>
                  <span className="text-gray-500 font-medium">
                    {currentWordIndex + 1} / {filteredWords.length}
                  </span>
                  <button
                    onClick={nextWord}
                    className="flex items-center gap-2 px-5 py-3 bg-[#9db4a0] hover:bg-[#8ca394] text-white rounded-full font-medium"
                  >
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Practice History */}
          <aside className="space-y-6">
            {/* Tips Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                💡 Pronunciation Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#9db4a0] font-bold">1.</span>
                  Listen to the word first by clicking the &ldquo;Listen&rdquo; button
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9db4a0] font-bold">2.</span>
                  Speak clearly and at a natural pace
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9db4a0] font-bold">3.</span>
                  Focus on individual sounds (phonemes)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9db4a0] font-bold">4.</span>
                  Don&apos;t worry about perfection — practice makes progress!
                </li>
              </ul>
            </div>

            {/* Recent Practice History */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Recent Attempts</h3>
              {practiceHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">No attempts yet. Start practicing!</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {[...practiceHistory].reverse().slice(0, 10).map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-2">
                        {entry.correct ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <RotateCcw className="w-4 h-4 text-orange-500" />
                        )}
                        <span className="text-sm font-medium text-gray-900">{entry.word}</span>
                      </div>
                      <span className={`text-sm font-bold ${entry.score >= 90 ? 'text-green-600' :
                        entry.score >= 70 ? 'text-blue-600' :
                          'text-orange-600'
                        }`}>
                        {entry.score}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <AccessibilityToolbar />
    </div>
  );
}
