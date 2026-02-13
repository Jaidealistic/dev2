/**
 * Express Request type extensions
 * Adds custom properties to Express Request interface
 */

import { UserRole } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export {};
