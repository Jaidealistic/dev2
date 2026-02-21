# Stage 1: Install dependencies
FROM node:20 AS deps
# RUN apk add --no-cache libc6-compat openssl # Not needed for Debian
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm install --legacy-peer-deps --ignore-scripts

# Stage 2: Build the application
FROM node:20 AS builder
# RUN apk add --no-cache openssl # Not needed for Debian
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma -v
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner
FROM node:20 AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
