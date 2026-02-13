import Link from 'next/link';
import { GraduationCap, Users, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Sign Up - Lexfix',
  description: 'Create your Lexfix account.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] via-[#f0ede6] to-[#e8e4db] flex flex-col">
      <header className="container mx-auto px-6 py-6">
        <Link href="/" className="text-2xl font-bold text-[#5a8c5c]">
          Lexfix
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Join Lexfix</h1>
            <p className="text-lg text-slate-500">Choose your account type to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Student */}
            <Link href="/signup/student" className="group">
              <div className="bg-white/80 rounded-2xl p-7 border border-[#d6ddd7] shadow-sm hover:shadow-md hover:border-[#9db4a0] transition-all h-full">
                <div className="w-14 h-14 bg-[#f0f7f0] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7 text-[#5a8c5c]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">I&apos;m a Student</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Start your learning journey with English & Tamil lessons. Sign in with a fun pattern instead of a password!
                </p>
                <span className="inline-flex items-center gap-1 text-[#5a8c5c] font-semibold text-sm group-hover:gap-2 transition-all">
                  Get Started <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Parent */}
            <Link href="/signup/parent" className="group">
              <div className="bg-white/80 rounded-2xl p-7 border border-[#d6ddd7] shadow-sm hover:shadow-md hover:border-[#9db4a0] transition-all h-full">
                <div className="w-14 h-14 bg-[#f0f7f0] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-[#7da47f]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">I&apos;m a Parent</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Track your child&apos;s progress and support their learning. Link accounts using their Student ID.
                </p>
                <span className="inline-flex items-center gap-1 text-[#5a8c5c] font-semibold text-sm group-hover:gap-2 transition-all">
                  Get Started <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#5a8c5c] hover:text-[#4a7c4c]">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}