import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeSocketIO } from './socket';
import redis from './utils/redis';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'collaboration-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    const redisInfo = await redis.info('stats');
    
    res.json({
      service: 'collaboration-service',
      redis: {
        connected: redis.status === 'ready',
        info: redisInfo,
      },
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// Room info endpoint (REST fallback)
app.get('/rooms/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const participants = await redis.smembers(`room:${roomId}:participants`);
    const messageCount = await redis.get(`room:${roomId}:message_count`);
    
    res.json({
      roomId,
      participants,
      messageCount: parseInt(messageCount || '0'),
    });
  } catch (error) {
    logger.error('Error getting room info:', error);
    res.status(500).json({ error: 'Failed to get room info' });
  }
});

// Initialize Socket.IO
const io = initializeSocketIO(httpServer);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  
  // Close server
  httpServer.close(() => {
    logger.info('HTTP server closed');
  });
  
  // Close Socket.IO
  io.close(() => {
    logger.info('Socket.IO server closed');
  });
  
  // Close Redis
  await redis.quit();
  logger.info('Redis connection closed');
  
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  logger.info(`🚀 Collaboration service running on port ${PORT}`);
  logger.info(`📡 WebSocket server ready`);
  logger.info(`🔗 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

export { app, httpServer, io };