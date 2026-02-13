import { defineConfig } from '@prisma/config';

import fs from 'node:fs';
import path from 'node:path';

if (!process.env.DATABASE_URL) {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^DATABASE_URL=(.*)$/m);
    if (match) {
      process.env.DATABASE_URL = match[1].trim().replace(/^["']|["']$/g, '');
    }
  }
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
