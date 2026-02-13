/**
 * LOGOUT PAGE
 * 
 * Handles user logout:
 * - Clears all auth tokens from localStorage
 * - Redirects to login page
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';

export default function LogoutPage() {
  const router = useRouter();
  const { resetPreferences } = useAccessibility();

  useEffect(() => {
    // Reset accessibility to defaults so next user starts clean
    resetPreferences();

    // Clear all user-specific accessibility preferences from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('a11y-preferences-')) {
        localStorage.removeItem(key);
      }
    });

    // Clear all auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userName');

    // Redirect to login
    router.push('/login');
  }, [router, resetPreferences]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f1eb]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#9db4a0] border-t-transparent mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Logging out...</p>
      </div>
    </div>
  );
}
