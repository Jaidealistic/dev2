'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAccessibility } from './providers/AccessibilityProvider';

export default function ThemeToggle() {
    const { preferences, updatePreference } = useAccessibility();
    const isDark = preferences.colorScheme === 'dark';

    const toggleTheme = () => {
        updatePreference('colorScheme', isDark ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#6b6b6b] hover:bg-[#f0ede8] border border-[#e8e5e0] transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
            {isDark ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
}
