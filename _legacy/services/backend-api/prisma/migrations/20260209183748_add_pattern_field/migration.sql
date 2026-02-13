-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('LEARNER', 'PARENT', 'EDUCATOR', 'SPEECH_THERAPIST', 'ADMIN', 'PARENT_EDUCATOR');

-- CreateEnum
CREATE TYPE "ProficiencyLevel" AS ENUM ('BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'UPPER_INTERMEDIATE', 'ADVANCED', 'MASTERY');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'MASTERED', 'STRUGGLING');

-- CreateEnum
CREATE TYPE "MasteryLevel" AS ENUM ('NOVICE', 'DEVELOPING', 'PROFICIENT', 'MASTERED', 'ADVANCED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatar" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'LEARNER',
    "pattern" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMP(3),
    "accessibilityPrefs" JSONB NOT NULL DEFAULT '{}',
    "language" TEXT NOT NULL DEFAULT 'en',
    "theme" TEXT NOT NULL DEFAULT 'light',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "grade" TEXT,
    "school" TEXT,
    "disabilityTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "iepGoals" TEXT,
    "accommodations" JSONB,
    "nativeLanguage" TEXT NOT NULL DEFAULT 'en',
    "learningLanguages" TEXT[] DEFAULT ARRAY['en']::TEXT[],
    "proficiencyLevel" "ProficiencyLevel" NOT NULL DEFAULT 'BEGINNER',
    "placementScore" INTEGER DEFAULT 0,
    "lastAssessmentDate" TIMESTAMP(3),
    "fontFamily" TEXT NOT NULL DEFAULT 'system',
    "fontSize" INTEGER NOT NULL DEFAULT 16,
    "lineSpacing" DOUBLE PRECISION NOT NULL DEFAULT 1.5,
    "letterSpacing" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "colorScheme" TEXT NOT NULL DEFAULT 'light',
    "reducedMotion" BOOLEAN NOT NULL DEFAULT false,
    "highlightText" BOOLEAN NOT NULL DEFAULT false,
    "bionicReading" BOOLEAN NOT NULL DEFAULT false,
    "focusMode" BOOLEAN NOT NULL DEFAULT false,
    "enableSpeechRec" BOOLEAN NOT NULL DEFAULT true,
    "speechRecLang" TEXT NOT NULL DEFAULT 'en-US',
    "speechShowSubtitles" BOOLEAN NOT NULL DEFAULT true,
    "learningStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "pauseReason" TEXT,
    "pauseUntil" TIMESTAMP(3),
    "modeUntil" TIMESTAMP(3),
    "weeklyTargetHours" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PARENT',
    "notificationFrequency" TEXT NOT NULL DEFAULT 'weekly',
    "notificationPreferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notificationMethod" TEXT NOT NULL DEFAULT 'email',
    "preferredNotificationTime" TEXT,
    "receiveEmails" BOOLEAN NOT NULL DEFAULT true,
    "receiveNotifications" BOOLEAN NOT NULL DEFAULT true,
    "messageThreads" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducatorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "certification" TEXT,
    "licenseNumber" TEXT,
    "institution" TEXT,
    "specialization" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdLessonIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAssessmentIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducatorStudent" (
    "id" TEXT NOT NULL,
    "educatorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "permissions" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "EducatorStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contentId" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "gradeLevel" TEXT,
    "duration" INTEGER,
    "estimatedDuration" INTEGER,
    "subject" TEXT,
    "competencies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "learningObjectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "creatorId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "multiModalContent" BOOLEAN NOT NULL DEFAULT true,
    "hasTranscripts" BOOLEAN NOT NULL DEFAULT true,
    "hasCaptions" BOOLEAN NOT NULL DEFAULT true,
    "hasAltText" BOOLEAN NOT NULL DEFAULT true,
    "progressIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "assessmentIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonStep" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB,
    "stepType" TEXT NOT NULL DEFAULT 'content',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "creatorId" TEXT NOT NULL,
    "assessmentType" TEXT NOT NULL DEFAULT 'formative',
    "questions" JSONB,
    "passingScore" INTEGER NOT NULL DEFAULT 70,
    "responseIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3) NOT NULL,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER DEFAULT 0,
    "duration" INTEGER,
    "interactionMetrics" JSONB,
    "errorPatterns" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentResponse" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "responses" JSONB,
    "audioFile" TEXT,
    "score" INTEGER,
    "feedback" TEXT,
    "gradedBy" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradedAt" TIMESTAMP(3),

    CONSTRAINT "AssessmentResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressRecord" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "competencyId" TEXT NOT NULL,
    "competencyName" TEXT NOT NULL,
    "masteryLevel" "MasteryLevel" NOT NULL,
    "evidenceItems" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgressRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioItem" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "itemType" TEXT NOT NULL,
    "contentUrl" TEXT,
    "contentDescription" TEXT,
    "relatedLessonId" TEXT,
    "relatedCompetencies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "sharedWith" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "learnerReflection" TEXT,
    "educatorFeedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "badgeName" TEXT NOT NULL,
    "description" TEXT,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageThread" (
    "id" TEXT NOT NULL,
    "participantIds" TEXT[],
    "subject" TEXT,
    "lastMessageAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "educatorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "maxStudents" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoOp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoOp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledLesson" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonLog" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "subject" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "competenciesCovered" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "parentReflection" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkSample" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "lessonLogId" TEXT,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "competencies" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkSample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NIOSCompetency" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'not-started',
    "evidences" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NIOSCompetency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "present" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachingNote" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "completedSteps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeachingNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentCourse" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "modules" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentCourseProgress" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'not-started',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentCourseProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeHour" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "maxParticipants" INTEGER NOT NULL,
    "description" TEXT,
    "meetingLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficeHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeHourRegistration" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "officeHourId" TEXT NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfficeHourRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumPost" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumReply" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ForumReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumLike" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "LearnerProfile_userId_key" ON "LearnerProfile"("userId");

-- CreateIndex
CREATE INDEX "LearnerProfile_userId_idx" ON "LearnerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentProfile_userId_key" ON "ParentProfile"("userId");

-- CreateIndex
CREATE INDEX "ParentProfile_userId_idx" ON "ParentProfile"("userId");

-- CreateIndex
CREATE INDEX "FamilyMember_parentId_idx" ON "FamilyMember"("parentId");

-- CreateIndex
CREATE INDEX "FamilyMember_childId_idx" ON "FamilyMember"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_parentId_childId_key" ON "FamilyMember"("parentId", "childId");

-- CreateIndex
CREATE UNIQUE INDEX "EducatorProfile_userId_key" ON "EducatorProfile"("userId");

-- CreateIndex
CREATE INDEX "EducatorProfile_userId_idx" ON "EducatorProfile"("userId");

-- CreateIndex
CREATE INDEX "EducatorStudent_educatorId_idx" ON "EducatorStudent"("educatorId");

-- CreateIndex
CREATE INDEX "EducatorStudent_studentId_idx" ON "EducatorStudent"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "EducatorStudent_educatorId_studentId_key" ON "EducatorStudent"("educatorId", "studentId");

-- CreateIndex
CREATE INDEX "Lesson_creatorId_idx" ON "Lesson"("creatorId");

-- CreateIndex
CREATE INDEX "Lesson_language_idx" ON "Lesson"("language");

-- CreateIndex
CREATE INDEX "LessonStep_lessonId_idx" ON "LessonStep"("lessonId");

-- CreateIndex
CREATE INDEX "Assessment_creatorId_idx" ON "Assessment"("creatorId");

-- CreateIndex
CREATE INDEX "Assessment_lessonId_idx" ON "Assessment"("lessonId");

-- CreateIndex
CREATE INDEX "LessonProgress_learnerId_idx" ON "LessonProgress"("learnerId");

-- CreateIndex
CREATE INDEX "LessonProgress_lessonId_idx" ON "LessonProgress"("lessonId");

-- CreateIndex
CREATE INDEX "LessonProgress_status_idx" ON "LessonProgress"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_learnerId_lessonId_key" ON "LessonProgress"("learnerId", "lessonId");

-- CreateIndex
CREATE INDEX "AssessmentResponse_assessmentId_idx" ON "AssessmentResponse"("assessmentId");

-- CreateIndex
CREATE INDEX "AssessmentResponse_learnerId_idx" ON "AssessmentResponse"("learnerId");

-- CreateIndex
CREATE INDEX "ProgressRecord_learnerId_idx" ON "ProgressRecord"("learnerId");

-- CreateIndex
CREATE INDEX "ProgressRecord_competencyId_idx" ON "ProgressRecord"("competencyId");

-- CreateIndex
CREATE INDEX "PortfolioItem_learnerId_idx" ON "PortfolioItem"("learnerId");

-- CreateIndex
CREATE INDEX "Achievement_learnerId_idx" ON "Achievement"("learnerId");

-- CreateIndex
CREATE INDEX "Message_threadId_idx" ON "Message"("threadId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_code_key" ON "Classroom"("code");

-- CreateIndex
CREATE INDEX "Classroom_educatorId_idx" ON "Classroom"("educatorId");

-- CreateIndex
CREATE UNIQUE INDEX "CoOp_code_key" ON "CoOp"("code");

-- CreateIndex
CREATE INDEX "ScheduledLesson_learnerId_idx" ON "ScheduledLesson"("learnerId");

-- CreateIndex
CREATE INDEX "ScheduledLesson_lessonId_idx" ON "ScheduledLesson"("lessonId");

-- CreateIndex
CREATE INDEX "LessonLog_learnerId_idx" ON "LessonLog"("learnerId");

-- CreateIndex
CREATE INDEX "LessonLog_date_idx" ON "LessonLog"("date");

-- CreateIndex
CREATE INDEX "WorkSample_learnerId_idx" ON "WorkSample"("learnerId");

-- CreateIndex
CREATE INDEX "WorkSample_lessonLogId_idx" ON "WorkSample"("lessonLogId");

-- CreateIndex
CREATE INDEX "NIOSCompetency_learnerId_idx" ON "NIOSCompetency"("learnerId");

-- CreateIndex
CREATE INDEX "NIOSCompetency_subject_idx" ON "NIOSCompetency"("subject");

-- CreateIndex
CREATE INDEX "Attendance_learnerId_idx" ON "Attendance"("learnerId");

-- CreateIndex
CREATE INDEX "Attendance_date_idx" ON "Attendance"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_learnerId_date_key" ON "Attendance"("learnerId", "date");

-- CreateIndex
CREATE INDEX "TeachingNote_parentId_idx" ON "TeachingNote"("parentId");

-- CreateIndex
CREATE INDEX "TeachingNote_learnerId_idx" ON "TeachingNote"("learnerId");

-- CreateIndex
CREATE INDEX "TeachingNote_lessonId_idx" ON "TeachingNote"("lessonId");

-- CreateIndex
CREATE INDEX "ParentCourse_category_idx" ON "ParentCourse"("category");

-- CreateIndex
CREATE INDEX "ParentCourseProgress_parentId_idx" ON "ParentCourseProgress"("parentId");

-- CreateIndex
CREATE INDEX "ParentCourseProgress_courseId_idx" ON "ParentCourseProgress"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentCourseProgress_parentId_courseId_key" ON "ParentCourseProgress"("parentId", "courseId");

-- CreateIndex
CREATE INDEX "OfficeHour_date_idx" ON "OfficeHour"("date");

-- CreateIndex
CREATE INDEX "OfficeHourRegistration_parentId_idx" ON "OfficeHourRegistration"("parentId");

-- CreateIndex
CREATE INDEX "OfficeHourRegistration_officeHourId_idx" ON "OfficeHourRegistration"("officeHourId");

-- CreateIndex
CREATE UNIQUE INDEX "OfficeHourRegistration_parentId_officeHourId_key" ON "OfficeHourRegistration"("parentId", "officeHourId");

-- CreateIndex
CREATE INDEX "ForumPost_authorId_idx" ON "ForumPost"("authorId");

-- CreateIndex
CREATE INDEX "ForumPost_category_idx" ON "ForumPost"("category");

-- CreateIndex
CREATE INDEX "ForumPost_createdAt_idx" ON "ForumPost"("createdAt");

-- CreateIndex
CREATE INDEX "ForumReply_postId_idx" ON "ForumReply"("postId");

-- CreateIndex
CREATE INDEX "ForumReply_authorId_idx" ON "ForumReply"("authorId");

-- CreateIndex
CREATE INDEX "ForumLike_postId_idx" ON "ForumLike"("postId");

-- CreateIndex
CREATE INDEX "ForumLike_userId_idx" ON "ForumLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ForumLike_postId_userId_key" ON "ForumLike"("postId", "userId");

-- AddForeignKey
ALTER TABLE "LearnerProfile" ADD CONSTRAINT "LearnerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentProfile" ADD CONSTRAINT "ParentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducatorProfile" ADD CONSTRAINT "EducatorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducatorStudent" ADD CONSTRAINT "EducatorStudent_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "EducatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducatorStudent" ADD CONSTRAINT "EducatorStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonStep" ADD CONSTRAINT "LessonStep_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResponse" ADD CONSTRAINT "AssessmentResponse_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressRecord" ADD CONSTRAINT "ProgressRecord_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "MessageThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "EducatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLog" ADD CONSTRAINT "LessonLog_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSample" ADD CONSTRAINT "WorkSample_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSample" ADD CONSTRAINT "WorkSample_lessonLogId_fkey" FOREIGN KEY ("lessonLogId") REFERENCES "LessonLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NIOSCompetency" ADD CONSTRAINT "NIOSCompetency_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingNote" ADD CONSTRAINT "TeachingNote_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentCourseProgress" ADD CONSTRAINT "ParentCourseProgress_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentCourseProgress" ADD CONSTRAINT "ParentCourseProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "ParentCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeHourRegistration" ADD CONSTRAINT "OfficeHourRegistration_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeHourRegistration" ADD CONSTRAINT "OfficeHourRegistration_officeHourId_fkey" FOREIGN KEY ("officeHourId") REFERENCES "OfficeHour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "ParentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumReply" ADD CONSTRAINT "ForumReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumLike" ADD CONSTRAINT "ForumLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
