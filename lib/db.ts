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
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  })();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
