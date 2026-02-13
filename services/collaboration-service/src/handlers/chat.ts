import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/auth';
import { incrementMessageCount } from '../utils/redis';
import { checkRateLimit } from '../middleware/rateLimit';
import logger from '../utils/logger';

export function setupChatHandlers(io: Server, socket: AuthenticatedSocket) {
  
  // Send chat message
  socket.on('chat-message', async ({ roomId, message }: { roomId: string; message: string }) => {
    try {
      // Rate limiting
      const allowed = await checkRateLimit(socket, 'chat-message');
      if (!allowed) {
        socket.emit('rate-limit-exceeded', { event: 'chat-message' });
        return;
      }
      
      // Validate message
      if (!message || message.trim().length === 0) {
        return;
      }
      
      if (message.length > 1000) {
        socket.emit('error', { message: 'Message too long (max 1000 characters)' });
        return;
      }
      
      // Increment message count
      const messageCount = await incrementMessageCount(roomId);
      
      // Broadcast to all in room (including sender)
      io.to(roomId).emit('new-chat-message', {
        id: `${roomId}-${messageCount}`,
        userId: socket.data.userId,
        userName: socket.data.userName,
        userRole: socket.data.userRole,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      });
      
      logger.debug(`Chat message in room ${roomId} from ${socket.data.userName}: ${message.substring(0, 50)}`);
      
    } catch (error) {
      logger.error('Error sending chat message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  // Typing indicator
  socket.on('typing-start', ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit('user-typing', {
      userId: socket.data.userId,
      userName: socket.data.userName,
    });
  });
  
  socket.on('typing-stop', ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit('user-stopped-typing', {
      userId: socket.data.userId,
    });
  });
  
  // Delete message (if user is moderator/admin)
  socket.on('chat-delete-message', ({ roomId, messageId }: { roomId: string; messageId: string }) => {
    // Check if user has permission (admin/moderator)
    if (socket.data.userRole === 'ADMIN' || socket.data.userRole === 'EDUCATOR') {
      io.to(roomId).emit('message-deleted', {
        messageId,
        deletedBy: socket.data.userId,
        timestamp: new Date().toISOString(),
      });
      
      logger.info(`Message ${messageId} deleted by ${socket.data.userName} in room ${roomId}`);
    }
  });
}