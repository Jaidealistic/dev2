import { Socket } from 'socket.io';
import redis from '../utils/redis';
import logger from '../utils/logger';

const RATE_LIMIT_WINDOW = 60; // seconds
const MAX_REQUESTS = 100; // per window

export async function checkRateLimit(socket: Socket, event: string): Promise<boolean> {
  const key = `rate_limit:${socket.data.userId}:${event}`;
  
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, RATE_LIMIT_WINDOW);
  }
  
  if (current > MAX_REQUESTS) {
    logger.warn(`Rate limit exceeded for user ${socket.data.userId} on event ${event}`);
    return false;
  }
  
  return true;
}