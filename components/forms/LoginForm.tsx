'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, checkAuthMethod, setToken } from '@/lib/api';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import PatternLock from '@/components/PatternLock';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';

type LoginStep = 'email' | 'password' | 'pattern';

export function LoginForm() {
  const router = useRouter();
  const { loadUserPreferences } = useAccessibility();
  const [step, setStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [userName, setUserName] = useState('');
  const [authMethod, setAuthMethod] = useState<'pattern' | 'password'>('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patternError, setPatternError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email'); return; }
    setLoading(true);
    setError('');

    const result = await checkAuthMethod(email);
    setLoading(false);

    if ('error' in result) {
      setError(result.error || 'No account found with this email');
      return;
    }

    setUserName(result.firstName);
    setAuthMethod(result.authMethod as 'pattern' | 'password');
    setStep(result.authMethod === 'pattern' ? 'pattern' : 'password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setError('Please enter your password'); return; }
    setLoading(true);
    setError('');

    const result = await login({ email, password, rememberMe });
    setLoading(false);

    if ('error' in result) {
      setError(result.error || 'Login failed');
      return;
    }

    if ((result as any).token) setToken((result as any).token);
    loadUserPreferences();
    redirectByRole((result as any).user);
  };

  const handlePatternSubmit = async (pattern: number[]) => {
    setLoading(true);
    setPatternError('');

    const result = await login({ email, pattern, rememberMe });
    setLoading(false);

    if ('error' in result) {
      setPatternError(result.error || 'Incorrect pattern');
      return;
    }

    if ((result as any).token) setToken((result as any).token);
    loadUserPreferences();
    redirectByRole((result as any).user);
  };

  const redirectByRole = (user: any) => {
    if (!user) { router.push('/learner/dashboard'); return; }
    const onb = user.onboardingComplete;
    switch (user.role) {
      case 'PARENT': 
        // If standard parent, go to parent dashboard (if exists) or homeschool hub if mapped
        router.push(onb ? '/parent/dashboard' : '/parent/onboarding'); 
        break;
      case 'PARENT_EDUCATOR':
        router.push(onb ? '/homeschool/hub' : '/homeschool/onboarding');
        break;
      case 'EDUCATOR': 
        router.push('/educator/dashboard'); 
        break;
      case 'LEARNER':
      default: 
        router.push(onb ? '/learner/dashboard' : '/onboarding'); 
        break;
    }
  };

  return (
    <div className="w-full max-w-md space-y-5">
      {error && (
        <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      )}

      {/* STEP 1: Email */}
      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4" aria-label="Email step">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7da47f] focus:border-[#7da47f] outline-none transition-all text-slate-900"
                autoComplete="email"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7da47f] hover:bg-[#6b946d] disabled:bg-slate-300 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all"
          >
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </form>
      )}

      {/* STEP 2a: Password (Parent/Educator) */}
      {step === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4" aria-label="Password step">
          <div className="flex items-center gap-2 mb-2">
            <button type="button" onClick={() => { setStep('email'); setError(''); }} className="text-slate-400 hover:text-slate-600" aria-label="Go back to email step">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <p className="text-sm text-slate-500">Welcome back, <span className="font-semibold text-slate-700">{userName}</span></p>
          </div>

          <div className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg">{email}</div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7da47f] focus:border-[#7da47f] outline-none transition-all text-slate-900"
                placeholder="Enter your password"
                autoComplete="current-password"
                autoFocus
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="w-5 h-5" aria-hidden="true" /> : <Eye className="w-5 h-5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-[#7da47f] border-slate-300 rounded focus:ring-[#7da47f]" />
            <span className="text-sm text-slate-600">Remember me</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7da47f] hover:bg-[#6b946d] disabled:bg-slate-300 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      )}

      {/* STEP 2b: Pattern (Learner) */}
      {step === 'pattern' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => { setStep('email'); setPatternError(''); setError(''); }} className="text-slate-400 hover:text-slate-600" aria-label="Go back to email step">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <p className="text-sm text-slate-500">Welcome back, <span className="font-semibold text-slate-700">{userName}</span>!</p>
          </div>

          <div className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg">{email}</div>

          <PatternLock mode="verify" onPatternComplete={handlePatternSubmit} error={patternError} disabled={loading} />

          {loading && (
            <div className="flex items-center justify-center gap-2 text-[#5a8c5c]" role="status" aria-live="polite">
              <div className="w-5 h-5 border-2 border-[#5a8c5c] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              <span className="text-sm font-medium">Signing in...</span>
            </div>
          )}
        </div>
      )}

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account? <a href="/signup" className="font-semibold text-[#5a8c5c] hover:text-[#4a7c4c]">Create one</a>
      </p>
    </div>
  );
}