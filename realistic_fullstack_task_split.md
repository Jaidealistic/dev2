# LINGUAACCESS - TECH STACK & FULL-STACK TASK DISTRIBUTION

## PHILOSOPHY: BOTH DEVELOPERS ARE FULL-STACK ENGINEERS

Each developer owns complete features end-to-end (frontend + backend + database + deployment + testing), but features are divided by **functional domains** to minimize conflicts.

---

## COMPLETE TECH STACK (SIMPLIFIED & REALISTIC)

### FRONTEND

**React 18.3+ with TypeScript 5.3+**
- Component-based architecture
- Strong typing for accessibility and maintainability
- **Key libraries:**
  - `react-aria` - Accessible UI primitives
  - `react-hook-form` - Form handling with validation
  - `zod` - Runtime type validation

**Next.js 14+ (App Router)**
- Server-side rendering (SSR) for SEO
- API routes (Next.js API routes as lightweight backend)
- File-based routing
- Image optimization
- **Why:** Single framework for both frontend and API routes reduces complexity

**Styling: Tailwind CSS 3.4+**
- Utility-first CSS
- Custom design system configuration
- Responsive design built-in
- **Plugins:**
  - `@tailwindcss/forms`
  - `@tailwindcss/typography`

**UI Components: shadcn/ui (Radix UI + Tailwind)**
- Accessible components out of the box
- Copy-paste component approach (no npm dependency)
- Customizable with Tailwind
- **Components:** Button, Input, Dialog, Accordion, Tabs, Select, etc.

**State Management:**
- **React Context + hooks** for simple global state (auth, accessibility preferences)
- **TanStack Query (React Query) 5.0+** for server state
- **Zustand 4.4+** only if needed for complex client state
- **Why:** Avoid over-engineering; Context is sufficient for most use cases

**Real-Time: Socket.IO Client 4.6+**
- WebSocket for live collaboration
- Auto-reconnection
- Room-based messaging

**Media Handling:**
- **Howler.js** - Audio playback (pronunciation, TTS)
- **react-player** - Video playback with captions
- **Web Speech API** - Browser TTS/STT (with Google Cloud fallback)

**PWA: next-pwa 5.6+**
- Offline support
- Service worker for caching
- Install prompt for mobile/desktop

---

### BACKEND

**Runtime: Node.js 20 LTS with TypeScript**
- JavaScript/TypeScript full-stack consistency
- Async/await for I/O operations
- Large ecosystem

**Framework: Next.js API Routes + Express.js (hybrid approach)**

**Why Hybrid:**
- **Next.js API Routes** for simple endpoints (auth, basic CRUD)
- **Standalone Express.js microservices** for complex logic (NLP, real-time)

**Architecture:**
```
Next.js App (Port 3000)
├── Frontend pages
├── API Routes (/api/*)
│   ├── /api/auth/*        (authentication)
│   ├── /api/users/*       (user management)
│   ├── /api/lessons/*     (lesson CRUD)
│   └── /api/progress/*    (progress tracking)

Standalone Microservices:
├── Assessment Service (Port 3001) - Express.js + Python ML
├── Collaboration Service (Port 3002) - Express.js + Socket.IO
└── Notification Service (Port 3003) - Express.js + Bull Queue
```

**API Framework: Express.js 4.18+** (for standalone services)
- Middleware ecosystem
- Simple and proven
- Easy WebSocket integration

**Authentication:**
- **NextAuth.js 4.24+** - Authentication for Next.js
- **JWT** tokens
- **bcrypt** for password hashing
- OAuth providers: Google, Microsoft (optional)

**Validation:**
- **Zod** - Schema validation (shared between frontend and backend)
- **express-validator** - Fallback for Express routes

---

### DATABASE

**PostgreSQL 16** (Primary database)
- **ORM: Prisma 5.7+**
  - Type-safe database client
  - Auto-generated TypeScript types
  - Migration management
  - Excellent DX with VS Code
- **Usage:**
  - User accounts, profiles, authentication
  - Learner progress, assessments
  - Portfolio items, NIOS compliance data
  - Relationships (families, co-ops, educator-student)

**MongoDB 7** (Content storage)
- **ODM: Mongoose 8.0+**
- **Usage:**
  - Lesson content (flexible nested structure)
  - Multi-language content (English/Tamil)
  - User-generated content (forum posts, annotations)
- **Why:** JSON-like documents perfect for multi-modal lesson content

