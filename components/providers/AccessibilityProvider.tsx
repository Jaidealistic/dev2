'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { AccessibilityPreferences } from '@/types';
import { getAccessibilityPrefs, updateAccessibilityPrefs } from '@/lib/api';

const defaultPreferences: AccessibilityPreferences = {
  fontFamily: 'lexend',
  fontSize: 17,
  lineSpacing: 1.75,
  letterSpacing: 0.01,
  colorScheme: 'light',
  reducedMotion: true,
  highlightText: false,
  bionicReading: false,
  focusMode: false,
  enableSpeechRec: true,
  speechRecLang: 'en-US',
  speechShowSubtitles: true,
  reduceFlashing: false,
  dyslexiaMode: false,
  adhdMode: false,
  autismMode: false,
  apdMode: false,
  screenReaderMode: false,
};

interface AccessibilityContextType {
  preferences: AccessibilityPreferences;
  setPreferences: (prefs: Partial<AccessibilityPreferences>) => void;
  updatePreference: (key: keyof AccessibilityPreferences, value: any) => void;
  resetPreferences: () => void;
  loadUserPreferences: () => void;
  enableDyslexiaMode: () => void;
  enableAdhdMode: () => void;
  enableAutismMode: () => void;
  enableApdMode: () => void;
  disableSpecialModes: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

function getUserStorageKey(): string | null {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const uid = payload.userId || payload.id || payload.sub || payload.email;
      if (uid) return `a11y-preferences-${uid}`;
    }
  } catch { /* ignore */ }
  return null;
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferencesState] = useState<AccessibilityPreferences>(defaultPreferences);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  const isLandingPage = useMemo(() => pathname === '/', [pathname]);

  // Load preferences for the current user from backend (source of truth)
  const loadUserPreferences = useCallback(async () => {
    const token = localStorage.getItem('token');
    const key = getUserStorageKey();

    if (token && key) {
      const result = await getAccessibilityPrefs();
      if (result && result.success && result.preferences) {
        const merged = { ...defaultPreferences, ...result.preferences };
        setPreferencesState(merged);
        localStorage.setItem(key, JSON.stringify(merged));
        return;
      }

      // Fallback to localStorage only if token exists
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPreferencesState({ ...defaultPreferences, ...parsed });
          return;
        } catch { /* ignore corrupt data */ }
      }
    }

    // No token or no saved data: always use defaults
    setPreferencesState(defaultPreferences);
  }, []);

  // Save preferences to backend and localStorage
  const setPreferences = useCallback((newPrefs: Partial<AccessibilityPreferences>) => {
    setPreferencesState(prev => {
      const updated = { ...prev, ...newPrefs };
      const key = getUserStorageKey();
      const token = localStorage.getItem('token');

      // Only persist to storage/backend if user is logged in
      if (token && key) {
        updateAccessibilityPrefs(updated);
        localStorage.setItem(key, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const updatePreference = useCallback((key: keyof AccessibilityPreferences, value: any) => {
    setPreferences({ [key]: value });
  }, [setPreferences]);

  // Reset to defaults and update backend
  const resetPreferences = useCallback(() => {
    setPreferencesState(defaultPreferences);
    const key = getUserStorageKey();
    if (key) localStorage.removeItem(key);
    const token = localStorage.getItem('token');
    if (token) {
      updateAccessibilityPrefs(defaultPreferences);
    }
    // Clear DOM styles
    const root = document.documentElement;
    root.style.setProperty('--font-family', getFontStack(defaultPreferences.fontFamily));
    root.style.setProperty('--font-size', `${defaultPreferences.fontSize}px`);
    root.style.setProperty('--line-spacing', `${defaultPreferences.lineSpacing}`);
    root.style.setProperty('--letter-spacing', `${defaultPreferences.letterSpacing}px`);
    root.style.setProperty('--bg-color', '#faf9f7');
    root.style.setProperty('--text-color', '#2d2d2d');
    root.style.setProperty('--border-color', '#e8e5e0');
    root.setAttribute('data-color-scheme', 'light');
    document.body.style.fontFamily = getFontStack(defaultPreferences.fontFamily);
    document.body.style.fontSize = `${defaultPreferences.fontSize}px`;
    document.body.style.lineHeight = `${defaultPreferences.lineSpacing}`;
    document.body.style.letterSpacing = `${defaultPreferences.letterSpacing}px`;
    document.body.style.removeProperty('background-color');
    document.body.style.removeProperty('color');
  }, []);

  // On mount: load preferences for current user or guest
  useEffect(() => {
    setIsMounted(true);

    const token = localStorage.getItem('token');
    if (token) {
      loadUserPreferences();
    } else {
      resetPreferences();
    }

    // Listen for custom logout event
    const handleLogout = () => {
      resetPreferences();
    };

    window.addEventListener('lexfix-logout', handleLogout);

    // Reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setPreferencesState(prev => ({ ...prev, reducedMotion: true }));
    }
    const motionHandler = (e: MediaQueryListEvent) => {
      setPreferencesState(prev => ({ ...prev, reducedMotion: e.matches }));
    };
    mediaQuery.addEventListener('change', motionHandler);

    return () => {
      window.removeEventListener('lexfix-logout', handleLogout);
      mediaQuery.removeEventListener('change', motionHandler);
    };
  }, [loadUserPreferences, resetPreferences]);

  const enableDyslexiaMode = useCallback(() => {
    setPreferences({
      dyslexiaMode: true,
      fontFamily: 'lexend',
      fontSize: 18,
      lineSpacing: 2,
      letterSpacing: 0.5,
      highlightText: true,
      bionicReading: true,
    });
  }, [setPreferences]);

  const enableAdhdMode = useCallback(() => {
    setPreferences({
      adhdMode: true,
      focusMode: true,
      reducedMotion: true,
      reduceFlashing: true,
    });
  }, [setPreferences]);

  const enableAutismMode = useCallback(() => {
    setPreferences({
      autismMode: true,
      reducedMotion: true,
      reduceFlashing: true,
      colorScheme: 'light',
      focusMode: true,
    });
  }, [setPreferences]);

  const enableApdMode = useCallback(() => {
    setPreferences({
      apdMode: true,
      enableSpeechRec: true,
      speechShowSubtitles: true,
    });
  }, [setPreferences]);

  const disableSpecialModes = useCallback(() => {
    setPreferences({
      dyslexiaMode: false,
      adhdMode: false,
      autismMode: false,
      apdMode: false,
    });
  }, [setPreferences]);

  const value: AccessibilityContextType = {
    preferences,
    setPreferences,
    updatePreference,
    resetPreferences,
    loadUserPreferences,
    enableDyslexiaMode,
    enableAdhdMode,
    enableAutismMode,
    enableApdMode,
    disableSpecialModes,
  };

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      <AccessibilityStyleInjector preferences={preferences} isLandingPage={isLandingPage} />
    </AccessibilityContext.Provider>
  );
}

/**
 * Hook to use accessibility preferences
 */
export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    // Return safe defaults during SSR when provider hasn't mounted yet
    const noop = () => { };
    return {
      preferences: defaultPreferences,
      setPreferences: noop as any,
      updatePreference: noop as any,
      resetPreferences: noop,
      loadUserPreferences: noop,
      enableDyslexiaMode: noop,
      enableAdhdMode: noop,
      enableAutismMode: noop,
      enableApdMode: noop,
      disableSpecialModes: noop,
    } as AccessibilityContextType;
  }
  return context;
}

/**
 * Component that injects CSS variables for accessibility preferences
 * This allows Tailwind and custom CSS to respond to user preferences
 */
function AccessibilityStyleInjector({
  preferences,
  isLandingPage
}: {
  preferences: AccessibilityPreferences;
  isLandingPage: boolean;
}) {
  useEffect(() => {
    const root = document.documentElement;

    if (isLandingPage) {
      // Affirmatively reset to defaults on landing page
      root.style.removeProperty('--font-family');
      root.style.removeProperty('--font-size');
      root.style.removeProperty('--line-spacing');
      root.style.removeProperty('--letter-spacing');
      root.style.removeProperty('--bg-color');
      root.style.removeProperty('--text-color');
      root.style.removeProperty('--border-color');
      root.removeAttribute('data-color-scheme');

      document.body.style.removeProperty('font-family');
      document.body.style.removeProperty('font-size');
      document.body.style.removeProperty('line-height');
      document.body.style.removeProperty('letter-spacing');
      document.body.style.removeProperty('background-color');
      document.body.style.removeProperty('color');

      const a11yClassNames = ['font-sans', 'font-lexend', 'font-opendyslexic', 'font-atkinson', 'dark', 'focus-mode', 'bionic-reading', 'reduce-motion'];
      a11yClassNames.forEach(cls => document.body.classList.remove(cls));

      const existingMotionStyle = document.getElementById('reduce-motion-styles');
      if (existingMotionStyle) existingMotionStyle.remove();

      return;
    }

    // Set CSS variables for font
    root.style.setProperty('--font-family', getFontStack(preferences.fontFamily));
    root.style.setProperty('--font-size', `${preferences.fontSize}px`);
    root.style.setProperty('--line-spacing', `${preferences.lineSpacing}`);
    root.style.setProperty('--letter-spacing', `${preferences.letterSpacing}px`);

    // Set color scheme
    const currentScheme = preferences.colorScheme || 'light';
    const scheme = getColorScheme(currentScheme);
    root.style.setProperty('--bg-color', scheme.bg);
    root.style.setProperty('--text-color', scheme.text);
    root.style.setProperty('--border-color', scheme.border);

    // Only override body inline styles for non-light schemes;
    // light mode uses the calm palette from globals.css.
    if (currentScheme !== 'light') {
      document.body.style.backgroundColor = scheme.bg;
      document.body.style.color = scheme.text;
    } else {
      document.body.style.removeProperty('background-color');
      document.body.style.removeProperty('color');
    }

    // Also set data attribute for CSS targeting
    root.setAttribute('data-color-scheme', currentScheme);

    // Apply accessibility classes to body without wiping existing classes
    const a11yClasses = [
      `font-${preferences.fontFamily === 'system' ? 'sans' : preferences.fontFamily}`,
      preferences.colorScheme === 'dark' ? 'dark' : '',
      preferences.focusMode ? 'focus-mode' : '',
      preferences.bionicReading ? 'bionic-reading' : '',
      preferences.reducedMotion ? 'reduce-motion' : '',
    ].filter(Boolean);

    // Remove old a11y classes and add new ones
    const a11yClassNames = ['font-sans', 'font-lexend', 'font-opendyslexic', 'dark', 'focus-mode', 'bionic-reading', 'reduce-motion'];
    a11yClassNames.forEach(cls => document.body.classList.remove(cls));
    a11yClasses.forEach(cls => document.body.classList.add(cls));

    // Also apply inline styles for font-family to ensure it works even without Tailwind utility
    document.body.style.fontFamily = getFontStack(preferences.fontFamily);
    document.body.style.fontSize = `${preferences.fontSize}px`;
    document.body.style.lineHeight = `${preferences.lineSpacing}`;
    document.body.style.letterSpacing = `${preferences.letterSpacing}px`;

    // Explicitly set on root for rem scaling
    root.style.fontSize = `${preferences.fontSize}px`;

    // Disable animations if reduced motion is enabled
    if (preferences.reducedMotion) {
      const style = document.createElement('style');
      style.innerHTML = `
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      style.id = 'reduce-motion-styles';
      document.head.appendChild(style);
      return () => {
        const existing = document.getElementById('reduce-motion-styles');
        if (existing) existing.remove();
      };
    }
  }, [preferences]);

  return null;
}

/**
 * Get font stack based on user preference
 * Ensures fallback fonts if custom fonts don't load
 */
function getFontStack(fontFamily: string): string {
  const stacks: Record<string, string> = {
    system: 'system-ui, -apple-system, sans-serif',
    lexend: '"Lexend", system-ui, sans-serif',
    opendyslexic: '"OpenDyslexic", system-ui, sans-serif',
    atkinson: '"Atkinson Hyperlegible", system-ui, sans-serif',
  };
  return stacks[fontFamily] || stacks.lexend;
}

/**
 * Get color scheme values for different modes
 * All schemes meet WCAG AAA 7:1 contrast ratio
 */
function getColorScheme(scheme: string) {
  const schemes: Record<string, { bg: string; text: string; border: string }> = {
    light: {
      bg: '#faf9f7',
      text: '#2d2d2d',
      border: '#e8e5e0',
    },
    dark: {
      bg: '#1f2937',
      text: '#f9fafb',
      border: '#4b5563',
    },
  };
  return schemes[scheme] || schemes.light;
}
