import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../middleware/auth';
import { setActiveUser, removeActiveUser } from '../utils/redis';
import logger from '../utils/logger';

export function setupPresenceHandlers(io: Server, socket: AuthenticatedSocket) {
  
  // User goes online
  socket.on('online', async () => {
    await setActiveUser(socket.data.userId, socket.id);
    
    // Broadcast to relevant users (contacts, group members, etc.)
    socket.broadcast.emit('user-online', {
      userId: socket.data.userId,
      userName: socket.data.userName,
    });
    
    logger.debug(`User ${socket.data.userName} is online`);
  });
  
  // User goes offline
  socket.on('offline', async () => {
    await removeActiveUser(socket.data.userId);
    
    socket.broadcast.emit('user-offline', {
      userId: socket.data.userId,
    });
    
    logger.debug(`User ${socket.data.userName} went offline`);
  });
  
  // User is away/idle
  socket.on('away', () => {
    socket.broadcast.emit('user-away', {
      userId: socket.data.userId,
    });
  });
  
  // Heartbeat/ping
  socket.on('ping', (callback) => {
    callback({ pong: true, timestamp: Date.now() });
  });
}