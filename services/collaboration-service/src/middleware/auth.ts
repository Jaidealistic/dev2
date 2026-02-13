import { Socket } from 'socket.io';
import logger from '../utils/logger';

export interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    userName: string;
    userRole: string;
  };
}

export function requireAuth(socket: Socket, next: (err?: Error) => void) {
  if (!socket.data.userId) {
    logger.warn(`Unauthorized socket connection attempt: ${socket.id}`);
    return next(new Error('Authentication required'));
  }
  next();
}

export function validateRoomAccess(socket: AuthenticatedSocket, roomId: string): boolean {
  // Add custom logic here to verify user has access to specific room
  // For now, allow all authenticated users
  return !!socket.data.userId;
}