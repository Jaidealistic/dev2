/**
 * LINGUAACCESS BACKEND SERVER
 * 
 * Entry point for the server.
 */

import app from './app';
import { prisma } from './db';

const PORT = process.env.PORT || 3001;

// ============================================
// DATABASE CONNECTION & SERVER START
// ============================================

async function startServer() {
  try {
    // Test database connection
    console.log('Testing database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connected');

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║   LinguaAccess Backend Server              ║
║   Accessible Language Learning Platform    ║
╠════════════════════════════════════════════╣
║   Server running on: http://localhost:${PORT}  ║
║   Environment: ${process.env.NODE_ENV || 'development'}            ║
║   Database: ${process.env.DATABASE_URL?.split('://')[1]?.split('/')[0] || 'Unknown'}          ║
╚════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer();
