import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/auth';
import { saveWhiteboardState } from '../utils/redis';
import { checkRateLimit } from '../middleware/rateLimit';
import logger from '../utils/logger';

interface DrawData {
  type: 'line' | 'circle' | 'rectangle' | 'text' | 'erase';
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  color?: string;
  width?: number;
  text?: string;
  fontSize?: number;
}

export function setupWhiteboardHandlers(io: Server, socket: AuthenticatedSocket) {
  
  // Draw on whiteboard
  socket.on('whiteboard-draw', async ({ roomId, drawData }: { roomId: string; drawData: DrawData }) => {
    try {
      // Rate limiting
      const allowed = await checkRateLimit(socket, 'whiteboard-draw');
      if (!allowed) {
        socket.emit('rate-limit-exceeded', { event: 'whiteboard-draw' });
        return;
      }
      
      // Broadcast to others in room
      socket.to(roomId).emit('whiteboard-update', {
        userId: socket.data.userId,
        userName: socket.data.userName,
        drawData,
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      logger.error('Error in whiteboard draw:', error);
      socket.emit('error', { message: 'Failed to process drawing' });
    }
  });
  
  // Clear whiteboard
  socket.on('whiteboard-clear', async ({ roomId }: { roomId: string }) => {
    try {
      logger.info(`User ${socket.data.userName} clearing whiteboard in room ${roomId}`);
      
      // Clear Redis state
      await saveWhiteboardState(roomId, null);
      
      // Notify all in room
      io.to(roomId).emit('whiteboard-cleared', {
        userId: socket.data.userId,
        userName: socket.data.userName,
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      logger.error('Error clearing whiteboard:', error);
      socket.emit('error', { message: 'Failed to clear whiteboard' });
    }
  });
  
  // Save whiteboard state
  socket.on('whiteboard-save', async ({ roomId, state }: { roomId: string; state: any }) => {
    try {
      await saveWhiteboardState(roomId, state);
      
      socket.emit('whiteboard-saved', {
        success: true,
        timestamp: new Date().toISOString(),
      });
      
      logger.info(`Whiteboard state saved for room ${roomId}`);
      
    } catch (error) {
      logger.error('Error saving whiteboard:', error);
      socket.emit('whiteboard-saved', { success: false, error: 'Failed to save' });
    }
  });
  
  // Undo last action
  socket.on('whiteboard-undo', ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit('whiteboard-undo-trigger', {
      userId: socket.data.userId,
    });
  });
  
  // Change tool/color
  socket.on('whiteboard-tool-change', ({ roomId, tool, color }: { roomId: string; tool: string; color?: string }) => {
    socket.to(roomId).emit('user-tool-changed', {
      userId: socket.data.userId,
      userName: socket.data.userName,
      tool,
      color,
    });
  });
}