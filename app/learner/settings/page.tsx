/**
 * LEARNER SETTINGS PAGE — Calm Design System
 */

'use client';

import React, { useState } from 'react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import { useToast } from '@/components/providers/ToastProvider';
import {
  Eye,
  Volume2,
  Shield,
  Bell,
  Check,
  Save,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function LearnerSettingsPage() {
  const { preferences, setPreferences } = useAccessibility();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    fontFamily: preferences.fontFamily || 'lexend',
    fontSize: preferences.fontSize || 18,
    lineSpacing: preferences.lineSpacing || 1.6,
    letterSpacing: preferences.letterSpacing || 0.05,
    colorScheme: (preferences.colorScheme || 'light') as 'light' | 'dark',
    reducedMotion: preferences.reducedMotion || false,
    captionsEnabled: preferences.speechShowSubtitles ?? true,
    audioDescriptions: false,
    speechRecognition: preferences.enableSpeechRec || false,
    autoplayAudio: false,
    backgroundMusic: false,
    notificationsEnabled: true,
    emailNotifications: true,
    progressReports: true,
    profileVisibility: 'private' as 'public' | 'friends' | 'private',
    shareProgressWithParents: true,
    shareProgressWithEducators: true,
    // Learning Support Modes
    adhdMode: preferences.adhdMode || false,
    dyslexiaMode: preferences.dyslexiaMode || false,
    autismMode: preferences.autismMode || false,
    apdMode: preferences.apdMode || false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // Apply preferences locally first (always works)
      setPreferences({
        fontFamily: formData.fontFamily,
        fontSize: formData.fontSize,
        lineSpacing: formData.lineSpacing,
        letterSpacing: formData.letterSpacing,
        colorScheme: formData.colorScheme,
        reducedMotion: formData.reducedMotion,
        speechShowSubtitles: formData.captionsEnabled,
        enableSpeechRec: formData.speechRecognition,
        // Learning Support Modes
        adhdMode: formData.adhdMode,
        dyslexiaMode: formData.dyslexiaMode,
        autismMode: formData.autismMode,
        apdMode: formData.apdMode,
      });

      // Try to persist to server (non-blocking — fail silently)
      try {
        const response = await fetch('/api/learner/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) console.warn('Settings API unavailable, saved locally only.');
      } catch {
        console.warn('Settings API unavailable, saved locally only.');
      }

      setSaveSuccess(true);
      success('Settings saved', 'Your preferences have been updated.');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      toastError('Could not save settings', 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Compact header */}
      <header className="border-b border-[#f0ede8] bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/learner/dashboard" className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#2d2d2d] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h1 className="text-base font-semibold text-[#2d2d2d]">Settings</h1>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#7a9b7e] hover:bg-[#6b8c6f] text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                <span>Saving</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-5">
        {/* Page intro */}
        <p className="text-sm text-[#8a8a8a]">Customise your learning experience and privacy preferences.</p>

        {/* ── Learning Support Modes ── */}
        <Section icon={<Shield className="w-[18px] h-[18px]" />} title="Learning Support Modes">
          <p className="text-sm text-[#6b6b6b] mb-4">
            Enable specialized features designed for your learning style.
          </p>
          <div className="space-y-3">
            <ToggleOption
              label="ADHD Focus Mode"
              description="Simplifies interface, breaks lessons into single sentences, and enables focus timers."
              checked={formData.adhdMode}
              onChange={(c) => setFormData({ ...formData, adhdMode: c })}
            />
            <ToggleOption
              label="Dyslexia Support"
              description="Uses OpenDyslexic font, increases letter spacing, and enables text-to-speech helpers."
              checked={formData.dyslexiaMode}
              onChange={(c) => setFormData({ ...formData, dyslexiaMode: c })}
            />
            <ToggleOption
              label="Autism Structure"
              description="Enables predictable layouts, clear instructions, and removes ambiguous metaphors."
              checked={formData.autismMode}
              onChange={(c) => setFormData({ ...formData, autismMode: c })}
            />
            <ToggleOption
              label="Auditory Processing (APD)"
              description="Emphasizes visual cues, subtitles, and reduces background noise."
              checked={formData.apdMode}
              onChange={(c) => setFormData({ ...formData, apdMode: c })}
            />
          </div>
        </Section>

        {/* ── Accessibility ── */}
        <Section icon={<Eye className="w-[18px] h-[18px]" />} title="Accessibility">
          {/* Font Style */}
          <FieldLabel>Font style</FieldLabel>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { value: 'lexend', label: 'Lexend', stack: '"Lexend", system-ui, sans-serif' },
              { value: 'opendyslexic', label: 'OpenDyslexic', stack: '"OpenDyslexic", system-ui, sans-serif' },
              { value: 'atkinson', label: 'Atkinson', stack: '"Atkinson Hyperlegible", system-ui, sans-serif' },
            ].map((font) => (
              <button
                key={font.value}
                onClick={() => setFormData({ ...formData, fontFamily: font.value as typeof formData.fontFamily })}
                className={`relative py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${formData.fontFamily === font.value
                  ? 'border-[#7a9b7e] bg-[#7a9b7e]/8 text-[#2d2d2d]'
                  : 'border-[#e8e5e0] text-[#6b6b6b] hover:border-[#c5c0b8]'
                  }`}
                style={{ fontFamily: font.stack }}
              >
                {font.label}
                {formData.fontFamily === font.value && (
                  <Check className="absolute top-1.5 right-1.5 w-3.5 h-3.5 text-[#7a9b7e]" />
                )}
              </button>
            ))}
          </div>

          {/* Text Size */}
          <FieldLabel>Text size — {formData.fontSize}px</FieldLabel>
          <input
            type="range"
            min="14"
            max="28"
            step="2"
            value={formData.fontSize}
            onChange={(e) => setFormData({ ...formData, fontSize: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-[#e8e5e0] rounded-full appearance-none cursor-pointer accent-[#7a9b7e] mb-1"
          />
          <div className="flex justify-between text-xs text-[#8a8a8a] mb-6">
            <span>14px</span>
            <span>28px</span>
          </div>

          {/* Line Spacing */}
          <FieldLabel>Line spacing — {formData.lineSpacing.toFixed(1)}</FieldLabel>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.1"
            value={formData.lineSpacing}
            onChange={(e) => setFormData({ ...formData, lineSpacing: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-[#e8e5e0] rounded-full appearance-none cursor-pointer accent-[#7a9b7e] mb-1"
          />
          <div className="flex justify-between text-xs text-[#8a8a8a] mb-6">
            <span>1.0</span>
            <span>2.5</span>
          </div>

          {/* Color Scheme */}
          <FieldLabel>Colour scheme</FieldLabel>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { value: 'light', label: 'Light', swatch: 'bg-white border-[#e8e5e0]' },
              { value: 'dark', label: 'Dark', swatch: 'bg-[#1e1e1e] border-[#333]' },
            ].map((scheme) => (
              <button
                key={scheme.value}
                onClick={() => setFormData({ ...formData, colorScheme: scheme.value as any })}
                className={`flex items-center gap-2.5 py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${formData.colorScheme === scheme.value
                  ? 'border-[#7a9b7e] bg-[#7a9b7e]/8 text-[#2d2d2d]'
                  : 'border-[#e8e5e0] text-[#6b6b6b] hover:border-[#c5c0b8]'
                  }`}
              >
                <span className={`w-4 h-4 rounded-full border ${scheme.swatch} flex-shrink-0`} />
                {scheme.label}
              </button>
            ))}
          </div>

          {/* Toggles */}
          <div className="space-y-2">
            <ToggleOption
              label="Reduced motion"
              description="Minimise animations and transitions"
              checked={formData.reducedMotion}
              onChange={(v) => setFormData({ ...formData, reducedMotion: v })}
            />
            <ToggleOption
              label="Captions"
              description="Show text captions for audio and video"
              checked={formData.captionsEnabled}
              onChange={(v) => setFormData({ ...formData, captionsEnabled: v })}
            />
            <ToggleOption
              label="Speech recognition"
              description="Enable voice input for pronunciation practice"
              checked={formData.speechRecognition}
              onChange={(v) => setFormData({ ...formData, speechRecognition: v })}
            />
          </div>
        </Section>

        {/* ── Audio & Visual ── */}
        <Section icon={<Volume2 className="w-[18px] h-[18px]" />} title="Audio & Visual">
          <div className="space-y-2">
            <ToggleOption
              label="Autoplay audio"
              description="Automatically play audio when entering a lesson"
              checked={formData.autoplayAudio}
              onChange={(v) => setFormData({ ...formData, autoplayAudio: v })}
            />
            <ToggleOption
              label="Background music"
              description="Play subtle music during lessons"
              checked={formData.backgroundMusic}
              onChange={(v) => setFormData({ ...formData, backgroundMusic: v })}
            />
            <ToggleOption
              label="Audio descriptions"
              description="Provide audio descriptions for visual content"
              checked={formData.audioDescriptions}
              onChange={(v) => setFormData({ ...formData, audioDescriptions: v })}
            />
          </div>
        </Section>

        {/* ── Privacy ── */}
        <Section icon={<Shield className="w-[18px] h-[18px]" />} title="Privacy">
          <FieldLabel>Profile visibility</FieldLabel>
          <div className="space-y-1.5 mb-5">
            {[
              { value: 'private', label: 'Private', desc: 'Only you can see your profile' },
              { value: 'friends', label: 'Friends only', desc: 'Only approved friends can see' },
              { value: 'public', label: 'Public', desc: 'Anyone can see your profile' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFormData({ ...formData, profileVisibility: opt.value as any })}
                className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-lg border text-left transition-all ${formData.profileVisibility === opt.value
                  ? 'border-[#7a9b7e] bg-[#7a9b7e]/8'
                  : 'border-[#e8e5e0] hover:border-[#c5c0b8]'
                  }`}
              >
                <div>
                  <p className="text-sm font-medium text-[#2d2d2d]">{opt.label}</p>
                  <p className="text-xs text-[#8a8a8a]">{opt.desc}</p>
                </div>
                {formData.profileVisibility === opt.value && (
                  <Check className="w-4 h-4 text-[#7a9b7e] flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <ToggleOption
              label="Share progress with parents"
              description="Allow parents to see your learning progress"
              checked={formData.shareProgressWithParents}
              onChange={(v) => setFormData({ ...formData, shareProgressWithParents: v })}
            />
            <ToggleOption
              label="Share progress with educators"
              description="Allow educators to see your progress and provide support"
              checked={formData.shareProgressWithEducators}
              onChange={(v) => setFormData({ ...formData, shareProgressWithEducators: v })}
            />
          </div>
        </Section>

        {/* ── Notifications ── */}
        <Section icon={<Bell className="w-[18px] h-[18px]" />} title="Notifications">
          <div className="space-y-2">
            <ToggleOption
              label="Push notifications"
              description="Receive notifications on this device"
              checked={formData.notificationsEnabled}
              onChange={(v) => setFormData({ ...formData, notificationsEnabled: v })}
            />
            <ToggleOption
              label="Email notifications"
              description="Receive updates via email"
              checked={formData.emailNotifications}
              onChange={(v) => setFormData({ ...formData, emailNotifications: v })}
            />
            <ToggleOption
              label="Weekly progress reports"
              description="Get a summary of your weekly progress"
              checked={formData.progressReports}
              onChange={(v) => setFormData({ ...formData, progressReports: v })}
            />
          </div>
        </Section>

        {/* Bottom save (mobile convenience) */}
        <div className="pt-2 pb-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-[#7a9b7e] hover:bg-[#6b8c6f] text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving…' : saveSuccess ? 'Saved' : 'Save changes'}
          </button>
        </div>
      </main>
    </div>
  );
}

/* ── Reusable pieces ────────────────────────────────────────────── */

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#f0ede8] p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#f0ede8]">
        <span className="text-[#7a9b7e]">{icon}</span>
        <h2 className="text-sm font-semibold text-[#2d2d2d] tracking-wide uppercase">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-[#2d2d2d] mb-2">{children}</p>;
}

interface ToggleOptionProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleOption({ label, description, checked, onChange }: ToggleOptionProps) {
  return (
    <div className="flex items-center justify-between py-3 px-3.5 rounded-lg hover:bg-[#faf9f7] transition-colors">
      <div className="flex-1 mr-4">
        <p className="text-sm font-medium text-[#2d2d2d]">{label}</p>
        <p className="text-xs text-[#8a8a8a] mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-[#7a9b7e]' : 'bg-[#d5d2cd]'
          }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${checked ? 'translate-x-5' : 'translate-x-1'
            }`}
        />
      </button>
    </div>
  );
}
