'use client';

import { Suspense } from 'react';
import LessonsClient from './LessonsClient';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';
import {
  BookOpen,
  Search,
  Clock,
  CheckCircle,
  ArrowRight,
  Globe,
  ChevronDown
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ThemeToggle';

interface Lesson {
  id: string;
  title: string;
  description: string;
  language: string;
  gradeLevel: string;
  duration: number;
  disabilityTypes?: string[];
  badge?: string;
  competencies: string[];
  learningObjectives: string[];
  hasTranscripts: boolean;
  hasCaptions: boolean;
  progress: {
    status: string;
    score: number;
    attemptCount: number;
    lastAccessedAt: string | null;
  };
}

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: 'bg-[#f5f3ef] text-[#8a8a8a]',
  IN_PROGRESS: 'bg-[#edf2f7] text-[#5a7a94]',
  COMPLETED: 'bg-[#f0f4f0] text-[#5d7e61]',
  MASTERED: 'bg-[#f0f4f0] text-[#5d7e61]',
};

export default function LessonsListPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#faf9f7]">
        <div className="w-10 h-10 border-[3px] border-[#d4dcd5] border-t-[#7a9b7e] rounded-full animate-spin mx-auto" aria-hidden="true" />
      </div>
    }>
      <LessonsClient />
    </Suspense>
  );
}
