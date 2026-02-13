/**
 * EMAIL VERIFICATION PAGE
 * 
 * Email verification page with form
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { VerifyEmailForm } from '@/components/forms/VerifyEmailForm';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [initialEmail, setInitialEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check URL params first
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setInitialEmail(emailParam);
      return;
    }

    // Then check sessionStorage
    const storedEmail = sessionStorage.getItem('verifyEmail');
    if (storedEmail) {
      setInitialEmail(storedEmail);
    }
  }, [searchParams]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="texttext-5xl">✉️</div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Verify Your Email
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          We sent a 6-character verification code to your email address
        </p>
      </div>

      {/* Form */}
      <div className="flex justify-center">
        <VerifyEmailForm
          initialEmail={initialEmail || undefined}
        />
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* What is verification? */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-900/20">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            Why Verify?
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>✓ Prevents unauthorized account creation</li>
            <li>✓ Secures your account</li>
            <li>✓ Enables password recovery</li>
            <li>✓ Allows important notifications</li>
          </ul>
        </div>

        {/* Having trouble? */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-900/20">
          <h3 className="font-semibold text-amber-900 dark:text-amber-100">
            Having Trouble?
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-amber-800 dark:text-amber-200">
            <li>📧 Check your spam folder</li>
            <li>⏰ Code expires in 24 hours</li>
            <li>🔤 Code is case-insensitive</li>
            <li>💬 Need help? Contact support</li>
          </ul>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/30">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Your Sign-Up Journey
        </h3>
        <div className="mt-6 flex items-center justify-between">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">
              ✓
            </div>
            <p className="mt-2 text-xs font-medium text-gray-900 dark:text-white">
              Account Created
            </p>
          </div>

          {/* Line */}
          <div className="flex-1 border-t-2 border-gray-300 dark:border-gray-600"></div>

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-white font-semibold">
              2
            </div>
            <p className="mt-2 text-xs font-medium text-gray-900 dark:text-white">
              Verify Email
            </p>
          </div>

          {/* Line */}
          <div className="flex-1 border-t-2 border-gray-300 dark:border-gray-600"></div>

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-gray-900 dark:border-gray-600 dark:text-white">
              3
            </div>
            <p className="mt-2 text-xs font-medium text-gray-900 dark:text-white">
              Start Learning
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/30">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Frequently Asked Questions
        </h3>
        <div className="mt-4 space-y-4">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              How long does the code last?
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Verification codes expire after 24 hours. You can request a new
              code if needed.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              What if I don't receive the email?
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Check your spam or junk folder. If it's still not there, you can
              request a new email with the resend button.
            </p>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Can I use a different email?
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              The email address is tied to your account. If you need to change
              it, contact our support team.
            </p>
          </div>
        </div>
      </div>

      {/* Accessibility Note */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">♿ Accessibility:</span> You can use
          Tab to navigate between fields and Enter to submit. The verification
          code input will automatically convert lowercase letters to uppercase.
        </p>
      </div>
    </div>
  );
}
