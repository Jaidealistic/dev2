/**
 * AUTHENTICATION MIDDLEWARE
 * 
 * Verifies JWT tokens and attaches user info to request
 * Used to protect routes that require authentication
 * 
 * Usage: router.get('/protected', authMiddleware, handler)
 */

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';

/**
 * Middleware to verify JWT token from Authorization header
 * 
 * Expected format: Authorization: Bearer <token>
 * 
 * On success: attaches userId and userRole to request object
 * On failure: returns 401 Unauthorized
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    console.log('🔐 AuthMiddleware: Request to', req.path);
    console.log('🔐 AuthMiddleware: Headers:', JSON.stringify(req.headers, null, 2));
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ AuthMiddleware: Missing or invalid Authorization header');
      res.status(401).json({
        error: 'Missing or invalid Authorization header',
        message: 'Please provide a valid JWT token',
      });
      return;
    }

    // Extract token
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    console.log('🔐 AuthMiddleware: Extracted token:', token.substring(0, 20) + '...');
    
    if (!token) {
      console.error('❌ AuthMiddleware: Token is empty');
      res.status(401).json({
        error: 'Missing token',
        message: 'Please provide a token',
      });
      return;
    }

    // Verify token
    const decoded = authService.verifyToken(token);
    console.log('🔐 AuthMiddleware: Decoded token:', decoded);
    
    if (!decoded) {
      console.error('❌ AuthMiddleware: Token verification failed');
      res.status(401).json({
        error: 'Invalid or expired token',
        message: 'Please log in again',
      });
      return;
    }

    // Attach user info to request for use in route handler
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    console.log('✅ AuthMiddleware: Set req.user =', req.user);

    // Continue to next middleware/handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      error: 'Authentication failed',
      message: 'Please log in again',
    });
  }
}

/**
 * Optional middleware to check for specific user roles
 * 
 * Usage: router.post('/admin', authMiddleware, requireRole('ADMIN'), handler)
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `This endpoint requires one of: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
}

/**
 * Optional middleware for optional authentication
 * Doesn't fail if no token, but attaches user if valid token is provided
 * 
 * Usage: router.get('/public', optionalAuthMiddleware, handler)
 */
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided - continue as anonymous user
      next();
      return;
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token);
    
    if (decoded) {
      // Token is valid - attach user info
      req.user = {
        id: decoded.id,
        role: decoded.role,
      };
    }
    // Token invalid but not required - continue anyway

    next();
  } catch (error) {
    // Token error but not required - continue anyway
    next();
  }
}