**Redis 7** (Caching & sessions)
- **Client: ioredis 5.3+**
- **Usage:**
  - Session storage
  - API response caching
  - Real-time presence (who's online)
  - Job queue (Bull)

**File Storage: AWS S3 or Cloudflare R2**
- Media files (audio, video, images)
- User uploads (portfolio documents, avatars)
- Printable resources (worksheets, flashcards)

---

### NLP & MACHINE LEARNING

**Python 3.11+ with FastAPI**
- **Why:** Python ecosystem for ML, FastAPI for fast async APIs
- **Deployment:** Standalone microservice

**ML Stack:**
- **Transformers (Hugging Face)** - Pre-trained models
  - Speech recognition: `facebook/wav2vec2-large-xlsr-53`
  - Multilingual NLP: `bert-base-multilingual-cased`
  - Custom fine-tuning for Tamil
- **spaCy 3.7+** - NLP processing
  - `en_core_web_lg` - English
  - `ta_core_news_lg` - Tamil (if available)
- **TensorFlow Lite** or **ONNX Runtime** - Model serving (lightweight)
- **Google Cloud Speech-to-Text/Text-to-Speech** - Fallback/premium quality
  - English: `en-US`, `en-IN`
  - Tamil: `ta-IN`

**ML Service Endpoints:**
```
POST /api/ml/evaluate-pronunciation
POST /api/ml/analyze-text
POST /api/ml/recommend-lessons
```

---

### INFRASTRUCTURE & DEVOPS

**Containerization: Docker 24+**
- Multi-stage builds for optimization
- Docker Compose for local development
- **Images:**
  - `linguaaccess-app` - Next.js frontend + API routes
  - `linguaaccess-assessment` - Assessment microservice
  - `linguaaccess-ml` - Python ML service
  - `postgres:16`
  - `mongo:7`
  - `redis:7`

**Orchestration (Production):**
- **Option 1: Railway/Render** - Managed PaaS (recommended for MVP)
  - Auto-scaling
  - Zero-downtime deployments
  - Built-in SSL/CDN
  - Lower DevOps overhead
- **Option 2: Google Cloud Run** - Serverless containers
  - Pay-per-use
  - Auto-scaling to zero
  - GCP integration (Cloud Speech, Cloud Storage)
- **Option 3: AWS ECS Fargate** - Serverless container orchestration

**Why NOT Kubernetes initially:**
- Overhead too high for 2-person team
- PaaS solutions offer similar benefits with less complexity
- Can migrate to K8s later if needed

**CI/CD: GitHub Actions**
- Automated testing on PR
- Automatic deployment to staging on merge to `develop`
- Manual approval for production deployment from `main`

**Monitoring:**
- **Sentry** - Error tracking (frontend + backend)
- **Vercel Analytics** (if using Vercel) or **Google Analytics 4**
- **Better Stack (formerly Logtail)** - Log management
- **Uptime Robot** - Availability monitoring

**CDN: Cloudflare**
- Media file delivery
- DDoS protection
- Caching
- Free tier sufficient for MVP

---

### TESTING

**Frontend Testing:**
- **Vitest** - Unit testing (faster alternative to Jest)
- **React Testing Library** - Component testing
- **Playwright** - E2E testing
- **axe-core** - Accessibility testing

**Backend Testing:**
- **Vitest** - Unit testing (TypeScript support)
- **Supertest** - API endpoint testing
- **pytest** - Python ML service testing

**Integration Testing:**
- **Playwright** - Full user flows across frontend + backend
- **Docker Compose** - Spin up full stack for integration tests

---

## TASK SPLIT STRATEGY: FEATURE-BASED DOMAIN OWNERSHIP

### Principle: Vertical Slices, Not Horizontal Layers

Each developer owns **complete features** from database to UI, but features are divided by **user role/domain**.

---

## DEVELOPER 1: LEARNER & PARENT EXPERIENCE OWNER

### Domain Responsibility
Owns all features related to **learners** and **parents/guardians**. This includes frontend UI, backend APIs, database schemas, testing, and deployment for learner-facing and parent-facing functionality.

---

### FEATURE AREAS (Developer 1)

#### 1. LEARNER AUTHENTICATION & ONBOARDING
**Frontend:**
- `/app/(auth)/signup/page.tsx` - Sign up flow
- `/app/(auth)/login/page.tsx` - Login page
- `/app/(auth)/verify-email/page.tsx` - Email verification
- `/app/onboarding/page.tsx` - Multi-step onboarding wizard
- Components:
  - `SignUpForm.tsx`
  - `LoginForm.tsx`
  - `OnboardingWizard.tsx`
  - `AccessibilityPreferencesSetup.tsx`

**Backend:**
- `/app/api/auth/signup/route.ts` - User registration
- `/app/api/auth/login/route.ts` - Authentication
- `/app/api/auth/verify-email/route.ts` - Email verification
- `/app/api/onboarding/profile/route.ts` - Save learner profile

**Database (Prisma schema):**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(LEARNER)
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  learnerProfile LearnerProfile?
  parentProfile  ParentProfile?
}

enum Role {
  LEARNER
  PARENT
  EDUCATOR
  PARENT_EDUCATOR
  ADMIN
}

model LearnerProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName          String
  age               Int?
  primaryLanguage   Language @default(ENGLISH)
  disabilities      Json     // ['dyslexia', 'adhd']
  accessibilityPrefs Json    // Font, theme, text size, etc.
  createdAt         DateTime @default(now())
  
  progressRecords ProgressRecord[]
  portfolioItems  PortfolioItem[]
}

enum Language {
  ENGLISH
  TAMIL
}
```

**Testing:**
- Unit tests: Form validation, API route handlers
- Integration tests: Full signup → email verification → onboarding flow
- Accessibility tests: Keyboard navigation, screen reader

**DevOps:**
- Environment variables for email service (SendGrid API key)
- Database migrations for user/profile tables
- Seed data for test users

---

#### 2. LEARNER DASHBOARD
**Frontend:**
- `/app/(learner)/dashboard/page.tsx`
- Components:
  - `DashboardHeader.tsx` - Welcome message, streak tracker
  - `RecommendedLessons.tsx` - AI-recommended next lessons
  - `ProgressOverview.tsx` - Visual progress indicators
  - `QuickActions.tsx` - Resume lesson, practice pronunciation
  - `AchievementBadges.tsx` - Recently earned badges

**Backend:**
- `/app/api/learner/dashboard/route.ts`
  - Fetch user profile
  - Get progress summary
  - Call recommendation engine
  - Get recent achievements

**Database:**
```prisma
model ProgressRecord {
  id            String   @id @default(cuid())
  learnerId     String
  learner       LearnerProfile @relation(fields: [learnerId], references: [id])
  lessonId      String
  completedAt   DateTime?
  score         Int?     // 0-100
  timeSpent     Int      // seconds
  attemptsCount Int      @default(1)
  createdAt     DateTime @default(now())
}

