# Stage 1: Install dependencies
FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps --ignore-scripts

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Provide a dummy DATABASE_URL during build to satisfy Prisma validation
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
# Skip prisma postinstall since we run it explicitly
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1

# Re-install openssl and libc6-compat for prisma generation in builder
RUN apk add --no-cache openssl libc6-compat
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Manually copy Prisma engines if not picked up by Next.js standalone build
# We copy across all common linux engines just in case
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma/client/query_engine-linux-musl-openssl-3.0.x.so.node ./node_modules/.prisma/client/

# Install openssl in runner for runtime prisma connection
RUN apk add --no-cache openssl libc6-compat

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
# Run migrations before starting the app
CMD npx prisma migrate deploy && node server.js
