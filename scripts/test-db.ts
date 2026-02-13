import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

console.log('DEBUG: Starting Prisma Adapter Test');
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DEBUG: DATABASE_URL is missing');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  console.log('DEBUG: Attempting to connect with adapter...');
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('DEBUG: Connection successful:', result);
  } catch (err) {
    console.error('DEBUG: Connection failed:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

test();
