'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, checkAuthMethod, setToken } from '@/lib/api';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import PatternLock from '@/components/PatternLock';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';


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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Verify with backend
      const res = await fetch('/api/auth/firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Google login failed');
      }

      if (data.token) setToken(data.token);
      loadUserPreferences();
      redirectByRole(data.user);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      )}

      {/* Google Login Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            style={{ fill: '#4285F4' }}
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            style={{ fill: '#34A853' }}
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            style={{ fill: '#FBBC05' }}
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            style={{ fill: '#EA4335' }}
          />
        </svg>
        Sign in with Google
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-500">Or continue with</span>
        </div>
      </div>

      {/* STEP 1: Email */}
      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7da47f] focus:border-[#7da47f] outline-none transition-all text-slate-900"
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
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <button type="button" onClick={() => { setStep('email'); setError(''); }} className="text-slate-400 hover:text-slate-600">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <p className="text-sm text-slate-500">Welcome back, <span className="font-semibold text-slate-700">{userName}</span></p>
          </div>

          <div className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg">{email}</div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7da47f] focus:border-[#7da47f] outline-none transition-all text-slate-900"
                placeholder="Enter your password"
                autoComplete="current-password"
                autoFocus
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
            <button onClick={() => { setStep('email'); setPatternError(''); setError(''); }} className="text-slate-400 hover:text-slate-600">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <p className="text-sm text-slate-500">Welcome back, <span className="font-semibold text-slate-700">{userName}</span>!</p>
          </div>

          <div className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg">{email}</div>

          <PatternLock mode="verify" onPatternComplete={handlePatternSubmit} error={patternError} disabled={loading} />

          {loading && (
            <div className="flex items-center justify-center gap-2 text-[#5a8c5c]">
              <div className="w-5 h-5 border-2 border-[#5a8c5c] border-t-transparent rounded-full animate-spin" />
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