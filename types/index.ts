// Frontend Type Definitions
// This file defines all TypeScript interfaces used in the frontend

// User Types
export enum UserRole {
  LEARNER = 'LEARNER',
  PARENT = 'PARENT',
  EDUCATOR = 'EDUCATOR',
  SPEECH_THERAPIST = 'SPEECH_THERAPIST',
  ADMIN = 'ADMIN',
  PARENT_EDUCATOR = 'PARENT_EDUCATOR',
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  accessibilityPrefs: Record<string, any>;
  language: string;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}

// Learner Profile Types
export enum ProficiencyLevel {
  BEGINNER = 'BEGINNER',
  ELEMENTARY = 'ELEMENTARY',
  INTERMEDIATE = 'INTERMEDIATE',
  UPPER_INTERMEDIATE = 'UPPER_INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  MASTERY = 'MASTERY',
}

export interface LearnerProfile {
  id: string;
  userId: string;
  dateOfBirth?: Date;
  grade?: string;
  school?: string;
  disabilityTypes: string[]; // "dyslexia", "adhd", "autism", "apd"
  iepGoals?: string;
  accommodations?: Record<string, any>;
  nativeLanguage: string;
  learningLanguages: string[];
  proficiencyLevel: ProficiencyLevel;
  placementScore?: number;
  // Accessibility Preferences (WCAG AAA)
  fontFamily: 'system' | 'lexend' | 'atkinson';
  fontSize: number;
  lineSpacing: number;
  letterSpacing: number;
  colorScheme: 'light' | 'dark' | 'sepia';
  reducedMotion: boolean;
  highlightText: boolean;
  bionicReading: boolean;
  focusMode: boolean;
  // Speech Recognition
  enableSpeechRec: boolean;
  speechRecLang: string;
  speechShowSubtitles: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Progress & Assessment Types
export enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  MASTERED = 'MASTERED',
  STRUGGLING = 'STRUGGLING',
}

export interface LessonProgress {
  id: string;
  learnerId: string;
  lessonId: string;
  status: ProgressStatus;
  startedAt?: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  attemptCount: number;
  score?: number;
  duration?: number;
  interactionMetrics?: Record<string, any>;
  errorPatterns: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  contentId: string;
  language: string;
  gradeLevel?: string;
  duration?: number;
  competencies: string[];
  learningObjectives: string[];
  creatorId: string;
  isPublished: boolean;
  multiModalContent: boolean;
  hasTranscripts: boolean;
  hasCaptions: boolean;
  hasAltText: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Achievement Types
export interface Achievement {
  id: string;
  learnerId: string;
  badgeId: string;
  badgeName: string;
  description?: string;
  earnedAt: Date;
}

// Accessibility Context Types
export interface AccessibilityPreferences {
  fontFamily: 'system' | 'lexend' | 'opendyslexic' | 'atkinson';
  fontSize: number;
  lineSpacing: number;
  letterSpacing: number;
  colorScheme: 'light' | 'dark';
  reducedMotion: boolean;
  highlightText: boolean;
  bionicReading: boolean;
  focusMode: boolean;
  enableSpeechRec: boolean;
  speechRecLang: string;
  speechShowSubtitles: boolean;
  reduceFlashing: boolean;
  dyslexiaMode: boolean;
  adhdMode: boolean;
  autismMode: boolean;
  apdMode: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Auth Types
export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface OnboardingData {
  role: UserRole;
  disabilityTypes?: string[];
  grade?: string;
  school?: string;
  nativeLanguage: string;
  learningLanguages: string[];
  accessibilityPreferences: Partial<AccessibilityPreferences>;
}
