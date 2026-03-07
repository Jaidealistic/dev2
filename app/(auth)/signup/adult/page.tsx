'use client';

import Link from 'next/link';
import { SignUpForm } from '@/components/forms/SignUpForm';
import { Briefcase, ArrowLeft, Sparkles } from 'lucide-react';

export default function AdultSignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] via-[#f0ede6] to-[#e8e4db] flex flex-col">
      <header role="banner" className="container mx-auto px-6 py-6 flex items-center gap-4">
        <Link href="/signup" className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Back to signup options">
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </Link>
        <Link href="/" className="text-2xl font-bold text-[#5a8c5c]" aria-label="Lexfix home">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>LexFix</span>
          </div>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#f0f7f0] rounded-2xl mb-3" aria-hidden="true">
              <Briefcase className="w-7 h-7 text-[#5a8c5c]" aria-hidden="true" />
            </div>
            <h1 id="adult-signup-heading" className="text-3xl font-bold text-slate-900 mb-1">Adult Sign Up</h1>
            <p className="text-slate-500">Create your independent learning account</p>
          </div>

          <div className="bg-white/80 rounded-2xl p-8 shadow-sm border border-[#d6ddd7]" role="region" aria-labelledby="adult-signup-heading">
            <SignUpForm role="LEARNER" />
          </div>

          <div className="mt-6 text-center text-sm text-slate-500 space-y-1">
            <p>Signing up a child? <Link href="/signup/parent" className="font-semibold text-[#5a8c5c] hover:text-[#4a7c4c]">Parent Sign Up</Link></p>
            <p>Already have an account? <Link href="/login" className="font-semibold text-[#5a8c5c] hover:text-[#4a7c4c]">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
