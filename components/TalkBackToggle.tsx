'use client';

/**
 * TALKBACK TOGGLE — Floating button + overlay integration
 *
 * Renders:
 * 1. A floating toggle button (bottom-left) to enable/disable TalkBack mode
 * 2. The TalkBackOverlay when enabled
 *
 * Uses the AccessibilityProvider context for persistence.
 */

import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import TalkBackOverlay from '@/components/TalkBackOverlay';
import { Volume2, VolumeX } from 'lucide-react';

export default function TalkBackToggle() {
  const { preferences, updatePreference } = useAccessibility();
  const enabled = preferences.screenReaderMode;

  return (
    <>
      <TalkBackOverlay enabled={enabled} />
      <button
        data-talkback-toggle="true"
        onClick={() => updatePreference('screenReaderMode', !enabled)}
        className={`fixed bottom-6 left-6 z-[100000] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
          enabled
            ? 'bg-[#5a8c5c] text-white hover:bg-[#4a7c4c] focus:ring-[#7da47f]'
            : 'bg-white text-[#6b6b6b] hover:bg-gray-50 border border-gray-200 focus:ring-gray-300'
        }`}
        aria-label={enabled ? 'Disable TalkBack mode' : 'Enable TalkBack mode'}
        title={enabled ? 'TalkBack: ON — Single tap reads, double tap activates' : 'Enable TalkBack mode'}
      >
        {enabled ? (
          <Volume2 className="w-6 h-6" aria-hidden="true" />
        ) : (
          <VolumeX className="w-6 h-6" aria-hidden="true" />
        )}
      </button>
      {enabled && (
        <div className="fixed bottom-[5.5rem] left-6 z-[100000] bg-[#5a8c5c] text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md" aria-hidden="true">
          TalkBack ON
        </div>
      )}
    </>
  );
}
