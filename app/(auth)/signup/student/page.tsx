'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { learnerSignUpSchema, type LearnerSignUpFormData } from '@/lib/validations/auth';
import { signup, setToken } from '@/lib/api';
import PatternLock from '@/components/PatternLock';
import { GraduationCap, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

type Step = 'details' | 'pattern' | 'confirm';

export default function StudentSignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('details');
  const [pattern, setPattern] = useState<number[]>([]);
  const [confirmPattern, setConfirmPattern] = useState<number[]>([]);
  const [patternError, setPatternError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<LearnerSignUpFormData>({
    resolver: zodResolver(learnerSignUpSchema),
    defaultValues: { agreeToTerms: false, agreeToPrivacy: false },
  });

  const handleDetailsSubmit = () => {
    handleSubmit(() => setStep('pattern'))();
  };

  const handlePatternCreate = (p: number[]) => {
    setPattern(p);
    setPatternError('');
  };

  const handlePatternConfirm = async (p: number[]) => {
    setConfirmPattern(p);
    if (JSON.stringify(p) !== JSON.stringify(pattern)) {
      setPatternError('Patterns do not match. Try again.');
      return;
    }
    setPatternError('');

    // Submit signup
    setLoading(true);
    setApiError('');
    const values = getValues();
    const result = await signup({
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      pattern: p,
      role: 'LEARNER',
      agreeToTerms: values.agreeToTerms,
      agreeToPrivacy: values.agreeToPrivacy,
    });

    if ('error' in result) {
      setApiError(result.error);
      setLoading(false);
      return;
    }

    if ((result as any).token) {
      setToken((result as any).token);
    }
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] via-[#f0ede6] to-[#e8e4db] flex flex-col">
      {/* Header */}
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
          {/* Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#f0f7f0] rounded-2xl mb-3">
              <GraduationCap className="w-7 h-7 text-[#5a8c5c]" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Student Sign Up</h1>
            <p className="text-slate-500">
              {step === 'details' && 'Fill in your details to get started'}
              {step === 'pattern' && 'Create a secret pattern to sign in'}
              {step === 'confirm' && 'Draw the same pattern to confirm'}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {['details', 'pattern', 'confirm'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step === s ? 'bg-[#7da47f] text-white shadow-lg shadow-[#9db4a0]/30' :
                    ['details', 'pattern', 'confirm'].indexOf(step) > i ? 'bg-green-500 text-white' :
                      'bg-slate-200 text-slate-400'
                  }`}>
                  {['details', 'pattern', 'confirm'].indexOf(step) > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                {i < 2 && <div className={`w-8 h-0.5 ${['details', 'pattern', 'confirm'].indexOf(step) > i ? 'bg-green-400' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white/80 rounded-2xl p-8 shadow-sm border border-[#d6ddd7]">
            {apiError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{apiError}</div>
            )}

            {/* Step 1: Details */}
            {step === 'details' && (
              <form onSubmit={(e) => { e.preventDefault(); handleDetailsSubmit(); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input {...register('firstName')} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7da47f] focus:border-[#7da47f] outline-none transition-all text-slate-900" placeholder="First name" />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input {...register('lastName')} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7da47f] focus:border-[#7da47f] outline-none transition-all text-slate-900" placeholder="Last name" />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input {...register('email')} type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7da47f] focus:border-[#7da47f] outline-none transition-all text-slate-900" placeholder="your@email.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input {...register('agreeToTerms')} type="checkbox" className="mt-0.5 w-4 h-4 text-[#7da47f] border-slate-300 rounded focus:ring-[#7da47f]" />
                    <span className="text-sm text-slate-600">
                      I agree to the{' '}
                      <Link href="/terms" target="_blank" className="text-[#5a8c5c] font-medium hover:underline">
                        Terms of Service
                      </Link>
                    </span>
                  </label>
                  {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input {...register('agreeToPrivacy')} type="checkbox" className="mt-0.5 w-4 h-4 text-[#7da47f] border-slate-300 rounded focus:ring-[#7da47f]" />
                    <span className="text-sm text-slate-600">
                      I agree to the{' '}
                      <Link href="/privacy" target="_blank" className="text-[#5a8c5c] font-medium hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.agreeToPrivacy && <p className="text-red-500 text-xs">{errors.agreeToPrivacy.message}</p>}
                  <div className="mt-4 p-3 bg-[#fff9e6] border border-[#f0e4b8] rounded-lg text-xs text-[#856404]">
                    <strong>For users under 13:</strong> Please have a parent or guardian review and approve these agreements on your behalf.
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-[#7da47f] hover:bg-[#6b946d] text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2">
                  Next: Create Pattern <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Step 2: Create Pattern */}
            {step === 'pattern' && (
              <div className="flex flex-col items-center">
                <PatternLock mode="create" onPatternComplete={handlePatternCreate} />
                <div className="flex gap-3 mt-6 w-full">
                  <button onClick={() => setStep('details')} className="flex-1 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={() => {
                      if (pattern.length >= 4) {
                        setPatternError('');
                        setStep('confirm');
                      }
                    }}
                    disabled={pattern.length < 4}
                    className="flex-1 py-3 bg-[#7da47f] hover:bg-[#6b946d] disabled:bg-slate-300 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm Pattern */}
            {step === 'confirm' && (
              <div className="flex flex-col items-center">
                <PatternLock mode="verify" onPatternComplete={handlePatternConfirm} error={patternError} disabled={loading} />
                {loading && (
                  <div className="mt-4 flex items-center gap-2 text-[#5a8c5c]">
                    <div className="w-5 h-5 border-2 border-[#5a8c5c] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Creating your account...</span>
                  </div>
                )}
                <div className="flex gap-3 mt-6 w-full">
                  <button onClick={() => { setStep('pattern'); setPattern([]); setPatternError(''); }} className="flex-1 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Redo Pattern
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-slate-500 space-y-1">
            <p>Already have an account? <Link href="/login" className="font-semibold text-[#5a8c5c] hover:text-[#4a7c4c]">Sign in</Link></p>
            <p>Are you a parent? <Link href="/signup/parent" className="font-semibold text-[#5a8c5c] hover:text-[#4a7c4c]">Sign up here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}