model Achievement {
  id          String   @id @default(cuid())
  learnerId   String
  type        String   // 'streak_7_days', 'perfect_score', etc.
  earnedAt    DateTime @default(now())
  title       String
  description String
}
```

**Testing:**
- Component tests: Dashboard renders correctly with mock data
- API tests: Dashboard endpoint returns correct data structure
- E2E test: Login → Dashboard displays personalized content

**DevOps:**
- Redis caching for dashboard data (15 min TTL)
- Monitoring dashboard API response times

---

#### 3. LESSON LEARNING INTERFACE
**Frontend:**
- `/app/(learner)/lessons/[lessonId]/page.tsx`
- Components:
  - `LessonPlayer.tsx` - Main lesson container
  - `MultiModalContent.tsx` - Synchronized text + audio + visual
  - `VocabularyCard.tsx` - Interactive vocabulary items
  - `PronunciationPractice.tsx` - Speech recognition UI
  - `QuizQuestion.tsx` - Interactive exercises
  - `LessonProgress.tsx` - Progress indicator
  - `AccessibilityToolbar.tsx` - Font, speed, captions controls

**Backend:**
- `/app/api/lessons/[lessonId]/route.ts` - Get lesson content
- `/app/api/lessons/[lessonId]/progress/route.ts` - Save progress
- `/app/api/lessons/[lessonId]/complete/route.ts` - Mark complete

**Database (MongoDB):**
```javascript
// Lesson schema (Mongoose)
const LessonSchema = new Schema({
  lessonId: { type: String, required: true, unique: true },
  title: {
    en: String,
    ta: String
  },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  estimatedDuration: Number, // minutes
  content: {
    introduction: {
      text: { en: String, ta: String },
      audioUrl: { en: String, ta: String },
      imageUrl: String
    },
    sections: [{
      type: { type: String, enum: ['vocabulary', 'grammar', 'practice', 'quiz'] },
      items: Schema.Types.Mixed // Flexible structure per section type
    }]
  },
  niosCompetencies: [String],
  accessibility: {
    dyslexiaAdaptations: String,
    adhdAdaptations: String,
    autismAdaptations: String,
    apdAdaptations: String
  }
});
```

**Testing:**
- Component tests: Each lesson component type renders correctly
- Integration tests: Complete lesson flow from start to finish
- Accessibility tests: WCAG AAA compliance, keyboard navigation
- Browser TTS/STT tests: Web Speech API integration

**DevOps:**
- CDN caching for lesson content (immutable once published)
- Lazy loading for media files
- Service worker caching for offline access

---

#### 4. PRONUNCIATION PRACTICE (SPEECH RECOGNITION)
**Frontend:**
- `/app/(learner)/practice/pronunciation/page.tsx`
- Components:
  - `SpeechRecorder.tsx` - Microphone access, recording UI
  - `WaveformVisualizer.tsx` - Audio visualization
  - `PronunciationFeedback.tsx` - Instant feedback display
  - `PhonemePractice.tsx` - Specific sound practice

**Backend:**
- `/app/api/practice/pronunciation/evaluate/route.ts`
  - Receives audio blob
  - Forwards to ML service
  - Returns pronunciation score + feedback

**ML Service (Python FastAPI):**
```python
# services/ml-service/app/main.py
from fastapi import FastAPI, UploadFile
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
import torch
import librosa

app = FastAPI()

@app.post("/evaluate-pronunciation")
async def evaluate_pronunciation(
    audio: UploadFile,
    expected_text: str,
    language: str = "en"
):
    # Load audio
    audio_bytes = await audio.read()
    audio_array, _ = librosa.load(io.BytesIO(audio_bytes), sr=16000)
    
    # Transcribe using Wav2Vec2
    processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base")
    model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base")
    
    inputs = processor(audio_array, sampling_rate=16000, return_tensors="pt")
    with torch.no_grad():
        logits = model(inputs.input_values).logits
    
    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.batch_decode(predicted_ids)[0]
    
    # Score pronunciation
    score = calculate_similarity(transcription, expected_text)
    errors = identify_errors(transcription, expected_text)
    
    return {
        "score": score,
        "transcription": transcription,
        "errors": errors,
        "feedback": generate_feedback(score, errors, language)
    }
```

**Testing:**
- Unit tests: Audio processing logic
- Integration tests: Upload audio → Receive score
- E2E tests: Full pronunciation practice flow
- Browser compatibility tests: Microphone permissions

**DevOps:**
- ML service deployment (separate Docker container)
- GPU acceleration for ML inference (if available)
- Fallback to Google Cloud Speech if ML service unavailable

---

#### 5. PARENT DASHBOARD & CHILD MONITORING
**Frontend:**
- `/app/(parent)/dashboard/page.tsx`
- `/app/(parent)/child/[childId]/progress/page.tsx`
- Components:
  - `ParentDashboard.tsx`
  - `ChildProgressCard.tsx`
  - `ActivityTimeline.tsx`
  - `StrengthsChallengesReport.tsx`
  - `EducatorCommunicationPanel.tsx`

**Backend:**
- `/app/api/parent/dashboard/route.ts`
- `/app/api/parent/children/route.ts`
- `/app/api/parent/child/[childId]/progress/route.ts`

**Database:**
```prisma
model ParentProfile {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id])
  fullName     String
  relationship String   // 'mother', 'father', 'guardian'
  
  children     FamilyMember[]
}

