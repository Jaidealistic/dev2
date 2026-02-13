import Link from 'next/link';
import { Mic, Gamepad2, Settings, BookOpen, Users, GraduationCap, ArrowRight, Shield, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header className="border-b border-[#e8e5e0] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold text-[#2d2d2d]">
            LexFix
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-5 py-2 rounded-lg text-sm font-medium text-[#6b6b6b] hover:bg-[#f5f3ef] hover:text-[#2d2d2d] transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="px-5 py-2 rounded-lg bg-[#7a9b7e] text-white text-sm font-medium hover:bg-[#6b8c6f] transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-14 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f0f4f0] text-[#5d7e61] rounded-full text-sm font-medium mb-5">
          <Globe className="w-4 h-4" /> English &amp; Tamil — Accessible for everyone
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold text-[#2d2d2d] mb-4 max-w-2xl mx-auto" style={{ lineHeight: '1.25' }}>
          Language learning{' '}
          <span className="text-[#7a9b7e]">designed for you</span>
        </h1>
        <p className="text-sm text-[#6b6b6b] mb-7 max-w-lg mx-auto" style={{ lineHeight: '1.7' }}>
          Inclusive, autism-friendly language learning with personalised tools that adapt to every learner&apos;s needs.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup" className="inline-flex items-center px-7 py-3 bg-[#7a9b7e] text-white font-medium rounded-xl hover:bg-[#6b8c6f] transition-colors text-sm">
            Start learning free
          </Link>
          <Link href="/login" className="px-7 py-3 border border-[#e8e5e0] text-[#2d2d2d] font-medium rounded-xl hover:bg-[#f5f3ef] transition-colors text-sm">
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold text-center text-[#2d2d2d] mb-1.5">Why LexFix works</h2>
        <p className="text-center text-[#8a8a8a] mb-7 max-w-md mx-auto text-sm" style={{ lineHeight: '1.7' }}>
          Built from the ground up to be accessible, engaging, and effective.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 border border-[#f0ede8]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="w-10 h-10 bg-[#f0f4f0] rounded-lg flex items-center justify-center mb-4">
              <Mic className="w-5 h-5 text-[#7a9b7e]" />
            </div>
            <h3 className="text-base font-semibold text-[#2d2d2d] mb-2">Text-to-Speech</h3>
            <p className="text-sm text-[#6b6b6b]" style={{ lineHeight: '1.7' }}>
              Listen to any text read aloud with clear, natural voices at your own pace.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#f0ede8]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="w-10 h-10 bg-[#edf2f7] rounded-lg flex items-center justify-center mb-4">
              <Gamepad2 className="w-5 h-5 text-[#7a97b0]" />
            </div>
            <h3 className="text-base font-semibold text-[#2d2d2d] mb-2">Pattern Login</h3>
            <p className="text-sm text-[#6b6b6b]" style={{ lineHeight: '1.7' }}>
              Students sign in with a visual pattern instead of a password — simple and accessible.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-[#f0ede8]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="w-10 h-10 bg-[#f0f4f0] rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-5 h-5 text-[#7a9b7e]" />
            </div>
            <h3 className="text-base font-semibold text-[#2d2d2d] mb-2">Personalised Settings</h3>
            <p className="text-sm text-[#6b6b6b]" style={{ lineHeight: '1.7' }}>
              Customise fonts, colours, spacing, and more to create your perfect learning environment.
            </p>
          </div>
        </div>
      </section>

      {/* For Everyone */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold text-center text-[#2d2d2d] mb-7">Built for everyone</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#f0f4f0] rounded-xl p-5 border border-[#d4dcd5]">
            <GraduationCap className="w-6 h-6 text-[#5d7e61] mb-3" />
            <h3 className="text-base font-semibold text-[#2d2d2d] mb-2">Students</h3>
            <p className="text-sm text-[#6b6b6b]" style={{ lineHeight: '1.7' }}>
              Pattern-based login. Personalised English and Tamil lessons. Track your progress at your own pace.
            </p>
          </div>
          <div className="bg-[#f0f4f0] rounded-xl p-5 border border-[#d4dcd5]">
            <Users className="w-6 h-6 text-[#7a9b7e] mb-3" />
            <h3 className="text-base font-semibold text-[#2d2d2d] mb-2">Parents</h3>
            <p className="text-sm text-[#6b6b6b]" style={{ lineHeight: '1.7' }}>
              Link to your child using their Student ID. Monitor progress, view activity, and stay connected.
            </p>
          </div>
          <div className="bg-[#f0f4f0] rounded-xl p-5 border border-[#d4dcd5]">
            <Shield className="w-6 h-6 text-[#7a97b0] mb-3" />
            <h3 className="text-base font-semibold text-[#2d2d2d] mb-2">Safe and Accessible</h3>
            <p className="text-sm text-[#6b6b6b]" style={{ lineHeight: '1.7' }}>
              WCAG-compliant, autism-friendly design. High contrast mode, reduced motion, adjustable text settings.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-[#7a9b7e] rounded-xl p-8 text-center text-white">
          <h2 className="text-xl font-semibold mb-2">Ready to start learning?</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto text-sm" style={{ lineHeight: '1.7' }}>
            Join LexFix today and experience language learning that truly adapts to you.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-7 py-3 bg-white text-[#5d7e61] font-medium rounded-xl hover:bg-[#f0f4f0] transition-colors text-sm">
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8e5e0]">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm font-semibold text-[#2d2d2d]">LexFix</span>
          <p className="text-xs text-[#8a8a8a]">&copy; 2026 LexFix. Inclusive language learning for everyone.</p>
          <div className="flex gap-5 text-xs text-[#6b6b6b]">
            <span className="hover:text-[#2d2d2d] cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-[#2d2d2d] cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-[#2d2d2d] cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}