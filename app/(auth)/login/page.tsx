'use client';

import Link from 'next/link';
import { LoginForm } from '@/components/forms/LoginForm';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] via-[#f0ede6] to-[#e8e4db] flex flex-col">
      <header className="container mx-auto px-6 py-6">
        <Link href="/" className="text-2xl font-bold text-[#5a8c5c]">
          Lexfix
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#f0f7f0] rounded-2xl mb-3">
              <LogIn className="w-7 h-7 text-[#5a8c5c]" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Welcome Back</h1>
            <p className="text-slate-500">Sign in to continue your learning journey</p>
          </div>

          <div className="bg-white/80 rounded-2xl p-8 shadow-sm border border-[#d6ddd7]">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}