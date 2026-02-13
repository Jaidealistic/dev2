import Redis from 'ioredis';
import logger from './logger';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number): number {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('✅ Redis connected');
});

redis.on('error', (err: Error) => {
  logger.error('❌ Redis connection error:', err);
});

// Helper functions
export async function setActiveUser(userId: string, socketId: string): Promise<void> {
  await redis.hset('active_users', userId, socketId);
}

export async function getActiveUser(userId: string): Promise<string | null> {
  return await redis.hget('active_users', userId);
}

export async function removeActiveUser(userId: string): Promise<void> {
  await redis.hdel('active_users', userId);
}

export async function getRoomParticipants(roomId: string): Promise<string[]> {
  const participants = await redis.smembers(`room:${roomId}:participants`);
  return participants;
}

export async function addRoomParticipant(roomId: string, userId: string): Promise<void> {
  await redis.sadd(`room:${roomId}:participants`, userId);
}

export async function removeRoomParticipant(roomId: string, userId: string): Promise<void> {
  await redis.srem(`room:${roomId}:participants`, userId);
}

export async function saveWhiteboardState(roomId: string, state: any): Promise<void> {
  await redis.set(`room:${roomId}:whiteboard`, JSON.stringify(state), 'EX', 86400); // 24h expiry
}

export async function getWhiteboardState(roomId: string): Promise<any> {
  const state = await redis.get(`room:${roomId}:whiteboard`);
  return state ? JSON.parse(state) : null;
}

export async function incrementMessageCount(roomId: string): Promise<number> {
  return await redis.incr(`room:${roomId}:message_count`);
}

export default redis;