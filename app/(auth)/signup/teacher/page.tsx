/**
 * TEACHER SIGN-UP PAGE
 * 
 * Registration page for teachers (EDUCATOR role)
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from '@/components/forms/SignUpForm';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Teacher Sign Up - Lexfix',
  description: 'Create your teacher account and manage your students.',
};

export default function TeacherSignUpPage() {
  return (
    <div className="min-h-screen bg-[#f5f1eb] flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <Link href="/" className="text-3xl font-bold text-gray-900">
          Lexfix
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f5e5e0] rounded-2xl mb-4">
              <BookOpen className="w-8 h-8 text-[#e8a898]" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Teacher Sign Up
            </h1>
            <p className="text-lg text-gray-600">
              Create your teacher account and empower your students
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <SignUpForm role="EDUCATOR" />
          </div>

          {/* Other Options */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Are you a student?{' '}
              <Link href="/signup/student" className="font-semibold text-[#9db4a0] hover:text-[#8ca394]">
                Sign up here
              </Link>
            </p>
            <p className="mt-2">
              Are you a parent?{' '}
              <Link href="/signup/parent" className="font-semibold text-[#9db4a0] hover:text-[#8ca394]">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
