/**
 * DATABASE CONNECTION
 * 
 * Singleton instance of Prisma Client
 * Prevents multiple instances in development due to hot reloading
 * 
 * Usage:
 *   import { prisma } from '@/lib/db';
 *   const users = await prisma.user.findMany();
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

