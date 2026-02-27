/**
 * ACCESSIBILITY TOOLBAR
 * 
 * Global toolbar component providing instant access to all accessibility features.
 * Always visible and accessible from any page in the application.
 * 
 * Features based on specification:
 * - Font family selector (system, Lexend, OpenDyslexic)
 * - Text size adjuster (8-48px range)
 * - Color scheme switcher (light, dark, sepia, high-contrast)
 * - Disability mode toggles (dyslexia, ADHD, autism, APD)
 * - Motion reduction toggle
 * - Reset to defaults
 */

'use client';

import React, { useState } from 'react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import {
  Settings,
  Type,
  Palette,
  Volume2,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';

export function AccessibilityToolbar() {
  const {
    preferences,
    updatePreference,
    resetPreferences,
    enableDyslexiaMode,
    enableAdhdMode,
    enableAutismMode,
    enableApdMode,
  } = useAccessibility();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  // Font options
  const fontOptions = [
    { value: 'system', label: 'System Default', description: 'Standard OS font' },
    { value: 'lexend', label: 'Lexend', description: 'Dyslexia-friendly' },
    { value: 'opendyslexic', label: 'OpenDyslexic', description: 'Specialized dyslexia font' },
    { value: 'atkinson', label: 'Atkinson Hyperlegible', description: 'High legibility' },
  ];

  // Color schemes
  const colorSchemes = [
    { value: 'light', label: 'Light', emoji: '☀️' },
    { value: 'dark', label: 'Dark', emoji: '🌙' },
    { value: 'sepia', label: 'Sepia', emoji: '📜' },
    { value: 'high-contrast', label: 'High Contrast', emoji: '⚫⚪' },
  ];

  // Disability modes
  const disabilityModes = [
    {
      id: 'dyslexia',
      label: 'Dyslexia Mode',
      description: 'Increased spacing, special fonts, syllable highlighting',
      enabled: preferences.dyslexiaMode,
      toggle: enableDyslexiaMode,
    },
    {
      id: 'adhd',
      label: 'ADHD Mode',
      description: 'Reduced distractions, focus mode, timers',
      enabled: preferences.adhdMode,
      toggle: enableAdhdMode,
    },
    {
      id: 'autism',
      label: 'Autism Mode',
      description: 'Predictable layout, reduced sensory input',
      enabled: preferences.autismMode,
      toggle: enableAutismMode,
    },
    {
      id: 'apd',
      label: 'APD Mode',
      description: 'Visual transcripts, adjustable playback',
      enabled: preferences.apdMode,
      toggle: enableApdMode,
    },
  ];

  function changeFontSize(delta: number) {
    const newSize = Math.max(8, Math.min(48, preferences.fontSize + delta));
    updatePreference('fontSize', newSize);
  }

  function togglePanel(panel: string) {
    setActivePanel(activePanel === panel ? null : panel);
  }

  return (
    <div 
      className="fixed bottom-6 right-6 z-50"
      role="region"
      aria-label="Accessibility controls"
    >
      {/* Compact Button (when collapsed) */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-[#9db4a0] hover:bg-[#8ca394] text-white rounded-full p-4 shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#9db4a0]/50"
          aria-label="Open accessibility toolbar"
          aria-expanded="false"
        >
          <Settings className="w-6 h-6" aria-hidden="true" />
        </button>
      )}

      {/* Expanded Toolbar */}
      {isExpanded && (
        <div 
          className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 p-6 w-96 max-h-[80vh] overflow-y-auto"
          role="dialog"
          aria-label="Accessibility settings"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-6 h-6" aria-hidden="true" />
              Accessibility
            </h2>
            <button
              onClick={() => {
                setIsExpanded(false);
                setActivePanel(null);
              }}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#9db4a0] rounded-lg p-2"
              aria-label="Close accessibility toolbar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mb-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Quick Actions
            </h3>

            {/* Text Size Controls */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Text Size: {preferences.fontSize}px
              </label>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => changeFontSize(-2)}
                  className="flex-1 bg-white border-2 border-gray-300 rounded-full px-4 py-3 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#9db4a0] transition-colors"
                  aria-label="Decrease text size"
                >
                  <ZoomOut className="w-5 h-5 mx-auto" aria-hidden="true" />
                </button>
                <span className="text-lg font-bold text-gray-900" aria-live="polite">
                  {preferences.fontSize}px
                </span>
                <button
                  onClick={() => changeFontSize(2)}
                  className="flex-1 bg-white border-2 border-gray-300 rounded-full px-4 py-3 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#9db4a0] transition-colors"
                  aria-label="Increase text size"
                >
                  <ZoomIn className="w-5 h-5 mx-auto" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-700">
                  Reduce Motion
                </span>
                <input
                  type="checkbox"
                  checked={preferences.reducedMotion}
                  onChange={(e) => updatePreference('reducedMotion', e.target.checked)}
                  className="w-6 h-6 rounded border-gray-300 text-[#9db4a0] focus:ring-[#9db4a0]"
                  aria-describedby="reduce-motion-desc"
                />
              </label>
              <p id="reduce-motion-desc" className="text-xs text-gray-500 mt-1">
                Minimize animations and transitions
              </p>
            </div>

            {/* Focus Mode Toggle */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-700">
                  Focus Mode
                </span>
                <input
                  type="checkbox"
                  checked={preferences.focusMode}
                  onChange={(e) => updatePreference('focusMode', e.target.checked)}
                  className="w-6 h-6 rounded border-gray-300 text-[#9db4a0] focus:ring-[#9db4a0]"
                  aria-describedby="focus-mode-desc"
                />
              </label>
              <p id="focus-mode-desc" className="text-xs text-gray-500 mt-1">
                Distraction-free learning environment
              </p>
            </div>
          </div>

          {/* Font Family Panel */}
          <div className="mb-4">
            <button
              onClick={() => togglePanel('font')}
              className="w-full flex items-center justify-between bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#9db4a0] transition-colors"
              aria-expanded={activePanel === 'font'}
            >
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-gray-700" aria-hidden="true" />
                <span className="font-medium text-gray-900">Font Family</span>
              </div>
              {activePanel === 'font' ? (
                <ChevronUp className="w-5 h-5 text-gray-500" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" aria-hidden="true" />
              )}
            </button>

            {activePanel === 'font' && (
              <div className="mt-2 space-y-2 pl-4" role="group" aria-label="Font family options">
                {fontOptions.map((font) => (
                  <label
                    key={font.value}
                    className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <input
                      type="radio"
                      name="fontFamily"
                      value={font.value}
                      checked={preferences.fontFamily === font.value}
                      onChange={(e) => updatePreference('fontFamily', e.target.value)}
                      className="mt-1 w-4 h-4 text-[#9db4a0] focus:ring-[#9db4a0]"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {font.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {font.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Color Scheme Panel */}
          <div className="mb-4">
            <button
              onClick={() => togglePanel('color')}
              className="w-full flex items-center justify-between bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#9db4a0] transition-colors"
              aria-expanded={activePanel === 'color'}
            >
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-gray-700" aria-hidden="true" />
                <span className="font-medium text-gray-900">Color Scheme</span>
              </div>
              {activePanel === 'color' ? (
                <ChevronUp className="w-5 h-5 text-gray-500" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" aria-hidden="true" />
              )}
            </button>

            {activePanel === 'color' && (
              <div className="mt-2 grid grid-cols-2 gap-2 pl-4" role="group" aria-label="Color scheme options">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.value}
                    onClick={() => updatePreference('colorScheme', scheme.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      preferences.colorScheme === scheme.value
                        ? 'border-[#9db4a0] bg-[#9db4a0]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    aria-pressed={preferences.colorScheme === scheme.value}
                  >
                    <div className="text-2xl mb-1">{scheme.emoji}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {scheme.label}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Disability Modes Panel */}
          <div className="mb-6">
            <button
              onClick={() => togglePanel('disability')}
              className="w-full flex items-center justify-between bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#9db4a0] transition-colors"
              aria-expanded={activePanel === 'disability'}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-gray-700" aria-hidden="true" />
                <span className="font-medium text-gray-900">Disability Modes</span>
              </div>
              {activePanel === 'disability' ? (
                <ChevronUp className="w-5 h-5 text-gray-500" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" aria-hidden="true" />
              )}
            </button>

            {activePanel === 'disability' && (
              <div className="mt-2 space-y-3 pl-4" role="group" aria-label="Disability mode options">
                {disabilityModes.map((mode) => (
                  <div
                    key={mode.id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4"
                  >
                    <label className="flex items-start justify-between cursor-pointer">
                      <div className="flex-1 mr-3">
                        <div className="text-sm font-medium text-gray-900">
                          {mode.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {mode.description}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={mode.enabled}
                        onChange={mode.toggle}
                        className="mt-1 w-6 h-6 rounded border-gray-300 text-[#9db4a0] focus:ring-[#9db4a0]"
                      />
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={resetPreferences}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full px-6 py-3 font-medium flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            aria-label="Reset all accessibility settings to defaults"
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
            Reset to Defaults
          </button>

          {/* Help Link */}
          <div className="mt-4 text-center">
            <a
              href="/help/accessibility"
              className="text-sm text-[#9db4a0] hover:text-[#8ca394] focus:outline-none focus:ring-2 focus:ring-[#9db4a0] rounded"
            >
              Learn more about accessibility features
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
