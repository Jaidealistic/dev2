import { Suspense } from 'react';
import VerifyEmailClient from './VerifyEmailClient';

export const dynamic = 'force-dynamic';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400">Loading...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
