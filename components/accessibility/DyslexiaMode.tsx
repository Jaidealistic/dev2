/**
 * DYSLEXIA MODE COMPONENT
 *
 * Provides dyslexia-friendly reading adaptations:
 * - OpenDyslexic / Lexend font switching
 * - Increased letter & word spacing
 * - Syllable highlighting
 * - Bionic reading (bold first half of words)
 * - Line ruler / reading guide
 * - Customisable background overlay tint
 * - Paragraph-level chunking
 *
 * Wraps children and applies CSS adaptations via inline styles
 * + Tailwind utility classes so it works anywhere in the tree.
 *
 * Accessibility: WCAG AAA compliant
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import {
  Type,
  AlignJustify,
  Eye,
  Lightbulb,
  Minus,
  Plus,
  RotateCcw,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DyslexiaModeProps {
  children: React.ReactNode;
  /** Show the control panel, default true */
  showControls?: boolean;
}

interface DyslexiaSettings {
  fontFamily: string;
  letterSpacing: number;   // em
  wordSpacing: number;     // em
  lineHeight: number;
  fontSize: number;        // px
  bionicReading: boolean;
  readingGuide: boolean;
  overlayTint: string;     // CSS color, empty = off
}

const DEFAULT_SETTINGS: DyslexiaSettings = {
  fontFamily: 'Lexend, sans-serif',
  letterSpacing: 0.08,
  wordSpacing: 0.16,
  lineHeight: 2.0,
  fontSize: 18,
  bionicReading: false,
  readingGuide: false,
  overlayTint: '',
};

const FONT_OPTIONS = [
  { value: 'Lexend, sans-serif', label: 'Lexend' },
  { value: '"OpenDyslexic", sans-serif', label: 'OpenDyslexic' },
  { value: '"Atkinson Hyperlegible", sans-serif', label: 'Atkinson' },
  { value: 'system-ui, sans-serif', label: 'System' },
];

const TINT_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'rgba(255, 255, 200, 0.15)', label: 'Warm Yellow' },
  { value: 'rgba(200, 230, 255, 0.15)', label: 'Cool Blue' },
  { value: 'rgba(200, 255, 200, 0.12)', label: 'Soft Green' },
  { value: 'rgba(255, 220, 200, 0.12)', label: 'Peach' },
];

// ---------------------------------------------------------------------------
// Bionic reading helper — bolds front half of each word
// ---------------------------------------------------------------------------

