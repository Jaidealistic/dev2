/**
 * AUTH SERVICE
 * 
 * Handles all authentication business logic:
 * - Password hashing and comparison
 * - JWT token generation
 * - User registration
 * - Email verification
 * - Password reset
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/db';
import { UserRole } from '@prisma/client';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10');

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare a plain password with a hashed password
 */
export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generate a JWT token
 */
export function generateToken(userId: string, role: UserRole): string {
  return jwt.sign(
    {
      id: userId,
      role,
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRE as any,
    }
  );
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): { id: string; role: UserRole } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    // Validate/cast role
    if (!Object.values(UserRole).includes(decoded.role as UserRole)) return null;
    return { id: decoded.id, role: decoded.role as UserRole };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Generate a specialized Student ID (e.g., LX-12345)
 */
export async function generateStudentId(): Promise<string> {
  const prefix = 'LX';
  let isUnique = false;
  let studentId = '';

  while (!isUnique) {
    const random = Math.floor(10000 + Math.random() * 90000); // 5 digits
    studentId = `${prefix}-${random}`;

    const existing = await prisma.learnerProfile.findUnique({
      where: { studentId }
    });

    if (!existing) isUnique = true;
  }

  return studentId;
}

/**
 * Register a new user
 */
export async function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: UserRole = UserRole.LEARNER,
  pattern?: string
) {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Generate studentId if learner
  let studentId = undefined;
  if (role === UserRole.LEARNER) {
    studentId = await generateStudentId();
  }

  // Create user with the specified role
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      pattern: pattern || null,
      isEmailVerified: false,
      // Initialize LearnerProfile if role is LEARNER
      ...(role === UserRole.LEARNER && {
        learnerProfile: {
          create: {
            studentId,
            fontFamily: 'lexend',
            fontSize: 18,
            lineSpacing: 1.6,
            letterSpacing: 0.05,
            colorScheme: 'light',
          }
        }
      })
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Authenticate user and generate tokens
 */
export async function authenticateUser(email: string, password?: string, pattern?: string) {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      password: true,
      pattern: true,
      role: true,
      isActive: true,
      isEmailVerified: true,
    },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new Error('Your account has been deactivated');
  }

  // Compare passwords or patterns
  if (user.role === UserRole.LEARNER && user.pattern) {
    if (!pattern) {
      throw new Error('Pattern is required for student login');
    }
    // Simple string comparison for pattern (matching mock-server logic)
    if (pattern !== user.pattern) {
      throw new Error('Invalid pattern');
    }
  } else {
    if (!password) {
      throw new Error('Password is required');
    }
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }
  }

  // Generate token
  const token = generateToken(user.id, user.role);

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    },
    token,
  };
}

/**
 * Generate email verification code
 */
export function generateVerificationCode(): string {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

/**
 * Generate password reset token
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify email for a user
 */
export async function verifyEmail(userId: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
    select: {
      id: true,
      email: true,
      isEmailVerified: true,
    },
  });

  return user;
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  if (!user) {
    // Don't reveal if email exists for security
    return { success: true };
  }

  // Generate reset token
  const resetToken = generateResetToken();
  const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Store reset token (in production, store securely)
  // For now, we'll store in memory or database
  // This is simplified - in production use a separate table

  return {
    success: true,
    userId: user.id,
    resetToken,
    expiresAt: resetTokenExpiry,
  };
}

/**
 * Reset password
 */
export async function resetPassword(userId: string, newPassword: string) {
  const hashedPassword = await hashPassword(newPassword);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
    select: {
      id: true,
      email: true,
    },
  });

  return user;
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isEmailVerified: true,
      isActive: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      role: true,
      isEmailVerified: true,
      isActive: true,
      createdAt: true,
    },
  });

  return user;
}
