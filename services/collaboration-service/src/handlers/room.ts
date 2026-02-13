import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/auth';
import {
  addRoomParticipant,
  removeRoomParticipant,
  getRoomParticipants,
  getWhiteboardState,
} from '../utils/redis';
import logger from '../utils/logger';

export function setupRoomHandlers(io: Server, socket: AuthenticatedSocket) {
  
  // Join room
  socket.on('join-room', async ({ roomId }: { roomId: string }) => {
    try {
      logger.info(`User ${socket.data.userName} (${socket.data.userId}) joining room ${roomId}`);
      
      // Join Socket.IO room
      await socket.join(roomId);
      
      // Add to Redis room participants
      await addRoomParticipant(roomId, socket.data.userId);
      
      // Get current participants
      const participantIds = await getRoomParticipants(roomId);
      const sockets = await io.in(roomId).fetchSockets();
      
      const participants = sockets.map((s: any) => ({
        userId: s.data.userId,
        userName: s.data.userName,
        userRole: s.data.userRole,
        socketId: s.id,
      }));
      
      // Notify others in room
      socket.to(roomId).emit('user-joined', {
        userId: socket.data.userId,
        userName: socket.data.userName,
        userRole: socket.data.userRole,
        timestamp: new Date().toISOString(),
      });
      
      // Send current state to joining user
      const whiteboardState = await getWhiteboardState(roomId);
      
      socket.emit('room-state', {
        participants,
        whiteboardState,
      });
      
      logger.info(`User ${socket.data.userName} successfully joined room ${roomId}. Total participants: ${participants.length}`);
      
    } catch (error) {
      logger.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });
  
  // Leave room
  socket.on('leave-room', async ({ roomId }: { roomId: string }) => {
    try {
      logger.info(`User ${socket.data.userName} leaving room ${roomId}`);
      
      await socket.leave(roomId);
      await removeRoomParticipant(roomId, socket.data.userId);
      
      socket.to(roomId).emit('user-left', {
        userId: socket.data.userId,
        userName: socket.data.userName,
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      logger.error('Error leaving room:', error);
    }
  });
  
  // Get room info
  socket.on('get-room-info', async ({ roomId }: { roomId: string }, callback: (data: any) => void) => {
    try {
      const sockets = await io.in(roomId).fetchSockets();
      const participants = sockets.map((s: any) => ({
        userId: s.data.userId,
        userName: s.data.userName,
      }));
      
      const whiteboardState = await getWhiteboardState(roomId);
      
      callback({
        success: true,
        participants,
        whiteboardState,
      });
      
    } catch (error) {
      logger.error('Error getting room info:', error);
      callback({ success: false, error: 'Failed to get room info' });
    }
  });
}