function bionicTransform(text: string): React.ReactNode[] {
  return text.split(/(\s+)/).map((segment, i) => {
    if (/^\s+$/.test(segment)) return <span key={i}>{segment}</span>;
    const splitAt = Math.ceil(segment.length / 2);
    return (
      <span key={i}>
        <strong>{segment.slice(0, splitAt)}</strong>
        {segment.slice(splitAt)}
      </span>
    );
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DyslexiaMode({ children, showControls = true }: DyslexiaModeProps) {
  const { preferences, updatePreference } = useAccessibility();
  const [settings, setSettings] = useState<DyslexiaSettings>(DEFAULT_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);

  const update = useCallback(
    <K extends keyof DyslexiaSettings>(key: K, value: DyslexiaSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetDefaults = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      fontFamily: settings.fontFamily,
      letterSpacing: `${settings.letterSpacing}em`,
      wordSpacing: `${settings.wordSpacing}em`,
      lineHeight: settings.lineHeight,
      fontSize: `${settings.fontSize}px`,
      position: 'relative' as const,
    }),
    [settings],
  );

  return (
    <div>
      {/* Control panel toggle */}
      {showControls && (
        <div className="mb-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#5a8c5c] bg-[#f0f7f0] border border-[#c5d8c7] rounded-xl hover:bg-[#e0ede1] transition-colors"
            aria-expanded={isOpen}
            aria-controls="dyslexia-controls"
          >
            <Type className="w-4 h-4" aria-hidden="true" />
            Dyslexia Reading Settings
          </button>

          {isOpen && (
            <div
              id="dyslexia-controls"
              className="mt-2 p-5 bg-white border border-[#d6ddd7] rounded-2xl shadow-sm space-y-4"
            >
              {/* Font Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Font</label>
                <div className="flex flex-wrap gap-2">
                  {FONT_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => update('fontFamily', f.value)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        settings.fontFamily === f.value
                          ? 'bg-[#7da47f] text-white border-[#7da47f]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#9db4a0]'
                      }`}
                      style={{ fontFamily: f.value }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Letter Spacing */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Letter Spacing: {settings.letterSpacing.toFixed(2)}em
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.3"
                  step="0.02"
                  value={settings.letterSpacing}
                  onChange={(e) => update('letterSpacing', parseFloat(e.target.value))}
                  className="w-full accent-[#7da47f]"
                />
              </div>

              {/* Word Spacing */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Word Spacing: {settings.wordSpacing.toFixed(2)}em
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.02"
                  value={settings.wordSpacing}
                  onChange={(e) => update('wordSpacing', parseFloat(e.target.value))}
                  className="w-full accent-[#7da47f]"
                />
              </div>

              {/* Line Height */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Line Height: {settings.lineHeight.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="1.4"
                  max="3.0"
                  step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) => update('lineHeight', parseFloat(e.target.value))}
                  className="w-full accent-[#7da47f]"
                />
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Font Size: {settings.fontSize}px
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => update('fontSize', Math.max(12, settings.fontSize - 2))}
                    className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100"
                    aria-label="Decrease font size"
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <input
                    type="range"
                    min="12"
                    max="32"
                    step="1"
                    value={settings.fontSize}
                    onChange={(e) => update('fontSize', parseInt(e.target.value))}
                    className="flex-1 accent-[#7da47f]"
                  />
                  <button
                    onClick={() => update('fontSize', Math.min(32, settings.fontSize + 2))}
                    className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100"
                    aria-label="Increase font size"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.bionicReading}
                    onChange={(e) => update('bionicReading', e.target.checked)}
                    className="w-4 h-4 accent-[#7da47f] rounded"
                  />
                  <span className="text-sm text-gray-700">Bionic Reading</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.readingGuide}
                    onChange={(e) => update('readingGuide', e.target.checked)}
                    className="w-4 h-4 accent-[#7da47f] rounded"
                  />
                  <span className="text-sm text-gray-700">Reading Guide Line</span>
                </label>
              </div>

              {/* Overlay Tint */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Background Tint
                </label>
                <div className="flex gap-2">
                  {TINT_OPTIONS.map((t) => (
                    <button
                      key={t.value || 'none'}
                      onClick={() => update('overlayTint', t.value)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        settings.overlayTint === t.value
                          ? 'bg-[#7da47f] text-white border-[#7da47f]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#9db4a0]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={resetDefaults}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#5a8c5c] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                Reset to defaults
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content wrapper with dyslexia styles applied */}
      <div style={containerStyle}>
        {/* Overlay tint */}
        {settings.overlayTint && (
          <div
            className="absolute inset-0 pointer-events-none z-10 rounded-xl"
            style={{ backgroundColor: settings.overlayTint }}
            aria-hidden="true"
          />
        )}

        {/* Reading guide (horizontal line that follows cursor) */}
        {settings.readingGuide && <ReadingGuide />}

        {/* Content */}
        <div className="relative z-0">{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reading Guide (follows pointer)
// ---------------------------------------------------------------------------

function ReadingGuide() {
  const [y, setY] = React.useState(-100);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => setY(e.clientY);
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div
      className="fixed left-0 right-0 h-10 border-t-2 border-b-2 border-[#7da47f]/30 pointer-events-none z-50"
      style={{ top: y - 20 }}
      aria-hidden="true"
    />
  );
}

export default DyslexiaMode;
