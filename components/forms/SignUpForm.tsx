'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signUpSchema, SignUpFormData } from '@/lib/validations/auth';
import { signup, setToken } from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';

interface SignUpFormProps {
  role?: 'LEARNER' | 'EDUCATOR' | 'PARENT';
  onSuccess?: () => void;
}

export function SignUpForm({ role, onSuccess }: SignUpFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { agreeToTerms: false, agreeToPrivacy: false },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      setApiError(null);
      const result = await signup({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: role || 'PARENT',
        agreeToTerms: data.agreeToTerms,
        agreeToPrivacy: data.agreeToPrivacy,
      });
      if ('error' in result) { setApiError(result.error || 'Signup failed'); return; }
      if ((result as any).token) setToken((result as any).token);
      if (onSuccess) { onSuccess(); return; }

      switch (role) {
        case 'EDUCATOR': router.push('/teacher/dashboard'); break;
        case 'PARENT': router.push('/parent/onboarding'); break;
        default: router.push('/onboarding'); break;
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4" aria-label="Sign up form">
      {apiError && (
        <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{apiError}</div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="signup-firstname" className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
          <input id="signup-firstname" {...register('firstName')} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7da47f] focus:border-[#7da47f] outline-none transition-all text-slate-900" placeholder="First name" aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? 'err-firstname' : undefined} />
          {errors.firstName && <p id="err-firstname" role="alert" className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="signup-lastname" className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
          <input id="signup-lastname" {...register('lastName')} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7da47f] focus:border-[#7da47f] outline-none transition-all text-slate-900" placeholder="Last name" aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? 'err-lastname' : undefined} />
          {errors.lastName && <p id="err-lastname" role="alert" className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input id="signup-email" {...register('email')} type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7da47f] focus:border-[#7da47f] outline-none transition-all text-slate-900" placeholder="you@email.com" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} />
        {errors.email && <p id="err-email" role="alert" className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
        <div className="relative">
          <input id="signup-password" {...register('password')} type={showPassword ? 'text' : 'password'} className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7da47f] focus:border-[#7da47f] outline-none transition-all text-slate-900" placeholder="At least 8 characters" autoComplete="new-password" aria-invalid={!!errors.password} aria-describedby={errors.password ? 'err-password' : undefined} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
        {errors.password && <p id="err-password" role="alert" className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="signup-confirm" className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
        <input id="signup-confirm" {...register('confirmPassword')} type="password" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7da47f] focus:border-[#7da47f] outline-none transition-all text-slate-900" placeholder="Re-enter password" autoComplete="new-password" aria-invalid={!!errors.confirmPassword} aria-describedby={errors.confirmPassword ? 'err-confirm' : undefined} />
        {errors.confirmPassword && <p id="err-confirm" role="alert" className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
      </div>

      <div className="space-y-3 pt-2" role="group" aria-label="Agreement checkboxes">
        <label className="flex items-start gap-3 cursor-pointer">
          <input {...register('agreeToTerms')} type="checkbox" className="mt-0.5 w-4 h-4 text-[#7da47f] border-slate-300 rounded focus:ring-[#7da47f]" aria-invalid={!!errors.agreeToTerms} />
          <span className="text-sm text-slate-600">I agree to the <span className="text-[#5a8c5c] font-medium">Terms of Service</span></span>
        </label>
        {errors.agreeToTerms && <p role="alert" className="text-red-500 text-xs ml-7">{errors.agreeToTerms.message}</p>}
        <label className="flex items-start gap-3 cursor-pointer">
          <input {...register('agreeToPrivacy')} type="checkbox" className="mt-0.5 w-4 h-4 text-[#7da47f] border-slate-300 rounded focus:ring-[#7da47f]" aria-invalid={!!errors.agreeToPrivacy} />
          <span className="text-sm text-slate-600">I agree to the <span className="text-[#5a8c5c] font-medium">Privacy Policy</span></span>
        </label>
        {errors.agreeToPrivacy && <p role="alert" className="text-red-500 text-xs ml-7">{errors.agreeToPrivacy.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-[#7da47f] hover:bg-[#6b946d] disabled:bg-slate-300 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2" role="status" aria-live="polite">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            Creating Account...
          </span>
        ) : 'Create Account'}
      </button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <a href="/login" className="font-semibold text-[#5a8c5c] hover:text-[#4a7c4c]">Sign in</a>
      </p>
    </form>
  );
}