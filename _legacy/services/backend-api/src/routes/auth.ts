/**
 * AUTHENTICATION ROUTES
 * 
 * API endpoints for user authentication:
 * - POST /api/auth/signup      - Register new user
 * - POST /api/auth/login       - User login
 * - POST /api/auth/verify-email - Verify email address
 * - POST /api/auth/request-password-reset - Request password reset
 * - POST /api/auth/reset-password - Reset password with token
 * - GET  /api/auth/me          - Get current user (protected)
 * - POST /api/auth/logout      - Logout (clears session)
 */

import express, { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as authService from '../services/authService';
import * as emailService from '../services/emailService';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// VALIDATION SCHEMAS (must match frontend validation)
const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  confirmPassword: z.string().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['LEARNER', 'PARENT', 'EDUCATOR']).default('LEARNER'),
  pattern: z.array(z.number()).optional(),
}).refine((data) => {
  if (data.role === 'LEARNER') return !!data.pattern && data.pattern.length >= 4;
  return !!data.password && data.password.length >= 8;
}, {
  message: 'Pattern (min 4 dots) is required for beginners, password (min 8 chars) for others',
  path: ['password'],
}).refine((data) => {
  if (data.role !== 'LEARNER') return data.password === data.confirmPassword;
  return true;
}, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().optional(),
  pattern: z.array(z.number()).optional(),
});

const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Verification code must be 6 characters'),
});

const requestPasswordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ERROR RESPONSE TYPE
interface ErrorResponse {
  error: string;
  details?: Record<string, string[]>;
}

// ROUTE: Sign Up
router.post('/signup', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      const details = Object.fromEntries(
        result.error.issues.map((issue) => [
          issue.path.join('.'),
          [issue.message],
        ])
      );
      return res.status(400).json({ error: 'Validation failed', details } as ErrorResponse);
    }

    const { email, password, firstName, lastName, role, pattern } = result.data;

    // Check if user already exists
    const existingUser = await authService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists'
      } as ErrorResponse);
    }

    // Register user with the specified role
    const userRole = role as any; // Cast to UserRole enum
    const patternStr = pattern ? JSON.stringify(pattern) : undefined;
    const user = await authService.registerUser(email, password || '', firstName, lastName, userRole, patternStr);

    // Auto-verify all users for now (email verification service is stubbed)
    await authService.verifyEmail(user.id);
    console.log(`✅ New ${role} signup (auto-verified): ${email} (${firstName} ${lastName})`);

    // Generate JWT token for immediate access
    const token = authService.generateToken(user.id, role as any);

    // Return success response with token
    return res.status(201).json({
      message: 'Signup successful! Redirecting...',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: role,
        isEmailVerified: true,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      error: 'Internal server error during signup'
    } as ErrorResponse);
  }
});

// ROUTE: Check Auth Method
router.post('/check-method', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await authService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    return res.json({
      role: user.role,
      authMethod: user.role === 'LEARNER' ? 'pattern' : 'password',
      firstName: user.firstName,
    });
  } catch (error) {
    console.error('Check method error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ROUTE: Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      const details = Object.fromEntries(
        result.error.issues.map((issue) => [
          issue.path.join('.'),
          [issue.message],
        ])
      );
      return res.status(400).json({ error: 'Validation failed', details } as ErrorResponse);
    }

    const { email, password, pattern } = result.data;

    // Authenticate user
    const payload = await authService.authenticateUser(email, password, pattern ? JSON.stringify(pattern) : undefined);

    if (!payload) {
      return res.status(401).json({
        error: 'Invalid email or password'
      } as ErrorResponse);
    }

    // Check if email is verified (only for non-learners)
    if (!payload.user.isEmailVerified && payload.user.role !== 'LEARNER') {
      return res.status(403).json({
        error: 'Please verify your email before logging in',
        requiresEmailVerification: true,
        email: payload.user.email,
      });
    }

    // Log successful login
    console.log(`✅ Login: ${email}`);

    // Return token and user info
    return res.status(200).json({
      message: 'Login successful',
      token: payload.token,
      user: payload.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error && error.message.includes('Invalid email or password')) {
      return res.status(401).json({
        error: 'Invalid email or password'
      } as ErrorResponse);
    }
    return res.status(500).json({
      error: 'Internal server error during login'
    } as ErrorResponse);
  }
});

