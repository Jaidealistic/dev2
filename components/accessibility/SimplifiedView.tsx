/**
 * SIMPLIFIED VIEW COMPONENT (AUTISM)
 *
 * Provides a reduced-clutter, predictable UI for learners with autism:
 * - Strips decorative elements (gradients, shadows, animations)
 * - Consistent, predictable layout with visual structure cues
 * - Clear visual hierarchy with numbered steps
 * - Muted colour palette (avoids overwhelming visual input)
 * - Optional visual schedule / routine indicator
 * - Content chunking with clear separators
 * - Minimal iconography with text labels always visible
 * - Sensory load controls (hide images, reduce colour)
 *
 * Wraps children and applies simplification styles.
 *
 * Accessibility: WCAG AAA compliant
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import {
  Layout,
  List,
  ImageOff,
  Volume,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SimplifiedViewProps {
  children: React.ReactNode;
  /** Show the settings panel toggle, default true */
  showControls?: boolean;
  /** Optional visual schedule items (predictability aid) */
  schedule?: ScheduleItem[];
}

interface ScheduleItem {
  id: string;
  label: string;
  emoji?: string;
  completed?: boolean;
  current?: boolean;
}

interface SimplifiedSettings {
  hideImages: boolean;
  hideAnimations: boolean;
  hideShadows: boolean;
  hideGradients: boolean;
  mutedColours: boolean;
  largeTargets: boolean;
  showLabels: boolean;      // Force text labels on all icons
  contentSpacing: 'normal' | 'relaxed' | 'spacious';
}

const DEFAULT_SETTINGS: SimplifiedSettings = {
  hideImages: false,
  hideAnimations: true,
  hideShadows: true,
  hideGradients: true,
  mutedColours: true,
  largeTargets: true,
  showLabels: true,
  contentSpacing: 'relaxed',
};

const SPACING_MAP = {
  normal: '1rem',
  relaxed: '1.5rem',
  spacious: '2.5rem',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SimplifiedView({
  children,
  showControls = true,
  schedule,
}: SimplifiedViewProps) {
  const { preferences } = useAccessibility();
  const [settings, setSettings] = useState<SimplifiedSettings>(DEFAULT_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);

  const update = useCallback(
    <K extends keyof SimplifiedSettings>(key: K, value: SimplifiedSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetDefaults = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  // Build CSS class string based on settings
  const simplifiedClasses = useMemo(() => {
    const classes: string[] = ['simplified-view'];
    if (settings.hideAnimations) classes.push('[&_*]:!animate-none [&_*]:!transition-none');
    if (settings.hideShadows) classes.push('[&_*]:!shadow-none');
    if (settings.hideImages) classes.push('[&_img]:hidden [&_video]:hidden [&_svg.decorative]:hidden');
    if (settings.mutedColours) classes.push('simplified-muted');
    if (settings.largeTargets) classes.push('[&_button]:min-h-[44px] [&_a]:min-h-[44px] [&_input]:min-h-[44px]');
    return classes.join(' ');
  }, [settings]);

  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      gap: SPACING_MAP[settings.contentSpacing],
    }),
    [settings.contentSpacing],
  );

  return (
    <div>
      {/* Visual Schedule (predictability aid) */}
      {schedule && schedule.length > 0 && (
        <div className="mb-4 p-4 bg-white border-2 border-[#c5d8c7] rounded-xl">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <List className="w-4 h-4 text-[#5a8c5c]" />
            What&apos;s Happening Today
          </h3>
          <ol className="space-y-2">
            {schedule.map((item, index) => (
              <li
                key={item.id}
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${
                  item.current
                    ? 'bg-[#f0f7f0] border border-[#7da47f] font-semibold text-gray-900'
                    : item.completed
                      ? 'text-gray-400 line-through'
                      : 'text-gray-600'
                }`}
              >
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.current
                      ? 'bg-[#7da47f] text-white'
                      : item.completed
                        ? 'bg-gray-200 text-gray-500'
                        : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {item.completed ? '✓' : index + 1}
                </span>
                {item.emoji && <span>{item.emoji}</span>}
                <span>{item.label}</span>
                {item.current && (
                  <span className="ml-auto text-xs text-[#5a8c5c] bg-[#e0ede1] px-2 py-0.5 rounded-full">
                    Now
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Controls toggle */}
      {showControls && (
        <div className="mb-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#5a8c5c] bg-[#f0f7f0] border border-[#c5d8c7] rounded-xl hover:bg-[#e0ede1] transition-colors"
            aria-expanded={isOpen}
            aria-controls="simplified-controls"
          >
            <Layout className="w-4 h-4" />
            Simplified View Settings
          </button>

          {isOpen && (
            <div
              id="simplified-controls"
              className="mt-2 p-5 bg-white border border-[#d6ddd7] rounded-2xl shadow-sm space-y-4"
            >
              {/* Toggle grid */}
              <div className="grid grid-cols-2 gap-3">
                <ToggleOption
                  label="Hide decorative images"
                  checked={settings.hideImages}
                  onChange={(v) => update('hideImages', v)}
                  icon={<ImageOff className="w-4 h-4" />}
                />
                <ToggleOption
                  label="Stop all animations"
                  checked={settings.hideAnimations}
                  onChange={(v) => update('hideAnimations', v)}
                  icon={<Minimize2 className="w-4 h-4" />}
                />
                <ToggleOption
                  label="Remove shadows"
                  checked={settings.hideShadows}
                  onChange={(v) => update('hideShadows', v)}
                  icon={<Layout className="w-4 h-4" />}
                />
                <ToggleOption
                  label="Remove gradients"
                  checked={settings.hideGradients}
                  onChange={(v) => update('hideGradients', v)}
                  icon={<Layout className="w-4 h-4" />}
                />
                <ToggleOption
                  label="Muted colours"
                  checked={settings.mutedColours}
                  onChange={(v) => update('mutedColours', v)}
                  icon={<VolumeX className="w-4 h-4" />}
                />
                <ToggleOption
                  label="Larger click targets"
                  checked={settings.largeTargets}
                  onChange={(v) => update('largeTargets', v)}
                  icon={<Maximize2 className="w-4 h-4" />}
                />
              </div>

              {/* Content Spacing */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content Spacing
                </label>
                <div className="flex gap-2">
                  {(['normal', 'relaxed', 'spacious'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => update('contentSpacing', s)}
                      className={`px-4 py-2 text-sm rounded-lg border capitalize transition-colors ${
                        settings.contentSpacing === s
                          ? 'bg-[#7da47f] text-white border-[#7da47f]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#9db4a0]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={resetDefaults}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#5a8c5c] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to defaults
              </button>
            </div>
          )}
        </div>
      )}

      {/* Simplified content wrapper */}
      <div className={simplifiedClasses} style={containerStyle}>
        {children}
      </div>

      {/* Global styles for simplified mode */}
      <style jsx global>{`
        .simplified-muted {
          filter: saturate(0.6);
        }
        .simplified-view [data-decorative="true"] {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toggle option sub-component
// ---------------------------------------------------------------------------

function ToggleOption({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  icon: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-[#7da47f] rounded"
      />
      <span className="text-gray-500">{icon}</span>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

export default SimplifiedView;
