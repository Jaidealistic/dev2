-- CreateEnum
CREATE TYPE "Role" AS ENUM ('LEARNER', 'PARENT', 'EDUCATOR', 'PARENT_EDUCATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'TAMIL');

-- CreateEnum
CREATE TYPE "PortfolioItemType" AS ENUM ('LESSON_LOG', 'WORK_SAMPLE', 'ASSESSMENT', 'PHOTO', 'VIDEO', 'OBSERVATION', 'PROJECT', 'CERTIFICATE');

-- CreateEnum
CREATE TYPE "MasteryLevel" AS ENUM ('NOT_STARTED', 'EMERGING', 'DEVELOPING', 'PROFICIENT', 'MASTERED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'LEARNER',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearnerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "age" INTEGER,
    "primaryLanguage" "Language" NOT NULL DEFAULT 'ENGLISH',
    "learningLanguage" "Language" NOT NULL,
    "disabilities" JSONB NOT NULL,
    "accessibilityPrefs" JSONB NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearnerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressRecord" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "score" INTEGER,
    "timeSpentSec" INTEGER NOT NULL,
    "attemptsCount" INTEGER NOT NULL DEFAULT 1,
    "responses" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducatorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "qualifications" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "institution" TEXT,
    "yearsExperience" INTEGER,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdContent" TEXT[],

    CONSTRAINT "EducatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducatorStudent" (
    "id" TEXT NOT NULL,
    "educatorId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,
    "permissions" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,

    CONSTRAINT "EducatorStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeschoolFamily" (
    "id" TEXT NOT NULL,
    "primaryParentId" TEXT NOT NULL,
    "familyName" TEXT,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'family',
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeschoolFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklySchedule" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "weekEnd" TIMESTAMP(3) NOT NULL,
    "schedule" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoOp" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coordinatorId" TEXT NOT NULL,
    "description" TEXT,
    "meetingDay" TEXT,
    "meetingTime" TEXT,
    "location" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "maxMembers" INTEGER,
    "tags" TEXT[],
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoOp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoOpMembership" (
    "id" TEXT NOT NULL,
    "coOpId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "status" TEXT NOT NULL DEFAULT 'active',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoOpMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoOpSession" (
    "id" TEXT NOT NULL,
    "coOpId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sessionDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "duration" INTEGER,
    "topic" TEXT NOT NULL,
    "lessonId" TEXT,
    "hostId" TEXT NOT NULL,
    "maxParticipants" INTEGER,
    "participants" JSONB NOT NULL,
    "resources" JSONB,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "meetingLink" TEXT,
    "recordingUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoOpSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioItem" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "itemType" "PortfolioItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "competencies" TEXT[],
    "lessonId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentNotes" TEXT,
    "educatorNotes" TEXT,
    "tags" TEXT[],

    CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NIOSCompetency" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "competencyCode" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "gradeLevel" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "masteryLevel" "MasteryLevel" NOT NULL DEFAULT 'NOT_STARTED',
    "dateStarted" TIMESTAMP(3),
    "dateAchieved" TIMESTAMP(3),
    "evidenceLinks" JSONB NOT NULL,
    "assessmentData" JSONB,
    "notes" TEXT,
    "lastReviewed" TIMESTAMP(3),
    "reviewedBy" TEXT,

    CONSTRAINT "NIOSCompetency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageThread" (
    "id" TEXT NOT NULL,
    "participants" TEXT[],
    "participantRoles" JSONB NOT NULL,
    "subject" TEXT NOT NULL,
    "context" TEXT,
    "contextId" TEXT,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" JSONB,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "editedAt" TIMESTAMP(3),
    "readBy" TEXT[],
    "readAt" JSONB,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "location" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentFlag" (
    "id" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "resolution" TEXT,
    "action" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollaborationRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "maxParticipants" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "settings" JSONB NOT NULL,
    "participants" JSONB NOT NULL,
    "whiteboardState" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "CollaborationRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "lessonId" TEXT,
    "assessmentType" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "rubric" JSONB,
    "totalPoints" INTEGER NOT NULL,
    "passingScore" INTEGER NOT NULL,
    "timeLimit" INTEGER,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "isAdaptive" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "tags" TEXT[],
    "niosCompetencies" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentSubmission" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "answers" JSONB NOT NULL,
    "score" INTEGER,
    "feedback" JSONB,
    "timeSpent" INTEGER,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradedAt" TIMESTAMP(3),
    "gradedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'submitted',

    CONSTRAINT "AssessmentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemMetric" (
    "id" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "metricType" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "tags" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemMetric_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "ProgressRecord_learnerId_lessonId_idx" ON "ProgressRecord"("learnerId", "lessonId");

-- CreateIndex
CREATE INDEX "ProgressRecord_completedAt_idx" ON "ProgressRecord"("completedAt");

-- CreateIndex
CREATE INDEX "Achievement_learnerId_idx" ON "Achievement"("learnerId");

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
CREATE INDEX "EducatorProfile_specialization_idx" ON "EducatorProfile"("specialization");

-- CreateIndex
CREATE INDEX "EducatorStudent_educatorId_idx" ON "EducatorStudent"("educatorId");

-- CreateIndex
CREATE INDEX "EducatorStudent_studentId_idx" ON "EducatorStudent"("studentId");

-- CreateIndex
CREATE INDEX "EducatorStudent_active_idx" ON "EducatorStudent"("active");

-- CreateIndex
CREATE UNIQUE INDEX "EducatorStudent_educatorId_studentId_key" ON "EducatorStudent"("educatorId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeschoolFamily_primaryParentId_key" ON "HomeschoolFamily"("primaryParentId");

-- CreateIndex
CREATE INDEX "HomeschoolFamily_primaryParentId_idx" ON "HomeschoolFamily"("primaryParentId");

-- CreateIndex
CREATE INDEX "HomeschoolFamily_subscriptionStatus_idx" ON "HomeschoolFamily"("subscriptionStatus");

-- CreateIndex
CREATE INDEX "WeeklySchedule_familyId_idx" ON "WeeklySchedule"("familyId");

-- CreateIndex
CREATE INDEX "WeeklySchedule_weekStart_idx" ON "WeeklySchedule"("weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySchedule_familyId_weekStart_key" ON "WeeklySchedule"("familyId", "weekStart");

-- CreateIndex
CREATE INDEX "CoOp_coordinatorId_idx" ON "CoOp"("coordinatorId");

-- CreateIndex
CREATE INDEX "CoOp_isPrivate_idx" ON "CoOp"("isPrivate");

-- CreateIndex
CREATE INDEX "CoOp_tags_idx" ON "CoOp"("tags");

-- CreateIndex
CREATE INDEX "CoOpMembership_coOpId_idx" ON "CoOpMembership"("coOpId");

-- CreateIndex
CREATE INDEX "CoOpMembership_familyId_idx" ON "CoOpMembership"("familyId");

-- CreateIndex
CREATE INDEX "CoOpMembership_status_idx" ON "CoOpMembership"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CoOpMembership_coOpId_familyId_key" ON "CoOpMembership"("coOpId", "familyId");

-- CreateIndex
CREATE INDEX "CoOpSession_coOpId_idx" ON "CoOpSession"("coOpId");

-- CreateIndex
CREATE INDEX "CoOpSession_sessionDate_idx" ON "CoOpSession"("sessionDate");

-- CreateIndex
CREATE INDEX "CoOpSession_status_idx" ON "CoOpSession"("status");

-- CreateIndex
CREATE INDEX "CoOpSession_hostId_idx" ON "CoOpSession"("hostId");

-- CreateIndex
CREATE INDEX "PortfolioItem_learnerId_idx" ON "PortfolioItem"("learnerId");

-- CreateIndex
CREATE INDEX "PortfolioItem_createdAt_idx" ON "PortfolioItem"("createdAt");

-- CreateIndex
CREATE INDEX "PortfolioItem_itemType_idx" ON "PortfolioItem"("itemType");

-- CreateIndex
CREATE INDEX "PortfolioItem_competencies_idx" ON "PortfolioItem"("competencies");

-- CreateIndex
CREATE INDEX "NIOSCompetency_studentId_idx" ON "NIOSCompetency"("studentId");

-- CreateIndex
CREATE INDEX "NIOSCompetency_masteryLevel_idx" ON "NIOSCompetency"("masteryLevel");

-- CreateIndex
CREATE INDEX "NIOSCompetency_subject_idx" ON "NIOSCompetency"("subject");

-- CreateIndex
CREATE UNIQUE INDEX "NIOSCompetency_studentId_competencyCode_subject_gradeLevel_key" ON "NIOSCompetency"("studentId", "competencyCode", "subject", "gradeLevel");

-- CreateIndex
CREATE INDEX "MessageThread_lastMessageAt_idx" ON "MessageThread"("lastMessageAt");

-- CreateIndex
CREATE INDEX "MessageThread_participants_idx" ON "MessageThread"("participants");

-- CreateIndex
CREATE INDEX "MessageThread_isArchived_idx" ON "MessageThread"("isArchived");

-- CreateIndex
CREATE INDEX "Message_threadId_idx" ON "Message"("threadId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_sentAt_idx" ON "Message"("sentAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");

-- CreateIndex
CREATE INDEX "AuditLog_severity_idx" ON "AuditLog"("severity");

-- CreateIndex
CREATE INDEX "ContentFlag_status_idx" ON "ContentFlag"("status");

-- CreateIndex
CREATE INDEX "ContentFlag_priority_idx" ON "ContentFlag"("priority");

-- CreateIndex
CREATE INDEX "ContentFlag_contentType_idx" ON "ContentFlag"("contentType");

-- CreateIndex
CREATE INDEX "ContentFlag_createdAt_idx" ON "ContentFlag"("createdAt");

-- CreateIndex
CREATE INDEX "ContentFlag_reviewedAt_idx" ON "ContentFlag"("reviewedAt");

-- CreateIndex
CREATE INDEX "CollaborationRoom_creatorId_idx" ON "CollaborationRoom"("creatorId");

-- CreateIndex
CREATE INDEX "CollaborationRoom_isActive_idx" ON "CollaborationRoom"("isActive");

-- CreateIndex
CREATE INDEX "CollaborationRoom_type_idx" ON "CollaborationRoom"("type");

-- CreateIndex
CREATE INDEX "Assessment_createdBy_idx" ON "Assessment"("createdBy");

-- CreateIndex
CREATE INDEX "Assessment_status_idx" ON "Assessment"("status");

-- CreateIndex
CREATE INDEX "Assessment_assessmentType_idx" ON "Assessment"("assessmentType");

-- CreateIndex
CREATE INDEX "AssessmentSubmission_learnerId_idx" ON "AssessmentSubmission"("learnerId");

-- CreateIndex
CREATE INDEX "AssessmentSubmission_submittedAt_idx" ON "AssessmentSubmission"("submittedAt");

-- CreateIndex
CREATE INDEX "AssessmentSubmission_status_idx" ON "AssessmentSubmission"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentSubmission_assessmentId_learnerId_attemptNumber_key" ON "AssessmentSubmission"("assessmentId", "learnerId", "attemptNumber");

-- CreateIndex
CREATE INDEX "SystemMetric_metricName_idx" ON "SystemMetric"("metricName");

-- CreateIndex
CREATE INDEX "SystemMetric_timestamp_idx" ON "SystemMetric"("timestamp");

-- CreateIndex
CREATE INDEX "SystemMetric_metricType_idx" ON "SystemMetric"("metricType");

-- AddForeignKey
ALTER TABLE "LearnerProfile" ADD CONSTRAINT "LearnerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressRecord" ADD CONSTRAINT "ProgressRecord_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentProfile" ADD CONSTRAINT "ParentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_childId_fkey" FOREIGN KEY ("childId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducatorProfile" ADD CONSTRAINT "EducatorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducatorStudent" ADD CONSTRAINT "EducatorStudent_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "EducatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducatorStudent" ADD CONSTRAINT "EducatorStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeschoolFamily" ADD CONSTRAINT "HomeschoolFamily_primaryParentId_fkey" FOREIGN KEY ("primaryParentId") REFERENCES "ParentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklySchedule" ADD CONSTRAINT "WeeklySchedule_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "HomeschoolFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoOpMembership" ADD CONSTRAINT "CoOpMembership_coOpId_fkey" FOREIGN KEY ("coOpId") REFERENCES "CoOp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoOpMembership" ADD CONSTRAINT "CoOpMembership_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "HomeschoolFamily"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoOpSession" ADD CONSTRAINT "CoOpSession_coOpId_fkey" FOREIGN KEY ("coOpId") REFERENCES "CoOp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NIOSCompetency" ADD CONSTRAINT "NIOSCompetency_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "MessageThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentFlag" ADD CONSTRAINT "ContentFlag_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentSubmission" ADD CONSTRAINT "AssessmentSubmission_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
