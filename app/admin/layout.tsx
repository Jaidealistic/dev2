'use client';

import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </LanguageProvider>
  );
}
