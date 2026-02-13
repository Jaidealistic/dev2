/**
 * NEXTAUTH CONFIGURATION
 * 
 * Handles authentication for LinguaAccess
 * - Email/password authentication
 * - Learner and Parent user roles
 * - Session management with JWT
 * - Secure password hashing with bcrypt
 * 
 * WCAG AAA Considerations:
 * - All auth forms must be accessible
 * - Clear error messaging
 * - Focus management in modals
 */

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { loginSchema } from '@/lib/validations/auth';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Validate credentials
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const result = loginSchema.safeParse({
            email: credentials.email,
            password: credentials.password,
          });

          if (!result.success) {
            throw new Error('Invalid email or password format');
          }

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              password: true,
              firstName: true,
              lastName: true,
              role: true,
              emailVerified: true,
              isActive: true,
              accessibilityPrefs: true,
            },
          });

          if (!user) {
            throw new Error('No user found with this email');
          }

          // Check if account is active
          if (!user.isActive) {
            throw new Error('Your account has been deactivated');
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordMatch) {
            throw new Error('Invalid email or password');
          }

          // Return user object for JWT
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
            role: user.role,
          } as any;
        } catch (error) {
          console.error('Auth error:', error);
          throw error instanceof Error ? error : new Error('Authentication failed');
        }
      },
    }),
  ],
  
  pages: {
    signIn: '/login',
    error: '/error',
  },

  callbacks: {
    /**
     * JWT Callback
     * Add role and other custom claims to JWT token
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },

    /**
     * Session Callback
     * Add ID and role to session
     */
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },

    /**
     * Redirect Callback
     * Redirect users to appropriate page after login based on role
     */
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 1 day
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 7 * 24 * 60 * 60,
  },

  events: {
    async signIn({ user, isNewUser }) {
      console.log(`User ${user.email} signed in. New user: ${isNewUser}`);
      
      // Update last login
      if (user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',
};
