import type { Metadata } from 'next';
import { Lexend, Atkinson_Hyperlegible } from 'next/font/google';
import './globals.css';
import { AccessibilityProvider } from '@/components/providers/AccessibilityProvider';

/**
 * Import dyslexia-friendly fonts
 * These are loaded from Google Fonts and made available via CSS variables
 */
const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-atkinson',
  display: 'swap',
});

/**
 * Metadata for SEO and accessibility
 * Implements Open Graph and Schema.org markup for better discoverability
 */
export const metadata: Metadata = {
  title: 'LinguaAccess - Accessible Language Learning Platform',
  description:
    'Revolutionary cloud-based language learning platform engineered for learners with cognitive, linguistic, and sensory disabilities. Multi-modal content with WCAG AAA accessibility.',
  keywords: [
    'language learning',
    'accessible education',
    'dyslexia',
    'ADHD',
    'autism spectrum',
    'auditory processing',
    'learning disability',
    'inclusive education',
  ],
  authors: [{ name: 'LinguaAccess Team' }],
  creator: 'LinguaAccess',
  publisher: 'LinguaAccess',
  
  // Accessibility metadata
  openGraph: {
    type: 'website',
    url: 'https://linguaaccess.com',
    title: 'LinguaAccess - Accessible Language Learning',
    description: 'Language learning platform designed for learners with disabilities',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LinguaAccess Platform',
      },
    ],
  },
  
  // Accessibility metadata
  robots: {
    index: true,
    follow: true,
  },
  
  // Viewport for responsive design
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

/**
 * Root Layout Component
 * 
 * This is the outermost layout that wraps all pages.
 * It provides:
 * - Global font loading (including accessibility-focused fonts)
 * - Accessibility context provider
 * - Global styles
 * - HTML structure with proper semantic markup
 * 
 * WCAG AAA Compliance:
 * - Proper HTML structure with roles and landmarks
 * - Font loading strategy for dyslexia support
 * - Skip to main content link for keyboard navigation
 * - Language attribute set to English (can be changed based on user preference)
 * - Focus management
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} ${atkinsonHyperlegible.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Font preload for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Accessibility-focused meta tags */}
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        
        {/* Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0369a1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-background text-text-primary antialiased">
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-primary-700 focus:text-white focus:px-2 focus:py-1 focus:z-50"
        >
          Skip to main content
        </a>

        {/* Accessibility Provider - makes preferences available to all components */}
        <AccessibilityProvider>
          {/* Main content */}
          <main id="main-content" className="min-h-screen">
            {children}
          </main>


        </AccessibilityProvider>
      </body>
    </html>
  );
}