// ROUTE: Verify Email
router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const result = verifyEmailSchema.safeParse(req.body);
    if (!result.success) {
      const details = Object.fromEntries(
        result.error.issues.map((issue) => [
          issue.path.join('.'),
          [issue.message],
        ])
      );
      return res.status(400).json({ error: 'Validation failed', details } as ErrorResponse);
    }

    const { email, code } = result.data;

    // TODO: Check if verification code matches and is not expired
    // For now, verify any 6-digit code
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({
        error: 'Invalid verification code format'
      } as ErrorResponse);
    }

    // Get user
    const user = await authService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      } as ErrorResponse);
    }

    // Verify email in database
    await authService.verifyEmail(user.id);

    // Send welcome email
    await emailService.sendWelcomeEmail(email, user.firstName || '');

    // Log successful verification
    console.log(`✅ Email verified: ${email}`);

    return res.status(200).json({
      message: 'Email verified successfully! You can now log in.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      error: 'Internal server error during email verification'
    } as ErrorResponse);
  }
});

// ROUTE: Request Password Reset
router.post('/request-password-reset', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const result = requestPasswordResetSchema.safeParse(req.body);
    if (!result.success) {
      const details = Object.fromEntries(
        result.error.issues.map((issue) => [
          issue.path.join('.'),
          [issue.message],
        ])
      );
      return res.status(400).json({ error: 'Validation failed', details } as ErrorResponse);
    }

    const { email } = result.data;

    // Check if user exists
    const user = await authService.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists (security best practice)
      return res.status(200).json({
        message: 'If email exists, a password reset link has been sent',
      });
    }

    // Generate reset token
    const resetToken = authService.generateResetToken();

    // TODO: Store reset token with expiration in database
    console.log(`Reset token for ${email}: ${resetToken}`);

    // Send password reset email
    await emailService.sendPasswordResetEmail(email, resetToken);

    // Log password reset request
    console.log(`✅ Password reset requested: ${email}`);

    // Return success (don't confirm if email exists)
    res.status(200).json({
      message: 'If email exists, a password reset link has been sent',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({
      error: 'Internal server error during password reset request'
    } as ErrorResponse);
  }
});

// ROUTE: Reset Password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
      const details = Object.fromEntries(
        result.error.issues.map((issue) => [
          issue.path.join('.'),
          [issue.message],
        ])
      );
      return res.status(400).json({ error: 'Validation failed', details } as ErrorResponse);
    }

    const { token, password } = result.data;

    // TODO: Verify reset token from database
    // For now, tokens are not validated
    if (!token || token.length < 10) {
      return res.status(400).json({
        error: 'Invalid or expired reset token'
      } as ErrorResponse);
    }

    // TODO: Get user from reset token table
    // For now, return error (since we can't look up user without token storage)
    return res.status(400).json({
      error: 'Invalid or expired reset token'
    } as ErrorResponse);

    // This code would execute if token storage was implemented:
    // const user = await authService.getUserById(userId);
    // if (!user) {
    //   return res.status(404).json({ error: 'User not found' });
    // }
    // 
    // await authService.resetPassword(user.id, password);
    // 
    // console.log(`✅ Password reset: ${user.email}`);
    // 
    // res.status(200).json({
    //   message: 'Password reset successfully! You can now log in with your new password.',
    // });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({
      error: 'Internal server error during password reset'
    } as ErrorResponse);
  }
});

// ROUTE: Get Current User (Protected)
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    // authMiddleware attaches user to request
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' } as ErrorResponse);
    }

    const user = await authService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' } as ErrorResponse);
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    } as ErrorResponse);
  }
});

// ROUTE: Logout (Client-side mainly)
router.post('/logout', (req: Request, res: Response) => {
  // With JWT, logout is handled on client by deleting the token
  // This endpoint is mainly for consistency and future session tracking
  console.log('📤 Logout');
  res.status(200).json({
    message: 'Logged out successfully. Please delete your auth token.',
  });
});

export default router;
