# Setup Guide
## Educator, Content, Homeschool & Admin Domains

---

## Prerequisites

Ensure you have installed:
- Node.js 20 LTS
- Docker Desktop
- Git
- VS Code (recommended)

---

## Initial Setup

### 1. Clone Repository
```bash
git clone git@github.com:your-org/linguaaccess.git
cd linguaaccess
```

### 2. Install Dependencies
```bash
# Main app
npm install

# Collaboration service
cd services/collaboration-service
npm install
cd ../..

# Notification service (optional)
cd services/notification-service
npm install
cd ../..
```

### 3. Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your credentials
```

### 4. Start Databases with Docker
```bash
# Start all services
docker-compose up -d postgres mongo redis

# Verify all containers are running
docker-compose ps
```

### 5. Database Migrations
```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed database
npx prisma db seed
npm run seed:lessons
```

### 6. Start Development Servers

**Terminal 1 - Main App:**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 - Collaboration Service:**
```bash
cd services/collaboration-service
npm run dev
# Runs on http://localhost:3002
```

**Terminal 3 - Notification Service (optional):**
```bash
cd services/notification-service
npm run dev
# Runs on http://localhost:3003
```

---

## Your Responsibilities (Dev 2)

### ✅ Features You Own

1. **Educator Dashboard** (`/app/(educator)/`)
   - Student management
   - Progress analytics
   - NIOS tracking

2. **Content Creation** (`/app/(educator)/content/`)
   - Lesson builder
   - Teaching guide editor
   - Media uploads

3. **Homeschool Hub** (`/app/(homeschool)/`)
   - Teaching interface
   - Weekly planner
   - Portfolio management
   - NIOS reporting

4. **Collaboration** (`/app/collaboration/`)
   - Real-time rooms
   - Whiteboard
   - Chat

5. **Admin** (`/app/(admin)/`)
   - User management
   - Analytics
   - Content moderation

### ✅ Services You Own

1. **Collaboration Service** (`/services/collaboration-service/`)
   - Socket.IO WebSocket server
   - Real-time event handling
   - Redis integration

2. **Notification Service** (`/services/notification-service/`)
   - Email sending (SendGrid)
   - Push notifications (FCM)
   - Queue processing (Bull)

### ✅ Database Schemas You Own

**Prisma (PostgreSQL):**
- EducatorProfile
- EducatorStudent
- HomeschoolFamily
- CoOp, CoOpMembership, CoOpSession
- PortfolioItem
- NIOSCompetency
- MessageThread, Message
- AuditLog, ContentFlag

**Mongoose (MongoDB):**
- Lesson (complete control)
- VocabularyItem
- UserContent

---

## Coordination with Dev 1

### Shared Files (Coordinate Before Changing)

1. **`/prisma/schema.prisma`**
   - Protocol: Announce in Slack before modifying
   - Example: "Adding CoOp model to schema. Pushing in 15 min."

2. **`/lib/types.ts`**
   - Add your TypeScript interfaces
   - Don't modify Dev 1's types

3. **MongoDB Lesson Schema**
   - YOU CONTROL this schema
   - Dev 1 reads lessons (read-only)

LinguaAccess is an accessible language learning platform designed for learners with disabilities (Dyslexia, ADHD, Autism, etc.).

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkanishka1259%2FLexfix&env=DATABASE_URL,NEXTAUTH_SECRET)

### Daily Standup (Async in Slack)
```
Yesterday: Completed collaboration service Socket.IO setup
Today: Building lesson creator UI and media upload
Blockers: Need Dev 1 to finalize learner progress API
```

---

## Testing

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Accessibility tests
npm run test:a11y
```

### Manual Testing

**Test Collaboration Service:**
1. Open http://localhost:3000/collaboration/room/test-room
2. Open in another browser/incognito
3. Test whiteboard drawing syncs
4. Test chat messages deliver

**Test Lesson Creation:**
1. Go to http://localhost:3000/educator/content/create
2. Create a lesson with teaching guide
3. Upload media files
4. Publish lesson
5. Verify lesson appears in Dev 1's learner interface

---

## Deployment

### Docker Build & Deploy
```bash
# Build all services
docker-compose build

# Start in production mode
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose logs -f collaboration
```

### Deploy to Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy collaboration service
cd services/collaboration-service
railway init
railway up

# Deploy main app
cd ../..
railway up
```

---

## Troubleshooting

### Collaboration Service Won't Connect
```bash
# Check Redis is running
docker-compose ps redis

# Check Redis connection
redis-cli ping

# Check collaboration service logs
docker-compose logs collaboration
```

### MongoDB Connection Issues
```bash
# Verify MongoDB is running
docker-compose ps mongo

# Connect to MongoDB shell
docker exec -it linguaaccess-mongo mongosh

# Check database
use linguaaccess
db.lessons.count()
```

### Port Already in Use
```bash
# Find process using port 3002
lsof -i :3002

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3004
```

---

## Additional Resources

- **Prisma Docs:** https://www.prisma.io/docs
- **Socket.IO Docs:** https://socket.io/docs/v4/
- **MongoDB Docs:** https://www.mongodb.com/docs/
- **Docker Docs:** https://docs.docker.com/

---

## Next Steps

1. ✅ Complete educator dashboard implementation
2. ✅ Build lesson creation studio
3. ✅ Implement homeschool features
4. ✅ Set up collaboration service
5. ✅ Build admin dashboard
6. ✅ Write comprehensive tests
7. ✅ Deploy to production

**Good luck! Build something amazing! 🚀**
