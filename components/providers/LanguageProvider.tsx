/**
 * LANGUAGE CONTEXT
 * 
 * React Context for managing UI language (English/Tamil)
 * Provides translation function and language switching
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, Translations } from '@/lib/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [language, setLanguageState] = useState<Language>('en');

    // Load saved language preference on mount
    useEffect(() => {
        const saved = localStorage.getItem('lexfix-ui-language') as Language;
        if (saved && (saved === 'en' || saved === 'ta')) {
            setLanguageState(saved);
        }
    }, []);

    // Save language preference when changed
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('lexfix-ui-language', lang);
    };

    // Translation function with nested key support (e.g., 'nav.dashboard')
    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback to English if translation not found
                value = translations['en'];
                for (const fallbackKey of keys) {
                    if (value && typeof value === 'object' && fallbackKey in value) {
                        value = value[fallbackKey];
                    } else {
                        return key; // Return key if not found in fallback
                    }
                }
                break;
            }
        }

        return typeof value === 'string' ? value : key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
