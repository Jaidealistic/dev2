const { PrismaClient } = require('@prisma/client');

console.log('DEBUG: Starting Prisma Encoded Test');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:jaino1.%2A@127.0.0.1:5432/linguaaccess?schema=public"
    }
  }
});

async function test() {
  console.log('DEBUG: Attempting to connect...');
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('DEBUG: Connection successful:', result);
  } catch (err) {
    console.error('DEBUG: Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
