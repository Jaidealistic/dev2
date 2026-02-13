/**
 * EMAIL VERIFICATION FORM COMPONENT
 * 
 * Handles email verification with:
 * - 6-digit code input
 * - Real-time validation
 * - API integration
 * - Accessibility (WCAG AAA)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { emailVerificationSchema } from '@/lib/validations/auth';
import { verifyEmail } from '@/lib/api';
import { FormInput } from './FormInput';

type VerifyEmailFormData = {
  email: string;
  code: string;
};

interface VerifyEmailFormProps {
  initialEmail?: string;
  onSuccess?: () => void;
}

export function VerifyEmailForm({
  initialEmail,
  onSuccess,
}: VerifyEmailFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(emailVerificationSchema),
    mode: 'onBlur',
    defaultValues: {
      email: initialEmail || '',
    },
  });

  // Set initial email if provided
  useEffect(() => {
    if (initialEmail) {
      setValue('email', initialEmail);
    }
  }, [initialEmail, setValue]);

  const onSubmit = async (data: VerifyEmailFormData) => {
    try {
      setIsLoading(true);
      setApiError(null);
      setSuccess(false);

      const result = await verifyEmail({
        email: data.email,
        code: data.code.toUpperCase(),
      });

      if ('error' in result) {
        setApiError(result.error || 'Verification failed');
        return;
      }

      // Success
      setSuccess(true);

      // Redirect to login after a short delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/login');
        }
      }, 2000);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div
          role="status"
          aria-live="polite"
          className="rounded-lg border-l-4 border-green-600 bg-green-50 p-6 dark:bg-green-900/20"
        >
          <p className="text-2xl">✅ Success!</p>
          <p className="mt-2 font-semibold text-green-800 dark:text-green-200">
            Email verified
          </p>
          <p className="mt-1 text-sm text-green-700 dark:text-green-300">
            Redirecting you to the login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
      {/* API Error Alert */}
      {apiError && (
        <div
          role="alert"
          className="rounded-lg border-l-4 border-red-600 bg-red-50 p-4 dark:bg-red-900/20"
        >
          <p className="font-semibold text-red-800 dark:text-red-200">Error</p>
          <p className="text-sm text-red-700 dark:text-red-300">{apiError}</p>
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <span className="font-semibold">📧 Check your email:</span> We sent a
          6-character verification code to your email address. Please enter it
          below.
        </p>
      </div>

      {/* Email Address (Pre-filled) */}
      <FormInput
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        disabled
        {...register('email')}
        error={errors.email}
        hint="Cannot be changed - this is pre-filled from your signup"
      />

      {/* Verification Code */}
      <div className="space-y-2">
        <FormInput
          label="Verification Code"
          type="text"
          placeholder="e.g., A2F5B7"
          maxLength={6}
          {...register('code')}
          error={errors.code}
          hint="Enter the 6-character code from your email"
          autoComplete="off"
          inputMode="text"
          className="uppercase"
        />
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Code format: 6 alphanumeric characters
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`
          w-full rounded-lg px-4 py-3 font-semibold text-white
          transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-sky-200
          
          ${isLoading
            ? 'cursor-not-allowed bg-sky-400 opacity-50'
            : 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800'
          }
          
          dark:focus:ring-sky-900
          dark:hover:bg-sky-700
          dark:active:bg-sky-800
          
          text-base
          leading-relaxed
          min-h-[44px]
        `}
      >
        {isLoading ? 'Verifying...' : 'Verify Email'}
      </button>

      {/* Resend Code */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Didn't receive the code?
        </p>
        <button
          type="button"
          onClick={() => {
            setApiError('Resend code functionality coming soon');
          }}
          className="mt-2 inline-block font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400"
        >
          Resend verification code
        </button>
      </div>

      {/* Accessibility Note */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">♿ Accessibility:</span> Use Tab to
          navigate between fields and Enter to submit the form.
        </p>
      </div>
    </form>
  );
}
