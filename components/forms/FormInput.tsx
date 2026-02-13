/**
 * FORM INPUT COMPONENT
 * 
 * Reusable, accessible form input with:
 * - Label
 * - Error message
 * - WCAG AAA compliance
 */

'use client';

import React from 'react';
import { FieldError } from 'react-hook-form';

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: FieldError;
  hint?: string;
  isRequired?: boolean;
  id?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, isRequired = false, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <div className="w-full">
        {/* Label */}
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-semibold text-gray-900"
        >
          {label}
          {isRequired && <span className="text-red-600 ml-0.5" aria-label="required">*</span>}
        </label>

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint
                ? `${inputId}-hint`
                : undefined
          }
          aria-invalid={error ? 'true' : 'false'}
          className={`
            w-full rounded-lg border-2 px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            text-base font-normal
            
            ${error
              ? 'border-red-500 bg-red-50 focus:border-red-600 focus:ring-red-200 text-gray-900'
              : 'border-gray-300 bg-white focus:border-[#9db4a0] focus:ring-[#9db4a0] focus:ring-opacity-20 text-gray-900'
            }
            
            placeholder:text-gray-400
            
            ${props.className || ''}`}
          {...props}
        />

      {/* Hint text */}
      {hint && !error && (
        <p
          id={`${inputId}-hint`}
          className="mt-1.5 text-xs text-gray-600"
        >
          {hint}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-1.5 text-sm font-medium text-red-600 flex items-start gap-1"
        >
          <span className="text-base">⚠</span>
          {error.message}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

/**
 * FORM CHECKBOX COMPONENT
 */

interface FormCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export function FormCheckbox({
  label,
  error,
  id,
  ...props
}: FormCheckboxProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="mb-4 flex items-center">
      <input
        type="checkbox"
        id={inputId}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`
          h-5 w-5 rounded border
          focus:outline-none focus:ring-4 focus:ring-offset-2
          transition-colors duration-200
          cursor-pointer
          
          ${error
            ? 'border-red-600 focus:ring-red-200'
            : 'border-gray-300 focus:border-sky-600 focus:ring-sky-200'
          }
          
          dark:border-gray-600 dark:focus:ring-sky-900
          dark:bg-gray-800
        `}
        {...props}
      />

      <label
        htmlFor={inputId}
        className="ml-3 cursor-pointer font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="ml-3 text-sm font-medium text-red-600 dark:text-red-400"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}

/**
 * FORM SELECT COMPONENT
 */

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>;
  error?: FieldError;
  isRequired?: boolean;
}

export function FormSelect({
  label,
  options,
  error,
  isRequired = false,
  id,
  ...props
}: FormSelectProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="mb-6 flex flex-col">
      <label
        htmlFor={inputId}
        className="mb-2 block font-medium text-gray-900 dark:text-white"
      >
        {label}
        {isRequired && <span className="text-red-600" aria-label="required">*</span>}
      </label>

      <select
        id={inputId}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`
          rounded-lg border px-4 py-3 font-medium
          focus:outline-none focus:ring-4 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          
          ${error
            ? 'border-red-600 focus:ring-red-200 dark:focus:ring-red-900'
            : 'border-gray-300 focus:border-sky-600 focus:ring-sky-200 dark:border-gray-600 dark:focus:ring-sky-900'
          }
          
          dark:bg-gray-800 dark:text-white
          dark:focus:border-sky-500
          
          text-base
          leading-relaxed
          
          ${props.className || ''}`}
        {...props}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-2 text-sm font-medium text-red-600 dark:text-red-400"
        >
          {error.message}
        </p>
      )}
    </div>
  );
}
