import crypto from 'crypto';

/**
 * PRODUCTION SECRET GENERATOR
 * Run this with: node gen-secrets.mjs
 */

const generateSecret = () => crypto.randomBytes(32).toString('base64');

const secrets = {
    NEXTAUTH_SECRET: generateSecret(),
    JWT_SECRET: generateSecret(),
    DATABASE_URL: "postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DB_NAME]?schema=public",
    MONGODB_URL: "mongodb+srv://[USER]:[PASSWORD]@[CLUSTER].mongodb.net/[DB_NAME]?retryWrites=true&w=majority",
    NEXT_PUBLIC_APP_URL: "https://your-app.vercel.app",
    NEXT_PUBLIC_API_URL: "/api"
};

console.log("\n🚀 --- VERCEL PRODUCTION ENVIRONMENT (COPY & PASTE) ---\n");
Object.entries(secrets).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
});
console.log("\n-------------------------------------------------------\n");
console.log("💡 TIP: Copy these into your Vercel Project Settings > Environment Variables.");
console.log("💡 DATABASE TIP: Get your Postgres URI from Supabase/Neon and MongoDB URI from Atlas.");
