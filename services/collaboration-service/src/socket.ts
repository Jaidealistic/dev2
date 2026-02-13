import { Server, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { AuthenticatedSocket } from './middleware/auth';
import { setActiveUser, removeActiveUser } from './utils/redis';
import { setupRoomHandlers } from './handlers/room';
import { setupWhiteboardHandlers } from './handlers/whiteboard';
import { setupChatHandlers } from './handlers/chat';
import { setupPresenceHandlers } from './handlers/presence';
import logger from './utils/logger';

export function initializeSocketIO(httpServer: HTTPServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e6, // 1MB
    transports: ['websocket', 'polling'],
  });

  // Connection handler
  io.on('connection', (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Authentication handler
    socket.on('authenticate', async (data: { userId: string; userName: string; userRole: string }) => {
      try {
        const { userId, userName, userRole } = data;

        if (!userId || !userName) {
          socket.emit('auth-error', { message: 'Invalid credentials' });
          socket.disconnect();
          return;
        }

        // Store user data in socket
        (socket as AuthenticatedSocket).data = {
          userId,
          userName,
          userRole,
        };

        // Track active user
        await setActiveUser(userId, socket.id);

        // Join personal room for direct messages
        await socket.join(`user:${userId}`);

        // Confirm authentication
        socket.emit('authenticated', {
          success: true,
          userId,
          userName,
          userRole,
        });

        logger.info(`User authenticated: ${userName} (${userId}) with role ${userRole}`);

        // Set up event handlers after authentication
        const authenticatedSocket = socket as AuthenticatedSocket;
        setupRoomHandlers(io, authenticatedSocket);
        setupWhiteboardHandlers(io, authenticatedSocket);
        setupChatHandlers(io, authenticatedSocket);
        setupPresenceHandlers(io, authenticatedSocket);

      } catch (error) {
        logger.error('Authentication error:', error);
        socket.emit('auth-error', { message: 'Authentication failed' });
        socket.disconnect();
      }
    });

    // Disconnect handler
    socket.on('disconnect', async (reason) => {
      const userId = (socket as AuthenticatedSocket).data?.userId;
      const userName = (socket as AuthenticatedSocket).data?.userName;

      if (userId) {
        await removeActiveUser(userId);
        logger.info(`User disconnected: ${userName} (${userId}). Reason: ${reason}`);

        // Notify others
        socket.broadcast.emit('user-offline', { userId });
      } else {
        logger.info(`Unauthenticated socket disconnected: ${socket.id}. Reason: ${reason}`);
      }
    });

    // Error handler
    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });
  });

  return io;
}