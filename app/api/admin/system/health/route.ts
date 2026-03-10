import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const start = Date.now();

    // 1. Check PostgreSQL (Prisma)
    let postgresStatus = 'down';
    try {
      await prisma.$queryRaw`SELECT 1`;
      postgresStatus = 'up';
    } catch (e) {
      console.error('PostgreSQL Health Check Failed:', e);
    }

    // 2. Check MongoDB (Mongoose)
    let mongoStatus = 'down';
    try {
      await dbConnect();
      const state = mongoose.connection.readyState;
      // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
      mongoStatus = state === 1 ? 'up' : 'down';
    } catch (e) {
      console.error('MongoDB Health Check Failed:', e);
    }

    // 3. System Metrics
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    const latency = Date.now() - start;

    return NextResponse.json({
      status: postgresStatus === 'up' && mongoStatus === 'up' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        postgresql: {
          status: postgresStatus,
          displayName: 'PostgreSQL Database',
        },
        mongodb: {
          status: mongoStatus,
          displayName: 'MongoDB Database',
        },
        server: {
          status: 'up',
          displayName: 'API Server',
          uptime: Math.floor(uptime),
          memory: {
            heapUsed: Math.floor(memoryUsage.heapUsed / 1024 / 1024),
            heapTotal: Math.floor(memoryUsage.heapTotal / 1024 / 1024),
            rss: Math.floor(memoryUsage.rss / 1024 / 1024),
          }
        }
      },
      latency: `${latency}ms`
    });
  } catch (error) {
    console.error('System Health API Error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch health status' },
      { status: 500 }
    );
  }
}
