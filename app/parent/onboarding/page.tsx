'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { linkChild, completeParentOnboarding } from '@/lib/api';
import { Users, UserPlus, CheckCircle2, ArrowRight, X, BookOpen, AlertCircle } from 'lucide-react';

interface LinkedChild {
  studentId: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
}

export default function ParentOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [studentIdInput, setStudentIdInput] = useState('');
  const [linkedChildren, setLinkedChildren] = useState<LinkedChild[]>([]);
  const [linkError, setLinkError] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [completing, setCompleting] = useState(false);

  const handleLinkChild = async () => {
    if (!studentIdInput.trim()) { setLinkError('Please enter a Student ID'); return; }
    setLinkLoading(true);
    setLinkError('');

    const result = await linkChild(studentIdInput.trim().toUpperCase());
    setLinkLoading(false);

    if ('error' in result) {
      setLinkError(result.error || 'Could not find student');
      return;
    }

    if (result.child) {
      setLinkedChildren(prev => [...prev, result.child]);
      setStudentIdInput('');
    }
  };

  const removeChild = (studentId: string) => {
    setLinkedChildren(prev => prev.filter(c => c.studentId !== studentId));
  };

  const handleComplete = async () => {
    setCompleting(true);
    await completeParentOnboarding();
    router.push('/parent/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f2] via-[#f0ede6] to-[#e8e4db] flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7da47f] to-[#5a8c5c] flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <Link href="/" className="text-2xl font-bold text-[#5a8c5c]">
          Lexfix
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === s ? 'bg-[#7da47f] text-white shadow-lg shadow-[#9db4a0]/30' :
                  step > s ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                  {step > s ? <CheckCircle2 className="w-5 h-5" aria-hidden="true" /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-green-400' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="bg-white/80 rounded-2xl p-8 shadow-sm border border-[#d6ddd7] text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f0f7f0] rounded-2xl mb-4">
                <Users className="w-8 h-8 text-[#5a8c5c]" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome, Parent!</h1>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                Let&apos;s connect your account to your children so you can track their learning progress.
              </p>
              <div className="bg-[#f0f7f0] rounded-xl p-4 mb-6 text-left">
                <h3 className="font-semibold text-[#4a7c4c] mb-2">How it works:</h3>
                <ol className="space-y-2 text-sm text-[#5a8c5c]">
                  <li className="flex items-start gap-2"><span className="font-bold">1.</span> Your child signs up as a Student and completes their onboarding</li>
                  <li className="flex items-start gap-2"><span className="font-bold">2.</span> They receive a unique <strong>Student ID</strong> (e.g., LXF-A3K9)</li>
                  <li className="flex items-start gap-2"><span className="font-bold">3.</span> You enter their Student ID here to link your accounts</li>
                </ol>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-[#7da47f] hover:bg-[#6b946d] text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                Link My Children <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Step 2: Link Children */}
          {step === 2 && (
            <div className="bg-white/80 rounded-2xl p-8 shadow-sm border border-[#d6ddd7]">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#f0f7f0] rounded-2xl mb-3">
                  <UserPlus className="w-7 h-7 text-[#5a8c5c]" aria-hidden="true" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Link Your Children</h2>
                <p className="text-slate-500 text-sm mt-1">Enter each child&apos;s Student ID to connect</p>
              </div>

              {/* Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleLinkChild()}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#7da47f] focus:border-[#7da47f] outline-none transition-all text-slate-900 font-mono text-lg tracking-wider"
                  placeholder="LXF-XXXXX"
                  maxLength={9}
                />
                <button
                  onClick={handleLinkChild}
                  disabled={linkLoading}
                  className="px-5 py-3 bg-[#7da47f] hover:bg-[#6b946d] disabled:bg-slate-300 text-white font-semibold rounded-xl transition-all"
                >
                  {linkLoading ? '...' : 'Link'}
                </button>
              </div>

              {linkError && (
                <div role="alert" className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  {linkError}
                </div>
              )}

              {/* Linked children list */}
              {linkedChildren.length > 0 && (
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-slate-500">Linked Children ({linkedChildren.length})</p>
                  {linkedChildren.map((child) => (
                    <div key={child.studentId} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div>
                        <p className="font-semibold text-slate-900">{child.firstName} {child.lastName}</p>
                        <p className="text-sm text-slate-500">
                          ID: <span className="font-mono">{child.studentId}</span>
                          {child.gradeLevel && ` • ${child.gradeLevel}`}
                        </p>
                      </div>
                      <button onClick={() => removeChild(child.studentId)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {linkedChildren.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-40" aria-hidden="true" />
                  <p className="text-sm">No children linked yet</p>
                  <p className="text-xs mt-1">Enter a Student ID above to get started</p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-[#7da47f] hover:bg-[#6b946d] text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  {linkedChildren.length > 0 ? 'Continue' : 'Skip for Now'} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">You&apos;re All Set!</h2>
              <p className="text-slate-500 mb-6">
                {linkedChildren.length > 0
                  ? `You've linked ${linkedChildren.length} child${linkedChildren.length > 1 ? 'ren' : ''}. You can track their progress from your dashboard.`
                  : 'You can link your children later from your dashboard settings.'}
              </p>

              {linkedChildren.length > 0 && (
                <div className="mb-6 space-y-2">
                  {linkedChildren.map((child) => (
                    <div key={child.studentId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 bg-[#f0f7f0] rounded-full flex items-center justify-center text-[#5a8c5c] font-bold text-sm">
                        {child.firstName[0]}
                      </div>
                      <span className="font-medium text-slate-700">{child.firstName} {child.lastName}</span>
                      <span className="text-slate-400 font-mono text-xs ml-auto">{child.studentId}</span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleComplete}
                disabled={completing}
                className="w-full py-3 bg-[#7da47f] hover:bg-[#6b946d] disabled:bg-slate-300 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                {completing ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" /> Setting up...</>
                ) : (
                  <>Go to Dashboard <ArrowRight className="w-4 h-4" aria-hidden="true" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}