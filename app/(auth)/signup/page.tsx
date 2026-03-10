import Link from 'next/link';
import { GraduationCap, Users, ArrowRight, Briefcase } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export const metadata = {
  title: 'Sign Up - Lexfix',
  description: 'Create your Lexfix account.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] via-[#f0ede6] to-[#e8e4db] flex flex-col">
      <header role="banner" className="container mx-auto px-6 py-6">
        <Link href="/" aria-label="LexFix home">
          <Logo />
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Join Lexfix</h1>
            <p className="text-lg text-slate-500">Choose your account type to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Student */}
            <Link href="/signup/student" className="group" aria-label="Sign up as a Student. Start your learning journey with English and Tamil lessons.">
              <div className="bg-white/80 rounded-2xl p-7 border border-[#d6ddd7] shadow-sm hover:shadow-md hover:border-[#9db4a0] transition-all h-full">
                <div className="w-14 h-14 bg-[#f0f7f0] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                  <GraduationCap className="w-7 h-7 text-[#5a8c5c]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">I&apos;m a Student</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Start your learning journey with English & Tamil lessons. Sign in with a fun pattern instead of a password!
                </p>
                <span className="inline-flex items-center gap-1 text-[#5a8c5c] font-semibold text-sm group-hover:gap-2 transition-all" aria-hidden="true">
                  Get Started <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
            </Link>

            {/* Parent */}
            <Link href="/signup/parent" className="group" aria-label="Sign up as a Parent. Track your child's progress and support their learning.">
              <div className="bg-white/80 rounded-2xl p-7 border border-[#d6ddd7] shadow-sm hover:shadow-md hover:border-[#9db4a0] transition-all h-full">
                <div className="w-14 h-14 bg-[#f0f7f0] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                  <Users className="w-7 h-7 text-[#7da47f]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">I&apos;m a Parent</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Track your child&apos;s progress and support their learning. Link accounts using their Student ID.
                </p>
                <span className="inline-flex items-center gap-1 text-[#5a8c5c] font-semibold text-sm group-hover:gap-2 transition-all" aria-hidden="true">
                  Get Started <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </div>
            </Link>

            {/* Adult Learner */}
            <Link href="/signup/adult" className="group" aria-label="Sign up as an Adult Learner. Fully independent learning experience.">
              <div className="bg-white/80 rounded-2xl p-7 border border-[#d6ddd7] shadow-sm hover:shadow-md hover:border-[#9db4a0] transition-all h-full">
                <div className="w-14 h-14 bg-[#f0f7f0] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" aria-hidden="true">
                  <Briefcase className="w-7 h-7 text-[#5a8c5c]" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">I&apos;m an Adult</h3>
                <p className="text-slate-500 text-sm mb-4">
                  An independent learning experience designed for adults. Set your own pace and goals.
                </p>
                <span className="inline-flex items-center gap-1 text-[#5a8c5c] font-semibold text-sm group-hover:gap-2 transition-all" aria-hidden="true">
                  Get Started <ArrowRight className="w-4 h-4" aria-hidden="true" />
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