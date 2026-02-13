import { defineConfig } from '@prisma/config';

export default defineConfig({
  earlyAccess: true,
  datasources: [
    {
      provider: 'postgresql',
      url: process.env.DATABASE_URL,
    },
  ],
});