model FamilyMember {
  id          String   @id @default(cuid())
  parentId    String
  parent      ParentProfile @relation(fields: [parentId], references: [id])
  childId     String
  child       LearnerProfile @relation(fields: [childId], references: [id])
  permissions Json     // What parent can see/do
}
```

**Testing:**
- Component tests: Parent dashboard components
- API tests: Parent can only access their children's data
- Security tests: Authorization checks prevent unauthorized access

**DevOps:**
- Row-level security for parent-child relationships
- Monitoring for failed authorization attempts

---

#### 6. ACCESSIBILITY FEATURES (DYSLEXIA, ADHD, AUTISM, APD)
**Frontend:**
- `/components/AccessibilityProvider.tsx` - Context provider
- `/components/AccessibilityToolbar.tsx` - Quick settings
- `/components/DyslexiaMode.tsx` - Font, spacing, highlighting
- `/components/FocusMode.tsx` - Distraction-free for ADHD
- `/components/SimplifiedView.tsx` - Reduced clutter for autism

**Backend:**
- `/app/api/user/accessibility/route.ts` - Save/retrieve preferences

**Database:**
```prisma
// Stored in LearnerProfile.accessibilityPrefs (JSON)
{
  "font": "lexend" | "opendyslexic",
  "theme": "light" | "dark" | "high-contrast",
  "textSize": 100 | 125 | 150,
  "lineHeight": 1.6 | 2.0,
  "letterSpacing": "normal" | "wide",
  "reducedMotion": boolean,
  "ttsEnabled": boolean,
  "ttsSpeed": 0.5 - 2.0,
  "captionsEnabled": boolean,
  "simplifiedView": boolean,
  "focusMode": boolean
}
```

**Testing:**
- Accessibility tests: WCAG AAA compliance with axe-core
- Screen reader tests: VoiceOver, NVDA compatibility
- Keyboard navigation tests: All features accessible via keyboard
- Color contrast tests: All themes meet 7:1 ratio

**DevOps:**
- LocalStorage for preferences (client-side caching)
- Database persistence for cross-device sync

---

### DEVELOPER 1 SUMMARY

**Codebase Ownership:**
```
/app/(auth)/**              ← Authentication pages
/app/(learner)/**           ← All learner-facing pages
/app/(parent)/**            ← All parent-facing pages
/app/api/auth/**            ← Auth API routes
/app/api/learner/**         ← Learner API routes
/app/api/parent/**          ← Parent API routes
/app/api/practice/**        ← Practice session APIs
/components/learner/**      ← Learner components
/components/parent/**       ← Parent components
/components/accessibility/** ← Accessibility components
/lib/speech-recognition.ts  ← Speech utilities
/lib/text-to-speech.ts      ← TTS utilities
/prisma/schema.prisma       ← User, Learner, Parent models (shared)
/services/ml-service/**     ← ML service (pronunciation, text analysis)
```

**Deployment Ownership:**
- ML service Docker configuration
- Speech API integration (Google Cloud credentials)
- User authentication service
- Database migrations for user/learner/parent tables

---

## DEVELOPER 2: EDUCATOR & CONTENT MANAGEMENT OWNER

### Domain Responsibility
Owns all features related to **educators**, **content management**, **homeschool**, **collaboration**, and **admin**. This includes frontend UI, backend APIs, database schemas, testing, and deployment for educator-facing and platform management functionality.

---

### FEATURE AREAS (Developer 2)

#### 1. EDUCATOR AUTHENTICATION & DASHBOARD
**Frontend:**
- `/app/(educator)/dashboard/page.tsx`
- Components:
  - `EducatorDashboard.tsx`
  - `StudentOverview.tsx` - All students at-a-glance
  - `RecentActivity.tsx` - What students did recently
  - `QuickActions.tsx` - Create lesson, send message, etc.

**Backend:**
- `/app/api/educator/dashboard/route.ts`
- `/app/api/educator/students/route.ts`

**Database:**
```prisma
model EducatorProfile {
  id             String   @id @default(cuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id])
  fullName       String
  qualifications String
  specialization String   // 'SLP', 'Special Ed Teacher', etc.
  
  students       EducatorStudent[]
  createdLessons Lesson[]
}

model EducatorStudent {
  id         String   @id @default(cuid())
  educatorId String
  educator   EducatorProfile @relation(fields: [educatorId], references: [id])
  studentId  String
  student    LearnerProfile @relation(fields: [studentId], references: [id])
  assignedAt DateTime @default(now())
  permissions Json    // What educator can see/do
}
```

**Testing:**
- Component tests: Dashboard renders with student data
- API tests: Educator can only access their assigned students
- Security tests: Authorization boundaries

**DevOps:**
- Role-based access control (RBAC) middleware
- Monitoring educator access patterns

---

#### 2. STUDENT MANAGEMENT & PROGRESS MONITORING
**Frontend:**
- `/app/(educator)/students/page.tsx` - Student list
- `/app/(educator)/students/[studentId]/page.tsx` - Individual student view
- Components:
  - `StudentList.tsx` - Filterable, sortable table
  - `StudentDetailView.tsx` - Comprehensive student profile
  - `ProgressAnalytics.tsx` - Charts, graphs, trends
  - `NICompetencyTracker.tsx` - NIOS competency coverage

**Backend:**
- `/app/api/educator/students/route.ts` - List students
- `/app/api/educator/students/[studentId]/route.ts` - Student details
- `/app/api/educator/students/[studentId]/progress/route.ts` - Progress data
- `/app/api/educator/students/[studentId]/analytics/route.ts` - Analytics

**Database:**
```prisma
model NICompetency {
  id            String   @id @default(cuid())
  studentId     String
  student       LearnerProfile @relation(fields: [studentId], references: [id])
  competencyCode String  // 'L&S1', 'R2', 'W3'
  subject       String   // 'English', 'Tamil'
  gradeLevel    Int
  masteryLevel  MasteryLevel @default(NOT_STARTED)
  dateAchieved  DateTime?
  evidenceLinks Json     // Links to portfolio items
}

enum MasteryLevel {
  NOT_STARTED
  EMERGING
  DEVELOPING
  PROFICIENT
  MASTERED
}
```

**Testing:**
- Component tests: Analytics visualizations render
- API tests: Progress calculations correct
- E2E tests: Educator workflow from student list to detail view

**DevOps:**
- Redis caching for analytics (expensive calculations)
- Background job for generating weekly progress reports

---

#### 3. CONTENT CREATION STUDIO
**Frontend:**
- `/app/(educator)/content/create/page.tsx`
- `/app/(educator)/content/edit/[lessonId]/page.tsx`
- Components:
  - `LessonBuilder.tsx` - Drag-and-drop lesson creator
  - `VocabularyEditor.tsx` - Add words with translations
  - `QuizBuilder.tsx` - Create assessment questions
  - `MediaUploader.tsx` - Upload audio, images, videos
  - `AccessibilityChecker.tsx` - Validate lesson accessibility

**Backend:**
- `/app/api/content/lessons/route.ts` - Create lesson
- `/app/api/content/lessons/[lessonId]/route.ts` - Update/delete lesson
- `/app/api/content/media/upload/route.ts` - Handle file uploads

**Database (MongoDB):**
```javascript
// Extended Lesson schema with creator metadata
const LessonSchema = new Schema({
  // ... previous fields
  createdBy: { type: String, required: true }, // Educator ID
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  visibility: { type: String, enum: ['private', 'school', 'public'], default: 'private' },
  customizations: {
    forStudents: [String], // Specific student IDs if customized
    difficulty: String,
    pacing: String
  }
});
```

**File Upload (S3/R2):**
```typescript
// lib/upload.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadToS3(file: File, folder: string) {
  const s3 = new S3Client({ region: "auto" });
  
  const buffer = await file.arrayBuffer();
  const filename = `${folder}/${Date.now()}-${file.name}`;
  
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Body: Buffer.from(buffer),
    ContentType: file.type,
  }));
  
  return `https://${process.env.CDN_DOMAIN}/${filename}`;
}
```

**Testing:**
- Component tests: Lesson builder interactions
- API tests: File upload, lesson CRUD
- Integration tests: Create lesson → Publish → Learner can access
- File upload tests: Handle large files, validate file types

**DevOps:**
- S3/R2 bucket configuration
- CDN setup (Cloudflare)
- File size limits, virus scanning
- Media transcoding (if needed)

---

#### 4. ASSESSMENT CREATION & GRADING
**Frontend:**
- `/app/(educator)/assessments/create/page.tsx`
- Components:
  - `AssessmentBuilder.tsx`
  - `QuestionTypeSelector.tsx` - Multiple choice, fill-in-blank, etc.
  - `RubricEditor.tsx` - Grading criteria
  - `AutoGradingConfig.tsx` - Set up automatic scoring

**Backend:**
- `/app/api/assessments/route.ts` - Create assessment
- `/app/api/assessments/[assessmentId]/grade/route.ts` - Manual grading
- Integration with ML service for auto-grading written responses

**ML Service (Python):**
```python
# services/ml-service/app/grading.py
from transformers import pipeline

nlp = pipeline("text-classification", model="bert-base-multilingual-cased")

@app.post("/grade-written-response")
async def grade_written_response(
    student_response: str,
    expected_answer: str,
    rubric: dict,
    language: str = "en"
):
    # Semantic similarity
    similarity_score = calculate_semantic_similarity(student_response, expected_answer)
    
    # Grammar check
    grammar_errors = check_grammar(student_response, language)
    
    # Content coverage
    key_points_covered = check_key_points(student_response, rubric.get("key_points", []))
    
    # Generate score and feedback
    score = calculate_final_score(similarity_score, grammar_errors, key_points_covered)
    feedback = generate_detailed_feedback(score, grammar_errors, key_points_covered)
    
    return {
        "score": score,
        "feedback": feedback,
        "grammar_errors": grammar_errors,
        "semantic_similarity": similarity_score
    }
```

**Testing:**
- Component tests: Assessment builder
- API tests: Assessment CRUD, grading
- ML tests: Grading accuracy on sample responses
- E2E tests: Create assessment → Student takes → Auto-grade → Educator reviews

**DevOps:**
- ML service scaling (assessment periods = high load)
- Queue system for batch grading (Bull + Redis)
- Monitoring ML service latency

---

#### 5. COMMUNICATION HUB (EDUCATOR ↔ PARENT ↔ LEARNER)
**Frontend:**
- `/app/(educator)/messages/page.tsx`
- `/app/(parent)/messages/page.tsx`
- Components:
  - `MessageInbox.tsx`
  - `MessageThread.tsx`
  - `ComposeMessage.tsx`
  - `NotificationSettings.tsx`

**Backend:**
- `/app/api/messages/route.ts` - Send message
- `/app/api/messages/[threadId]/route.ts` - Get thread
- `/app/api/messages/unread/route.ts` - Unread count

**Database:**
```prisma
model Message {
  id         String   @id @default(cuid())
  threadId   String
  thread     MessageThread @relation(fields: [threadId], references: [id])
  senderId   String
  sender     User     @relation(fields: [senderId], references: [id])
  content    String   @db.Text
  sentAt     DateTime @default(now())
  readAt     DateTime?
}

model MessageThread {
  id            String   @id @default(cuid())
  participants  String[] // Array of user IDs
  subject       String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  messages      Message[]
}
```

**Real-Time (Socket.IO):**
```typescript
// services/collaboration-service/src/socket.ts
import { Server } from "socket.io";

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL }
});

io.on("connection", (socket) => {
  // User joins their personal room
  socket.on("join", (userId) => {
    socket.join(`user:${userId}`);
  });
  
  // New message sent
  socket.on("send-message", async (data) => {
    const { threadId, senderId, content, recipientIds } = data;
    
    // Save to database
    await saveMessage(threadId, senderId, content);
    
    // Emit to all participants
    recipientIds.forEach((recipientId) => {
      io.to(`user:${recipientId}`).emit("new-message", {
        threadId,
        sender: senderId,
        content,
        timestamp: new Date()
      });
    });
  });
});
```

**Testing:**
- Component tests: Message UI components
- API tests: Message CRUD
- Real-time tests: WebSocket connection, message delivery
- E2E tests: Send message → Receive notification → Reply

**DevOps:**
- Socket.IO service deployment (separate from main app)
- Redis adapter for multi-server Socket.IO
- Rate limiting on message sending (prevent spam)

---

#### 6. HOMESCHOOL HUB & CO-OP MANAGEMENT
**Frontend:**
- `/app/(homeschool)/hub/page.tsx`
- `/app/(homeschool)/schedule/page.tsx`
- `/app/(homeschool)/portfolio/page.tsx`
- `/app/(homeschool)/co-op/page.tsx`
- Components:
  - `HomeschoolDashboard.tsx`
  - `TeachingModeToggle.tsx`
  - `WeeklyPlanner.tsx`
  - `NICompetencyTracker.tsx`
  - `CoOpManager.tsx`
  - `TeachingGuideViewer.tsx`

**Backend:**
- `/app/api/homeschool/schedule/route.ts` - Weekly schedule CRUD
- `/app/api/homeschool/portfolio/route.ts` - Portfolio management
- `/app/api/homeschool/co-op/route.ts` - Co-op management
- `/app/api/homeschool/nios-report/route.ts` - Generate NIOS reports

**Database:**
```prisma
model HomeschoolFamily {
  id              String   @id @default(cuid())
  primaryParentId String
  primaryParent   User     @relation(fields: [primaryParentId], references: [id])
  subscriptionTier String  @default("family")
  
  children        LearnerProfile[]
  coOpMemberships CoOpMembership[]
}

model CoOp {
  id            String   @id @default(cuid())
  name          String
  coordinatorId String
  coordinator   User     @relation(fields: [coordinatorId], references: [id])
  description   String?
  meetingDay    String?  // 'Friday'
  isPrivate     Boolean  @default(true)
  
  memberships   CoOpMembership[]
  sessions      CoOpSession[]
}

model CoOpMembership {
  id       String   @id @default(cuid())
  coOpId   String
  coOp     CoOp     @relation(fields: [coOpId], references: [id])
  familyId String
  family   HomeschoolFamily @relation(fields: [familyId], references: [id])
  joinedAt DateTime @default(now())
  role     String   @default("member") // 'coordinator', 'member'
}

model CoOpSession {
  id          String   @id @default(cuid())
  coOpId      String
  coOp        CoOp     @relation(fields: [coOpId], references: [id])
  sessionDate DateTime
  startTime   String
  topic       String
  lessonId    String?  // Optional: Link to platform lesson
  maxParticipants Int?
  
  participants Json   // Array of learner IDs
}

model PortfolioItem {
  id          String   @id @default(cuid())
  learnerId   String
  learner     LearnerProfile @relation(fields: [learnerId], references: [id])
  itemType    PortfolioItemType
  title       String
  description String?
  fileUrl     String?
  competencies String[] // NIOS competency codes
  createdAt   DateTime @default(now())
  parentNotes String?  @db.Text
}

enum PortfolioItemType {
  LESSON_LOG
  WORK_SAMPLE
  ASSESSMENT
  PHOTO
  VIDEO
  OBSERVATION
}
```

**NIOS Report Generation:**
```typescript
// lib/nios-report.ts
import PDFDocument from "pdfkit";
import { Readable } from "stream";

export async function generateNIOSReport(learnerId: string, academicYear: string) {
  const data = await fetchNIOSData(learnerId, academicYear);
  
  const doc = new PDFDocument();
  const stream = new Readable();
  
  doc.pipe(stream);
  
  // Header
  doc.fontSize(20).text("NIOS Progress Report", { align: "center" });
  doc.fontSize(12).text(`Academic Year: ${academicYear}`, { align: "center" });
  doc.moveDown();
  
  // Learner Info
  doc.fontSize(14).text(`Learner: ${data.learnerName}`);
  doc.fontSize(12).text(`Grade Level: ${data.gradeLevel}`);
  doc.moveDown();
  
  // Competency Table
  doc.fontSize(14).text("Competency Coverage:");
  data.competencies.forEach((comp) => {
    doc.fontSize(10).text(`${comp.code}: ${comp.description} - ${comp.masteryLevel}`);
  });
  
  // Learning Hours
  doc.moveDown();
  doc.fontSize(14).text(`Total Learning Hours: ${data.totalHours}`);
  
  doc.end();
  
  return stream;
}
```

**Testing:**
- Component tests: Homeschool UI components
- API tests: Schedule CRUD, co-op management
- Integration tests: Create co-op → Invite families → Schedule session
- PDF generation tests: NIOS report format validation

**DevOps:**
- PDF generation service (pdfkit or Puppeteer)
- File storage for generated reports (S3)
- Email service for sending reports (SendGrid)

---

#### 7. REAL-TIME COLLABORATION ROOMS
**Frontend:**
- `/app/collaboration/room/[roomId]/page.tsx`
- Components:
  - `CollaborationRoom.tsx`
  - `SharedWhiteboard.tsx` - Drawing canvas
  - `ParticipantList.tsx` - Who's in the room
  - `ChatPanel.tsx` - Text chat
  - `VideoCall.tsx` - Optional video (WebRTC)

**Backend (Socket.IO Service):**
```typescript
// services/collaboration-service/src/collaboration.ts
import { Server } from "socket.io";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

io.on("connection", (socket) => {
  socket.on("join-room", async ({ roomId, userId }) => {
    socket.join(roomId);
    
    // Get room participants
    const participants = await getRoomParticipants(roomId);
    
    // Notify others
    socket.to(roomId).emit("user-joined", { userId });
    
    // Send current participants to new user
    socket.emit("room-state", { participants });
  });
  
  socket.on("whiteboard-draw", ({ roomId, drawData }) => {
    // Broadcast drawing to all in room
    socket.to(roomId).emit("whiteboard-update", drawData);
  });
  
  socket.on("chat-message", ({ roomId, message }) => {
    socket.to(roomId).emit("new-chat-message", {
      userId: socket.data.userId,
      message,
      timestamp: new Date()
    });
  });
});
```

**CRDT for Shared Whiteboard (Y.js):**
```typescript
// lib/collaborative-drawing.ts
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export function initCollaborativeCanvas(roomId: string) {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider(
    "ws://localhost:3002",
    roomId,
    ydoc
  );
  
  const yDrawing = ydoc.getArray("drawing");
  
  // Listen for remote changes
  yDrawing.observe(() => {
    renderCanvas(yDrawing.toArray());
  });
  
  return { ydoc, provider, yDrawing };
}
```

**Testing:**
- Component tests: Collaboration UI components
- WebSocket tests: Connection, reconnection, room joining
- CRDT tests: Conflict-free simultaneous editing
- Load tests: 10-20 concurrent users in one room

**DevOps:**
- Dedicated Socket.IO server (Node.js)
- Redis adapter for horizontal scaling
- WebRTC TURN server (coturn) for video calls
- Monitoring concurrent connections

---

#### 8. ADMIN DASHBOARD & SYSTEM MANAGEMENT
**Frontend:**
- `/app/(admin)/dashboard/page.tsx`
- `/app/(admin)/users/page.tsx`
- `/app/(admin)/content/moderation/page.tsx`
- `/app/(admin)/analytics/page.tsx`
- Components:
  - `AdminDashboard.tsx`
  - `UserManagement.tsx`
  - `ContentModerationQueue.tsx`
  - `PlatformAnalytics.tsx`
  - `SystemHealth.tsx`

**Backend:**
- `/app/api/admin/users/route.ts` - User CRUD
- `/app/api/admin/content/moderate/route.ts` - Content moderation
- `/app/api/admin/analytics/route.ts` - Platform metrics
- `/app/api/admin/system/health/route.ts` - System status

**Database:**
```prisma
model AuditLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  action    String   // 'user_created', 'lesson_published', etc.
  entityType String  // 'user', 'lesson', 'message'
  entityId  String?
  metadata  Json?
  ipAddress String?
  timestamp DateTime @default(now())
}

model ContentFlag {
  id         String   @id @default(cuid())
  contentType String  // 'lesson', 'message', 'forum_post'
  contentId  String
  reportedBy String
  reporter   User     @relation(fields: [reportedBy], references: [id])
  reason     String
  status     String   @default("pending") // 'pending', 'reviewed', 'actioned'
  reviewedBy String?
  reviewedAt DateTime?
  action     String?  // 'approved', 'removed', 'warning_sent'
}
```

**Analytics (TimescaleDB):**
```sql
-- Platform usage metrics
CREATE TABLE platform_metrics (
  time        TIMESTAMPTZ NOT NULL,
  metric_name VARCHAR(50) NOT NULL,
  value       DOUBLE PRECISION,
  dimensions  JSONB
);

SELECT create_hypertable('platform_metrics', 'time');

-- Example metrics:
-- daily_active_users
-- lessons_completed_per_day
-- average_lesson_duration
-- pronunciation_practice_sessions
-- api_response_time
```

**Testing:**
- Component tests: Admin UI components
- API tests: Admin endpoints with RBAC
- Security tests: Ensure only admins can access
- Analytics tests: Metric calculations correct

**DevOps:**
- Admin-only deployment environment variables
- Audit logging for all admin actions
- Monitoring admin access patterns
- Alerting for suspicious activity

---

### DEVELOPER 2 SUMMARY

**Codebase Ownership:**
```
/app/(educator)/**          ← All educator-facing pages
/app/(homeschool)/**        ← All homeschool pages
/app/(admin)/**             ← All admin pages
/app/collaboration/**       ← Collaboration room pages
/app/api/educator/**        ← Educator API routes
/app/api/content/**         ← Content management APIs
/app/api/assessments/**     ← Assessment APIs
/app/api/messages/**        ← Messaging APIs
/app/api/homeschool/**      ← Homeschool APIs
/app/api/admin/**           ← Admin APIs
/components/educator/**     ← Educator components
/components/homeschool/**   ← Homeschool components
/components/admin/**        ← Admin components
/components/collaboration/** ← Collaboration components
/lib/upload.ts              ← File upload utilities
/lib/nios-report.ts         ← NIOS report generation
/prisma/schema.prisma       ← Educator, Homeschool, Admin models (shared)
/services/collaboration-service/** ← Socket.IO service
/services/notification-service/**  ← Email/push notifications
```

**Deployment Ownership:**
- Socket.IO collaboration service
- File upload service (S3/R2)
- Notification service (SendGrid, FCM)
- Background job queue (Bull + Redis)
- Database migrations for educator/homeschool/admin tables

---

## SHARED RESPONSIBILITIES

### Both Developers Collaborate On:

#### 1. DATABASE SCHEMA (`/prisma/schema.prisma`)
- **Protocol:** 
  - Announce schema changes in Slack before making
  - Run `npx prisma migrate dev` locally
  - Commit migration files
  - Other developer pulls and applies migration
- **Conflict Prevention:**
  - Dev 1 owns: User, LearnerProfile, ParentProfile, ProgressRecord
  - Dev 2 owns: EducatorProfile, HomeschoolFamily, CoOp, Message
  - Both review before merging to `main`

#### 2. SHARED TYPES (`/lib/types.ts`)
```typescript
// Shared type definitions
export interface User {
  id: string;
  email: string;
  role: Role;
  // ...
}

export interface Lesson {
  id: string;
  title: { en: string; ta: string };
  // ...
}

// etc.
```

#### 3. API DOCUMENTATION (`/docs/api.md`)
- OpenAPI/Swagger spec
- Both developers update for their endpoints
- Auto-generated docs via tools like Scalar or Swagger UI

#### 4. TESTING INFRASTRUCTURE
- **Unit tests:** Each developer tests their own code
- **Integration tests:** Collaborate on cross-domain flows
  - Example: Educator creates lesson → Learner completes → Parent views progress
- **E2E tests:** Both contribute scenarios
  - Dev 1: Learner journey tests
  - Dev 2: Educator journey tests

#### 5. DEPLOYMENT CONFIGURATION
- **Docker Compose** (`/docker-compose.yml`)
  - Dev 1: Frontend, ML service containers
  - Dev 2: Collaboration service, notification service
- **Environment Variables** (`.env.example`)
  - Document all required vars
  - Both update as new services added

#### 6. CI/CD PIPELINE (`.github/workflows/`)
```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test          # Dev 1 & Dev 2 tests
      - run: npm run test:e2e      # Integration tests

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: |
          # Deploy all services to staging environment

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Production
        run: |
          # Deploy all services to production
```

---

## BRANCH & WORKFLOW STRATEGY

### Git Branching Model

```
main (production)
├── develop (integration)
│   ├── feature/learner-dashboard (Dev 1)
│   ├── feature/pronunciation-practice (Dev 1)
│   ├── feature/parent-monitoring (Dev 1)
│   ├── feature/educator-dashboard (Dev 2)
│   ├── feature/content-creator (Dev 2)
│   ├── feature/homeschool-hub (Dev 2)
│   └── feature/collaboration-rooms (Dev 2)
```

### Daily Workflow

**Both Developers:**

1. **Morning (9:00 AM):**
   - Pull latest `develop` branch
   - Post daily standup in Slack:
     ```
     Yesterday: Completed learner dashboard UI
     Today: Working on pronunciation practice integration
     Blockers: Need ML service endpoint for speech evaluation
     ```

2. **During Day:**
   - Work in feature branches
   - Commit frequently with clear messages
   - Push to remote at end of day (backup)

3. **End of Day (6:00 PM):**
   - Create PR if feature complete
   - Tag other developer for review
   - Respond to any PR review comments

4. **Code Review:**
   - Review other developer's PRs
   - Check for:
     - Code quality
     - Test coverage
     - API contract compliance
     - Accessibility
     - Security

5. **Weekly Integration (Friday):**
   - Both merge approved PRs to `develop`
   - Run full test suite
   - Manual QA of integrated features
   - If all green, merge `develop` → `main`
   - Deploy to production

### Conflict Resolution

**If Rare Conflict Occurs:**

1. **Immediate Communication:**
   ```
   Dev 1: "Hey, I'm seeing a merge conflict in schema.prisma"
   Dev 2: "Let's hop on a quick call"
   ```

2. **Screen Share Resolution (5-10 min):**
   - Review both changes
   - Decide how to combine
   - Test locally
   - Commit resolution

3. **Document:**
   ```
   git commit -m "Merge conflict resolution: Combined User and Educator schema changes"
   ```

---

## TECH STACK SUMMARY

### Frontend
- React 18 + TypeScript + Next.js 14
- Tailwind CSS + shadcn/ui
- React Query (server state)
- Socket.IO Client
- Web Speech API

### Backend
- Next.js API Routes (simple endpoints)
- Express.js (complex services)
- NextAuth.js (authentication)
- Socket.IO (real-time)
- Python FastAPI (ML service)

### Database
- PostgreSQL 16 + Prisma (relational data)
- MongoDB 7 + Mongoose (content)
- Redis 7 (caching, sessions, jobs)

### ML/NLP
- Transformers (Hugging Face)
- spaCy
- Google Cloud Speech APIs

### Infrastructure
- Docker (containerization)
- Railway/Render (PaaS hosting)
- GitHub Actions (CI/CD)
- Cloudflare (CDN)
- AWS S3/R2 (file storage)
- SendGrid (email)

### Monitoring
- Sentry (errors)
- Better Stack (logs)
- Uptime Robot (availability)

---

## FINAL TASK DISTRIBUTION MATRIX

| Feature Area | Frontend | Backend | Database | ML/AI | Testing | DevOps | Owner |
|-------------|----------|---------|----------|-------|---------|--------|-------|
| **Learner Experience** |
| Auth & Onboarding | ✅ | ✅ | ✅ | - | ✅ | ✅ | Dev 1 |
| Learner Dashboard | ✅ | ✅ | ✅ | - | ✅ | - | Dev 1 |
| Lesson Interface | ✅ | ✅ | ✅ | - | ✅ | - | Dev 1 |
| Pronunciation Practice | ✅ | ✅ | - | ✅ | ✅ | ✅ | Dev 1 |
| Progress Tracking | ✅ | ✅ | ✅ | - | ✅ | - | Dev 1 |
| **Parent Experience** |
| Parent Dashboard | ✅ | ✅ | ✅ | - | ✅ | - | Dev 1 |
| Child Monitoring | ✅ | ✅ | ✅ | - | ✅ | - | Dev 1 |
| **Educator Experience** |
| Educator Dashboard | ✅ | ✅ | ✅ | - | ✅ | - | Dev 2 |
| Student Management | ✅ | ✅ | ✅ | - | ✅ | - | Dev 2 |
| Content Creation | ✅ | ✅ | ✅ | - | ✅ | ✅ | Dev 2 |
| Assessment Tools | ✅ | ✅ | ✅ | ✅ | ✅ | - | Dev 2 |
| **Homeschool** |
| Homeschool Hub | ✅ | ✅ | ✅ | - | ✅ | - | Dev 2 |
| Co-op Management | ✅ | ✅ | ✅ | - | ✅ | - | Dev 2 |
| NIOS Reporting | ✅ | ✅ | ✅ | - | ✅ | ✅ | Dev 2 |
| **Communication** |
| Messaging System | ✅ | ✅ | ✅ | - | ✅ | ✅ | Dev 2 |
| Notifications | - | ✅ | ✅ | - | ✅ | ✅ | Dev 2 |
| **Collaboration** |
| Real-time Rooms | ✅ | ✅ | ✅ | - | ✅ | ✅ | Dev 2 |
| Shared Whiteboard | ✅ | ✅ | - | - | ✅ | - | Dev 2 |
| **Admin** |
| Admin Dashboard | ✅ | ✅ | ✅ | - | ✅ | - | Dev 2 |
| Content Moderation | ✅ | ✅ | ✅ | - | ✅ | - | Dev 2 |
| Platform Analytics | ✅ | ✅ | ✅ | - | ✅ | - | Dev 2 |
| **Shared/Core** |
| Accessibility Features | ✅ | ✅ | ✅ | - | ✅ | - | Dev 1 |
| Database Schema | - | - | 🤝 | - | - | - | Both |
| API Documentation | - | 🤝 | - | - | - | - | Both |
| CI/CD Pipeline | - | - | - | - | - | 🤝 | Both |

**Legend:**
- ✅ = Full ownership
- 🤝 = Shared responsibility, coordinate before changes
- `-` = Not applicable

---

## SUCCESS METRICS

### Code Quality
- 80%+ test coverage
- Zero critical accessibility violations
- WCAG AAA compliance
- TypeScript strict mode enabled

### Performance
- Lighthouse score >90
- API response time <200ms (95th percentile)
- Page load time <2s
- Time to Interactive <3s

### Collaboration
- Code review turnaround <24 hours
- Zero merge conflicts (or resolved within 1 hour)
- Weekly integration successful (no broken builds)
- Daily standup participation 100%

This distribution ensures both developers are genuine full-stack engineers while maintaining clear ownership boundaries to prevent conflicts.
