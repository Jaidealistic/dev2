const { Pool } = require('pg');
require('dotenv').config();

console.log('DEBUG: Starting PG Test');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function test() {
  console.log('DEBUG: Attempting to connect...');
  try {
    const res = await pool.query('SELECT 1');
    console.log('DEBUG: Connection successful:', res.rows);
  } catch (err) {
    console.error('DEBUG: Connection failed:', err);
  } finally {
    await pool.end();
  }
}

test();
