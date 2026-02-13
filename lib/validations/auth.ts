/**
 * AUTH VALIDATION SCHEMAS
 * Zod schemas for authentication forms
 */

import { z } from 'zod';

/**
 * Password-based login (PARENT / EDUCATOR)
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Pattern-based login (LEARNER)
 */
export const patternLoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});
export type PatternLoginFormData = z.infer<typeof patternLoginSchema>;

/**
 * Learner sign up (pattern-based, no password)
 */
export const learnerSignUpSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  agreeToTerms: z.boolean().refine((val) => val === true, { message: 'You must agree to the Terms of Service' }),
  agreeToPrivacy: z.boolean().refine((val) => val === true, { message: 'You must agree to the Privacy Policy' }),
});
export type LearnerSignUpFormData = z.infer<typeof learnerSignUpSchema>;

/**
 * Parent / Educator sign up (password-based)
 */
export const signUpSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
    agreeToTerms: z.boolean().refine((val) => val === true, { message: 'You must agree to the Terms of Service' }),
    agreeToPrivacy: z.boolean().refine((val) => val === true, { message: 'You must agree to the Privacy Policy' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * Email Verification Schema
 * Validates email verification code
 */
export const emailVerificationSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  code: z
    .string({ required_error: 'Verification code is required' })
    .length(6, 'Verification code must be 6 characters'),
});

export type EmailVerificationData = z.infer<typeof emailVerificationSchema>;

/**
 * Password Reset Request Schema
 * Validates email for password reset
 */
export const passwordResetRequestSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email address'),
});

export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>;

/**
 * Password Reset Schema
 * Validates new password and reset token
 */
export const passwordResetSchema = z
  .object({
    token: z.string({ required_error: 'Reset token is required' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z
      .string({ required_error: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordResetData = z.infer<typeof passwordResetSchema>;
