/**
 * ENHANCED LEARNER ONBOARDING PAGE
 * 
 * Multi-step onboarding wizard:
 * 1. Welcome
 * 2. Profile (with English & Tamil language selection)
 * 3. Learning Needs (disabilities, IEP)
 * 4. Accessibility Preferences
 * 5. Quick Assessment
 * 6. Review & Confirm
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check, BookOpen, User, Accessibility, Brain, ClipboardCheck, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  saveLearnerOnboarding,
  submitAssessment as apiSubmitAssessment,
  generateLearningPath as apiGenerateLearningPath,
  updateAccessibilityPrefs,
} from '@/lib/api';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface LanguageGoals {
  confidenceLevel: string;
  learningGoal: string;
  preferredStyle: string;
  weeklyHours: string;
}

interface FormData {
  dateOfBirth: string;
  gradeLevel: string;
  schoolName: string;
  nativeLanguage: string;
  learningLanguages: string[];
  languageGoals: Record<string, LanguageGoals>;
  disabilities: string[];
  iepGoals: string;
  fontFamily: string;
  textSize: number;
  lineSpacing: number;
  colorScheme: 'light' | 'dark' | 'high-contrast';
  captionsEnabled: boolean;
  speechRecognitionEnabled: boolean;
  reducedMotion: boolean;
  assessmentAnswers: Record<string, string>;
  placementLevel: string | null;
}

const assessmentQuestions = [
  {
    id: 'q1',
    question: 'What is your confidence level with the language you want to learn?',
    options: [
      { id: 'o1', text: 'Complete beginner — I know almost nothing' },
      { id: 'o2', text: 'Basic — I know a few words and phrases' },
      { id: 'o3', text: 'Intermediate — I can hold simple conversations' },
      { id: 'o4', text: 'Advanced — I can understand complex topics' },
    ],
  },
  {
    id: 'q2',
    question: 'How many hours per week can you dedicate to learning?',
    options: [
      { id: 'o1', text: '1–2 hours' },
      { id: 'o2', text: '3–5 hours' },
      { id: 'o3', text: '5–10 hours' },
      { id: 'o4', text: '10+ hours' },
    ],
  },
  {
    id: 'q3',
    question: 'What is your primary learning goal?',
    options: [
      { id: 'o1', text: 'Just for fun and personal interest' },
      { id: 'o2', text: 'Improve grades in school' },
      { id: 'o3', text: 'Prepare for an exam or certification' },
      { id: 'o4', text: 'Career or professional growth' },
    ],
  },
  {
    id: 'q4',
    question: 'How do you learn best?',
    options: [
      { id: 'o1', text: 'Listening to audio and watching videos' },
      { id: 'o2', text: 'Reading and writing exercises' },
      { id: 'o3', text: 'Speaking and interacting with others' },
      { id: 'o4', text: 'A balanced mix of everything' },
    ],
  },
];

const fontFamilyMap: Record<string, string> = {
  default: 'var(--font-lexend), sans-serif',
  atkinson: 'Atkinson Hyperlegible, sans-serif',
  arial: 'Arial, sans-serif',
  georgia: 'Georgia, serif',
};

const stepConfig = [
  { label: 'Welcome', icon: Sparkles },
  { label: 'Profile', icon: User },
  { label: 'Languages', icon: BookOpen },
  { label: 'Needs', icon: Accessibility },
  { label: 'Preferences', icon: BookOpen },
  { label: 'Assessment', icon: Brain },
  { label: 'Review', icon: ClipboardCheck },
];

const languageCards = [
  {
    key: 'English',
    label: 'English',
    native: 'English',
    flag: '🇬🇧',
    description: 'Global lingua franca — reading, writing, and conversation skills',
    color: 'from-[#7da47f] to-[#5a8c5c]',
    lightBg: 'bg-[#f0f7f0] border-[#c5d8c7]',
    selectedBg: 'bg-[#e0ede1] border-[#7da47f] ring-2 ring-[#9db4a0]',
  },
  {
    key: 'Tamil',
    label: 'Tamil',
    native: 'தமிழ்',
    flag: '🇮🇳',
    description: 'Classical Dravidian language with rich literary tradition',
    color: 'from-orange-500 to-red-600',
    lightBg: 'bg-orange-50 border-orange-200',
    selectedBg: 'bg-orange-100 border-orange-500 ring-2 ring-orange-300',
  },
];

export default function EnhancedOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    dateOfBirth: '',
    gradeLevel: '',
    schoolName: '',
    nativeLanguage: '',
    learningLanguages: [],
    languageGoals: {},
    disabilities: [],
    iepGoals: '',
    fontFamily: 'default',
    textSize: 16,
    lineSpacing: 1.5,
    colorScheme: 'light',
    captionsEnabled: true,
    speechRecognitionEnabled: false,
    reducedMotion: false,
    assessmentAnswers: {},
    placementLevel: null,
  });

  const totalSteps = 7;

  const handleNext = async () => {
    if (currentStep === 6) {
      await submitAssessment();
    } else if (currentStep < totalSteps) {
      // When moving from step 2 to 3, initialise languageGoals for each chosen language
      if (currentStep === 2) {
        const newGoals = { ...formData.languageGoals };
        formData.learningLanguages.forEach(lang => {
          if (!newGoals[lang]) {
            newGoals[lang] = { confidenceLevel: '', learningGoal: '', preferredStyle: '', weeklyHours: '' };
          }
        });
        // Remove any deselected languages
        Object.keys(newGoals).forEach(k => {
          if (!formData.learningLanguages.includes(k)) delete newGoals[k];
        });
        setFormData(prev => ({ ...prev, languageGoals: newGoals }));
      }
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const updateLanguageGoal = (lang: string, field: keyof LanguageGoals, value: string) => {
    setFormData(prev => ({
      ...prev,
      languageGoals: {
        ...prev.languageGoals,
        [lang]: { ...(prev.languageGoals[lang] || { confidenceLevel: '', learningGoal: '', preferredStyle: '', weeklyHours: '' }), [field]: value },
      },
    }));
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const submitAssessment = async () => {
    try {
      setIsLoading(true);
      const result = await apiSubmitAssessment({ answers: formData.assessmentAnswers });

      if (!result.assessment) throw new Error(result.error || 'Failed to submit assessment');

      setFormData(prev => ({ ...prev, placementLevel: result.assessment.placementLevel }));
      setCurrentStep(7);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);

      const pathRes = await apiGenerateLearningPath({
        placementLevel: formData.placementLevel,
        learningLanguages: formData.learningLanguages,
        disabilities: formData.disabilities,
      });

      if (!pathRes.success) throw new Error(pathRes.error || 'Failed to generate learning path');

      // Save accessibility preferences
      await updateAccessibilityPrefs({
        fontFamily: formData.fontFamily,
        textSize: formData.textSize,
        lineSpacing: formData.lineSpacing,
        colorScheme: formData.colorScheme,
        captionsEnabled: formData.captionsEnabled,
        speechRecognitionEnabled: formData.speechRecognitionEnabled,
        reducedMotion: formData.reducedMotion,
      });

      // Save onboarding data (profile, languages, disabilities) and mark complete
      const onbRes = await saveLearnerOnboarding({
        nativeLanguage: formData.nativeLanguage,
        learningLanguages: formData.learningLanguages,
        languageGoals: formData.languageGoals,
        gradeLevel: formData.gradeLevel,
        disabilities: formData.disabilities,
        accessibility: {
          fontFamily: formData.fontFamily,
          textSize: formData.textSize,
          lineSpacing: formData.lineSpacing,
          colorScheme: formData.colorScheme,
          captionsEnabled: formData.captionsEnabled,
          speechRecognitionEnabled: formData.speechRecognitionEnabled,
          reducedMotion: formData.reducedMotion,
        },
      });

      if (onbRes.success && onbRes.data?.studentId) {
        // Show studentId briefly before redirect
        alert(`Your Student ID is: ${onbRes.data.studentId}\n\nSave this! Your parent will need it to link their account.`);
      }

      router.push('/learner/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Failed to complete onboarding. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'disabilities' | 'learningLanguages', item: string) => {
    setFormData(prev => {
      const array = prev[field];
      if (field === 'disabilities' && item === 'none') {
        return { ...prev, [field]: [item] };
      }
      const newArray = array.includes(item)
        ? array.filter(i => i !== item)
        : array.filter(i => i !== 'none').concat(item);
      return { ...prev, [field]: newArray };
    });
  };

  const isDark = formData.colorScheme === 'dark';
  const isHC = formData.colorScheme === 'high-contrast';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : isHC ? 'bg-black' : 'bg-gradient-to-br from-[#f8f6f2] via-[#f0ede6] to-[#e8e4db]'
      }`}>
      {/* Header */}
      <header className="container mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Lexfix
          </span>
        </Link>
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Step {currentStep} of {totalSteps}
        </span>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-4 sm:px-6 py-6 pb-24">
        <div className="w-full max-w-2xl">
          {/* Progress Stepper */}
          <div className="mb-8">
            {/* Progress bar */}
            <div className={`w-full rounded-full h-1.5 mb-6 ${isDark ? 'bg-gray-800' : 'bg-gray-200/80'}`}>
              <div
                className="bg-gradient-to-r from-[#7da47f] to-[#5a8c5c] h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                role="progressbar"
                aria-valuenow={currentStep}
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                aria-label={`Step ${currentStep} of ${totalSteps}`}
              />
            </div>
            {/* Step indicators */}
            <div className="flex justify-between">
              {stepConfig.map((step, i) => {
                const stepNum = i + 1;
                const StepIcon = step.icon;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;
                return (
                  <div key={stepNum} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isCompleted
                        ? 'bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] text-white shadow-md shadow-green-200/50'
                        : isActive
                          ? `${isDark ? 'bg-gray-800 text-[#7da47f] ring-2 ring-[#7da47f]' : 'bg-white text-[#5a8c5c] ring-2 ring-[#7da47f] shadow-lg shadow-green-100'}`
                          : `${isDark ? 'bg-gray-800/50 text-gray-600' : 'bg-gray-100 text-gray-400'}`
                        }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                    </div>
                    <span className={`hidden sm:block text-[11px] font-medium ${isActive ? (isDark ? 'text-white' : 'text-gray-900') :
                      isCompleted ? (isDark ? 'text-green-400' : 'text-[#5a8c5c]') :
                        (isDark ? 'text-gray-600' : 'text-gray-400')
                      }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content Card */}
          <div className={`rounded-2xl p-6 sm:p-8 shadow-xl transition-all duration-300 ${isDark ? 'bg-gray-900 border border-gray-800' :
            isHC ? 'bg-gray-900 border-2 border-yellow-400' :
              'bg-white/90 backdrop-blur-sm border border-white/60'
            }`}>

            {/* ──── Step 1: Welcome ──── */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] mb-5 shadow-lg shadow-green-200/40">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className={`text-3xl sm:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Welcome to Lexfix!
                  </h1>
                  <p className={`text-lg max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Let&apos;s set up your personalised learning experience. This takes about 2 minutes.
                  </p>
                </div>

                <div className="space-y-3 max-w-md mx-auto">
                  {[
                    { icon: '👤', title: 'Tell us about yourself', desc: 'Basic info and language preferences', color: 'from-[#7da47f]/10 to-[#5a8c5c]/10 border-[#c5d8c7]/60' },
                    { icon: '🧠', title: 'Share your learning needs', desc: 'Optional — helps us support you better', color: 'from-[#9db4a0]/10 to-[#7da47f]/10 border-[#c5d8c7]/60' },
                    { icon: '🎨', title: 'Choose your preferences', desc: 'Fonts, colors, and accessibility', color: 'from-amber-500/10 to-orange-500/10 border-amber-200/60' },
                    { icon: '📝', title: 'Quick assessment', desc: 'Find your perfect starting level', color: 'from-green-500/10 to-emerald-500/10 border-green-200/60' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${isDark ? 'bg-gray-800/50 border-gray-700' : `bg-gradient-to-r ${item.color}`
                        }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ──── Step 2: Learner Profile ──── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Your Profile
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Help us personalise your learning journey
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#7da47f] ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                        }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Grade Level
                    </label>
                    <select
                      value={formData.gradeLevel}
                      onChange={(e) => updateFormData('gradeLevel', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#7da47f] ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                        }`}
                    >
                      <option value="">Select grade level</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1)}>{i + 1}{['st', 'nd', 'rd'][i] || 'th'} Grade</option>
                      ))}
                      <option value="college">College</option>
                      <option value="adult">Adult Learner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    School Name <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => updateFormData('schoolName', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#7da47f] ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    placeholder="Enter your school name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Native Language
                  </label>
                  <select
                    value={formData.nativeLanguage}
                    onChange={(e) => updateFormData('nativeLanguage', e.target.value)}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#7da47f] ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                      }`}
                  >
                    <option value="">Select your native language</option>
                    <option value="english">English</option>
                    <option value="tamil">Tamil (தமிழ்)</option>
                  </select>
                </div>

                {/* Language Selection Cards */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Which language(s) do you want to learn?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {languageCards.map((lang) => {
                      const isSelected = formData.learningLanguages.includes(lang.key);
                      return (
                        <button
                          key={lang.key}
                          onClick={() => toggleArrayItem('learningLanguages', lang.key)}
                          className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.02] ${isSelected
                            ? (isDark ? 'bg-gray-800 border-[#7da47f] ring-2 ring-[#7da47f]/30' : lang.selectedBg)
                            : (isDark ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' : `${lang.lightBg} hover:shadow-md`)
                            }`}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </div>
                          )}
                          <span className="text-3xl mb-2 block">{lang.flag}</span>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {lang.label}
                            </span>
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {lang.native}
                            </span>
                          </div>
                          <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {lang.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ──── Step 3: Per-Language Goals ──── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Language Details
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Tell us about your goals for each language — this helps us personalise your journey.
                  </p>
                </div>

                {formData.learningLanguages.map((lang) => {
                  const langCard = languageCards.find(c => c.key === lang);
                  const goals = formData.languageGoals[lang] || { confidenceLevel: '', learningGoal: '', preferredStyle: '', weeklyHours: '' };

                  return (
                    <div
                      key={lang}
                      className={`p-5 rounded-2xl border-2 ${isDark
                        ? 'bg-gray-800/50 border-gray-700'
                        : lang === 'English'
                          ? 'bg-gradient-to-br from-[#f0f7f0] to-[#e8f0e8] border-[#c5d8c7]'
                          : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'
                        }`}
                    >
                      {/* Language header */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{langCard?.flag}</span>
                        <div>
                          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {lang}
                          </h3>
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            {langCard?.native}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Confidence Level */}
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Your confidence in {lang}
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'complete-beginner', label: 'Complete Beginner', emoji: '🌱' },
                              { value: 'basic', label: 'Know a Few Words', emoji: '📝' },
                              { value: 'intermediate', label: 'Can Hold Conversations', emoji: '💬' },
                              { value: 'advanced', label: 'Quite Confident', emoji: '⭐' },
                            ].map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => updateLanguageGoal(lang, 'confidenceLevel', opt.value)}
                                className={`relative p-3 rounded-xl border-2 text-left text-sm transition-all ${goals.confidenceLevel === opt.value
                                  ? (isDark ? 'border-[#7da47f] bg-[#7da47f]/20 ring-2 ring-[#7da47f]/40' : 'border-[#7da47f] bg-[#e8f5e9] shadow-md ring-2 ring-[#7da47f]/30')
                                  : (isDark ? 'border-gray-600 hover:border-gray-500 bg-gray-800/40' : 'border-gray-200 bg-white/60 hover:border-[#7da47f]/50 hover:shadow-sm')
                                  }`}
                              >
                                {goals.confidenceLevel === opt.value && (
                                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                                <span className="block mb-1">{opt.emoji}</span>
                                <span className={goals.confidenceLevel === opt.value ? (isDark ? 'text-white font-semibold' : 'text-gray-900 font-semibold') : (isDark ? 'text-gray-200' : 'text-gray-700')}>{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Learning Goal */}
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            What&apos;s your goal with {lang}?
                          </label>
                          <select
                            value={goals.learningGoal}
                            onChange={(e) => updateLanguageGoal(lang, 'learningGoal', e.target.value)}
                            className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7da47f] ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'
                              }`}
                          >
                            <option value="">Select a goal</option>
                            <option value="fun">Just for fun &amp; personal interest</option>
                            <option value="school">Improve in school</option>
                            <option value="exam">Prepare for an exam</option>
                            <option value="career">Career or professional growth</option>
                            <option value="connect">Connect with family or community</option>
                          </select>
                        </div>

                        {/* Preferred Style */}
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            How do you prefer to learn {lang}?
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'listening', label: 'Listening & Audio', emoji: '🎧' },
                              { value: 'reading', label: 'Reading & Writing', emoji: '📖' },
                              { value: 'speaking', label: 'Speaking & Practice', emoji: '🗣️' },
                              { value: 'mixed', label: 'Mix of Everything', emoji: '🔄' },
                            ].map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => updateLanguageGoal(lang, 'preferredStyle', opt.value)}
                                className={`relative p-3 rounded-xl border-2 text-left text-sm transition-all ${goals.preferredStyle === opt.value
                                  ? (isDark ? 'border-[#7da47f] bg-[#7da47f]/20 ring-2 ring-[#7da47f]/40' : 'border-[#7da47f] bg-[#e8f5e9] shadow-md ring-2 ring-[#7da47f]/30')
                                  : (isDark ? 'border-gray-600 hover:border-gray-500 bg-gray-800/40' : 'border-gray-200 bg-white/60 hover:border-[#7da47f]/50 hover:shadow-sm')
                                  }`}
                              >
                                {goals.preferredStyle === opt.value && (
                                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                                <span className="block mb-1">{opt.emoji}</span>
                                <span className={goals.preferredStyle === opt.value ? (isDark ? 'text-white font-semibold' : 'text-gray-900 font-semibold') : (isDark ? 'text-gray-200' : 'text-gray-700')}>{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Weekly Hours */}
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Hours per week for {lang}
                          </label>
                          <div className="flex gap-2">
                            {[
                              { value: '1-2', label: '1–2 hrs' },
                              { value: '3-5', label: '3–5 hrs' },
                              { value: '5-10', label: '5–10 hrs' },
                              { value: '10+', label: '10+ hrs' },
                            ].map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => updateLanguageGoal(lang, 'weeklyHours', opt.value)}
                                className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${goals.weeklyHours === opt.value
                                  ? (isDark ? 'border-[#7da47f] bg-[#7da47f]/20 text-white ring-2 ring-[#7da47f]/40' : 'border-[#7da47f] bg-[#e8f5e9] text-[#2d5a2f] shadow-md ring-2 ring-[#7da47f]/30')
                                  : (isDark ? 'border-gray-600 text-gray-400 hover:border-gray-500 bg-gray-800/40' : 'border-gray-200 text-gray-600 bg-white/60 hover:border-[#7da47f]/50')
                                  }`}
                              >
                                {goals.weeklyHours === opt.value && <Check className="w-3.5 h-3.5 inline mr-1" />}
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {formData.learningLanguages.length === 0 && (
                  <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <p>Go back and select at least one language to continue.</p>
                  </div>
                )}
              </div>
            )}

            {/* ──── Step 3: Disability Information ──── */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Learning Needs
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Optional — helps us adapt content to support you. All information is confidential.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { value: 'dyslexia', label: 'Dyslexia', desc: 'Difficulty with reading and spelling', emoji: '📖' },
                    { value: 'adhd', label: 'ADHD', desc: 'Attention and focus challenges', emoji: '⚡' },
                    { value: 'autism', label: 'Autism', desc: 'Different way of learning and communicating', emoji: '🧩' },

                    { value: 'none', label: 'None of these', desc: 'No specific learning differences', emoji: '✅' },
                  ].map((disability) => {
                    const isSelected = formData.disabilities.includes(disability.value);
                    return (
                      <button
                        key={disability.value}
                        onClick={() => toggleArrayItem('disabilities', disability.value)}
                        className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl text-left transition-all duration-200 ${isSelected
                          ? (isDark ? 'bg-gray-800 border-[#7da47f] ring-1 ring-[#7da47f]/30' : 'bg-green-50/80 border-[#7da47f]')
                          : (isDark ? 'bg-gray-800/30 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm')
                          }`}
                      >
                        <span className="text-xl flex-shrink-0">{disability.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{disability.label}</div>
                          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{disability.desc}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected
                          ? 'bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] border-[#5a8c5c]'
                          : (isDark ? 'border-gray-600' : 'border-gray-300')
                          }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    IEP Goals <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={formData.iepGoals}
                    onChange={(e) => updateFormData('iepGoals', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#7da47f] resize-none ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    placeholder="Share any IEP goals or learning objectives..."
                  />
                </div>
              </div>
            )}

            {/* ──── Step 4: Accessibility Preferences ──── */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Customise Your Experience
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Adjust the display to match your comfort. Changes apply live.
                  </p>
                </div>

                {/* Font selection */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Font Style
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { value: 'default', label: 'Default', desc: 'Lexend', style: 'font-sans' },
                      { value: 'atkinson', label: 'Dyslexia-Friendly', desc: 'Atkinson', style: 'font-serif' },
                      { value: 'arial', label: 'Simple', desc: 'Arial', style: 'font-sans' },
                      { value: 'georgia', label: 'Classic', desc: 'Georgia', style: 'font-serif' },
                    ].map((font) => (
                      <button
                        key={font.value}
                        onClick={() => updateFormData('fontFamily', font.value)}
                        className={`relative p-3 border-2 rounded-xl text-left transition-all duration-200 ${formData.fontFamily === font.value
                          ? (isDark ? 'border-[#7da47f] bg-[#7da47f]/20 ring-2 ring-[#7da47f]/40' : 'border-[#7da47f] bg-[#e8f5e9] shadow-md ring-2 ring-[#7da47f]/30')
                          : (isDark ? 'border-gray-700 bg-gray-800/30 hover:border-gray-600' : 'border-gray-200 hover:border-[#7da47f]/50 hover:shadow-sm')
                          }`}
                      >
                        {formData.fontFamily === font.value && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <div className={`${font.style} font-semibold text-sm ${formData.fontFamily === font.value ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>{font.label}</div>
                        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{font.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text size */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Text Size
                    </label>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      {formData.textSize}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={formData.textSize}
                    onChange={(e) => updateFormData('textSize', parseInt(e.target.value))}
                    className="w-full accent-[#7da47f]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>Small</span>
                    <span>Medium</span>
                    <span>Large</span>
                  </div>
                </div>

                {/* Line spacing */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Line Spacing
                    </label>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      {formData.lineSpacing}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.1"
                    value={formData.lineSpacing}
                    onChange={(e) => updateFormData('lineSpacing', parseFloat(e.target.value))}
                    className="w-full accent-[#7da47f]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>Compact</span>
                    <span>Normal</span>
                    <span>Spacious</span>
                  </div>
                </div>

                {/* ===== LIVE PREVIEW ===== */}
                <div className={`rounded-xl p-5 border-2 ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className={`text-xs font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span>👁️</span>
                    <span>Live Preview</span>
                  </div>
                  <div
                    className={`rounded-lg p-4 transition-all duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                    style={{
                      fontFamily: fontFamilyMap[formData.fontFamily] || 'system-ui',
                      fontSize: `${formData.textSize}px`,
                      lineHeight: formData.lineSpacing
                    }}
                  >
                    <p className={isDark ? 'text-gray-200' : 'text-gray-800'}>
                      The quick brown fox jumps over the lazy dog.
                    </p>
                    <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      வானதை நடுத்தகடில் வாழும் விலங்குகள் வேகமாக ஓடுகின்றன.
                    </p>
                    <p className={`text-sm mt-3 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      Your text will look like this in lessons!
                    </p>
                  </div>
                </div>

                {/* Color scheme */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Colour Scheme
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { value: 'light', label: 'Light', icon: '☀️', bg: 'bg-white', border: 'border-gray-200' },
                      { value: 'dark', label: 'Dark', icon: '🌙', bg: 'bg-gray-900', border: 'border-gray-700' },
                      { value: 'high-contrast', label: 'High Contrast', icon: '🔲', bg: 'bg-black', border: 'border-yellow-400' },
                    ].map((scheme) => (
                      <button
                        key={scheme.value}
                        onClick={() => updateFormData('colorScheme', scheme.value)}
                        className={`relative p-3 border-2 rounded-xl transition-all duration-200 text-center ${formData.colorScheme === scheme.value
                          ? 'border-[#7da47f] bg-[#e8f5e9] ring-2 ring-[#7da47f]/40 shadow-md'
                          : (isDark ? 'border-gray-700 hover:border-gray-600 bg-gray-800/30' : 'border-gray-200 hover:border-[#7da47f]/50 hover:shadow-sm')
                          }`}
                      >
                        {formData.colorScheme === scheme.value && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                        <span className="text-xl block mb-1">{scheme.icon}</span>
                        <div className={`text-xs font-medium ${formData.colorScheme === scheme.value ? 'text-gray-900' : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>{scheme.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                  {[
                    { field: 'captionsEnabled', label: 'Captions', desc: 'Show text for all audio content', icon: '💬' },
                    { field: 'speechRecognitionEnabled', label: 'Speech Recognition', desc: 'Use voice commands to navigate', icon: '🎤' },
                    { field: 'reducedMotion', label: 'Reduced Motion', desc: 'Minimise animations and transitions', icon: '🖐️' },
                  ].map((toggle) => (
                    <label key={toggle.field} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                      }`}>
                      <span className="text-lg">{toggle.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{toggle.label}</div>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{toggle.desc}</div>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={(formData as any)[toggle.field]}
                          onChange={(e) => updateFormData(toggle.field, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors peer-checked:bg-[#7da47f] ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ──── Step 5: Quick Assessment ──── */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Quick Assessment
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Answer a few questions so we can find the best starting level for you.
                  </p>
                </div>

                <div className="space-y-6">
                  {assessmentQuestions.map((q, qIndex) => (
                    <div key={q.id}>
                      <p className={`font-medium text-sm mb-3 flex items-start gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        {q.question}
                      </p>
                      <div className="space-y-2 pl-8">
                        {q.options.map((opt) => {
                          const isSelected = formData.assessmentAnswers[q.id] === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => updateFormData('assessmentAnswers', { ...formData.assessmentAnswers, [q.id]: opt.id })}
                              className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm transition-all duration-200 ${isSelected
                                ? (isDark ? 'border-[#7da47f] bg-gray-800 text-white' : 'border-[#7da47f] bg-green-50/60 text-gray-900')
                                : (isDark ? 'border-gray-700 text-gray-300 hover:border-gray-600' : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50')
                                }`}
                            >
                              {opt.text}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ──── Step 6: Review & Confirm ──── */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] mb-4 shadow-lg shadow-green-200/40">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    You&apos;re All Set!
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Review your preferences below. You can change these anytime in Settings.
                  </p>
                  {formData.placementLevel && (
                    <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-sm font-semibold ${isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'
                      }`}>
                      <Sparkles className="w-4 h-4" />
                      Placement Level: {formData.placementLevel}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Profile Summary */}
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-r from-[#f0f7f0] to-[#e0ede1] border-[#c5d8c7]'}`}>
                    <h3 className={`font-semibold text-sm mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <User className="w-4 h-4" /> Profile
                    </h3>
                    <div className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p>Grade: {formData.gradeLevel || 'Not specified'}</p>
                      <p>Native Language: {formData.nativeLanguage || 'Not specified'}</p>
                      <p>Learning: {formData.learningLanguages.join(', ') || 'Not selected'}</p>
                    </div>
                  </div>

                  {/* Language Goals Summary */}
                  {Object.keys(formData.languageGoals).length > 0 && (
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-r from-[#f0f7f0] to-[#e0ede1] border-[#c5d8c7]'}`}>
                      <h3 className={`font-semibold text-sm mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <BookOpen className="w-4 h-4" /> Language Goals
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(formData.languageGoals).map(([lang, g]) => (
                          <div key={lang} className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <span className="font-medium">{lang === 'English' ? '🇬🇧' : '🇮🇳'} {lang}:</span>{' '}
                            {g.confidenceLevel && <span className="capitalize">{g.confidenceLevel.replace('-', ' ')}</span>}
                            {g.learningGoal && <span> &middot; Goal: {g.learningGoal}</span>}
                            {g.preferredStyle && <span> &middot; Style: {g.preferredStyle}</span>}
                            {g.weeklyHours && <span> &middot; {g.weeklyHours} hrs/week</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learning Needs Summary */}
                  {formData.disabilities.length > 0 && !formData.disabilities.includes('none') && (
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-r from-[#f0f7f0] to-[#e0ede1] border-[#c5d8c7]'}`}>
                      <h3 className={`font-semibold text-sm mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Accessibility className="w-4 h-4" /> Learning Needs
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formData.disabilities.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Accessibility Summary */}
                  <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100'}`}>
                    <h3 className={`font-semibold text-sm mb-2 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <BookOpen className="w-4 h-4" /> Accessibility
                    </h3>
                    <div className={`text-sm space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p>Font: {formData.fontFamily} &middot; Size: {formData.textSize}px</p>
                      <p>Theme: {formData.colorScheme} &middot; Captions: {formData.captionsEnabled ? 'On' : 'Off'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7da47f] to-[#5a8c5c] text-white hover:from-[#6b946d] hover:to-[#4a7c4c] font-medium text-sm transition-all duration-200 shadow-md shadow-green-200/30 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {currentStep === 6 ? 'Submit Assessment' : 'Continue'}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#7da47f] to-[#5a8c5c] text-white hover:from-[#6b946d] hover:to-[#4a7c4c] font-medium text-sm transition-all duration-200 shadow-md shadow-green-200/30 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Start Learning
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
