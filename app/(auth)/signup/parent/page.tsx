'use client';

import Link from 'next/link';
import { SignUpForm } from '@/components/forms/SignUpForm';
import { Users, ArrowLeft } from 'lucide-react';

export default function ParentSignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] via-[#f0ede6] to-[#e8e4db] flex flex-col">
      <header className="container mx-auto px-6 py-6 flex items-center gap-4">
        <Link href="/signup" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Link href="/" className="text-2xl font-bold text-[#5a8c5c]">
          Lexfix
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#f0f7f0] rounded-2xl mb-3">
              <Users className="w-7 h-7 text-[#5a8c5c]" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Parent Sign Up</h1>
            <p className="text-slate-500">Create your account to track your child&apos;s learning</p>
          </div>

          <div className="bg-white/80 rounded-2xl p-8 shadow-sm border border-[#d6ddd7]">
            <SignUpForm role="PARENT" />
          </div>

          <div className="mt-6 text-center text-sm text-slate-500 space-y-1">
            <p>Are you a student? <Link href="/signup/student" className="font-semibold text-[#5a8c5c] hover:text-[#4a7c4c]">Sign up here</Link></p>
            <p>Already have an account? <Link href="/login" className="font-semibold text-[#5a8c5c] hover:text-[#4a7c4c]">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}