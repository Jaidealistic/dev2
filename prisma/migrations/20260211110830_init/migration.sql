/*
  Warnings:

  - You are about to drop the column `iconUrl` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Achievement` table. All the data in the column will be lost.
  - You are about to drop the column `assessmentType` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `attempts` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `isAdaptive` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `niosCompetencies` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `passingScore` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `rubric` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `timeLimit` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `totalPoints` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Assessment` table. All the data in the column will be lost.
  - You are about to drop the column `attemptNumber` on the `AssessmentSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `AssessmentSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `gradedAt` on the `AssessmentSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `gradedBy` on the `AssessmentSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `AssessmentSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `timeSpent` on the `AssessmentSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `entityId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `entityType` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `newValue` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `oldValue` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `severity` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `CoOp` table. All the data in the column will be lost.
  - You are about to drop the column `coordinatorId` on the `CoOp` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `CoOp` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `CoOp` table. All the data in the column will be lost.
  - You are about to drop the column `maxMembers` on the `CoOp` table. All the data in the column will be lost.
  - You are about to drop the column `meetingDay` on the `CoOp` table. All the data in the column will be lost.
  - You are about to drop the column `meetingTime` on the `CoOp` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `CoOp` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CoOp` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `hostId` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `maxParticipants` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `meetingLink` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `participants` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `recordingUrl` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `resources` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `CoOpSession` table. All the data in the column will be lost.
  - You are about to drop the column `action` on the `ContentFlag` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `ContentFlag` table. All the data in the column will be lost.
  - You are about to drop the column `contentType` on the `ContentFlag` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ContentFlag` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `ContentFlag` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `ContentFlag` table. All the data in the column will be lost.
  - You are about to drop the column `resolution` on the `ContentFlag` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedAt` on the `ContentFlag` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedBy` on the `ContentFlag` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ContentFlag` table. All the data in the column will be lost.
  - You are about to drop the column `createdContent` on the `EducatorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `EducatorProfile` table. All the data in the column will be lost.
  - The `specialization` column on the `EducatorProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `assignedBy` on the `EducatorStudent` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionTier` on the `HomeschoolFamily` table. All the data in the column will be lost.
  - You are about to drop the column `accessibilityPrefs` on the `LearnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `LearnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `LearnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `LearnerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `attachments` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `editedAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `isSystem` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `readBy` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `context` on the `MessageThread` table. All the data in the column will be lost.
  - You are about to drop the column `contextId` on the `MessageThread` table. All the data in the column will be lost.
  - You are about to drop the column `isArchived` on the `MessageThread` table. All the data in the column will be lost.
  - You are about to drop the column `participantRoles` on the `MessageThread` table. All the data in the column will be lost.
  - You are about to drop the column `participants` on the `MessageThread` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `MessageThread` table. All the data in the column will be lost.
  - You are about to drop the column `assessmentData` on the `NIOSCompetency` table. All the data in the column will be lost.
  - You are about to drop the column `dateAchieved` on the `NIOSCompetency` table. All the data in the column will be lost.
  - You are about to drop the column `dateStarted` on the `NIOSCompetency` table. All the data in the column will be lost.
  - You are about to drop the column `evidenceLinks` on the `NIOSCompetency` table. All the data in the column will be lost.
  - You are about to drop the column `gradeLevel` on the `NIOSCompetency` table. All the data in the column will be lost.
  - You are about to drop the column `lastReviewed` on the `NIOSCompetency` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `NIOSCompetency` table. All the data in the column will be lost.
  - You are about to drop the column `reviewedBy` on the `NIOSCompetency` table. All the data in the column will be lost.
  - The `masteryLevel` column on the `NIOSCompetency` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `fullName` on the `ParentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `ParentProfile` table. All the data in the column will be lost.
  - You are about to drop the column `educatorNotes` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `fileSize` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `parentNotes` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `attemptsCount` on the `ProgressRecord` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `ProgressRecord` table. All the data in the column will be lost.
  - You are about to drop the column `responses` on the `ProgressRecord` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `CollaborationRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SystemMetric` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `CoOp` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId]` on the table `LearnerProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,competencyCode]` on the table `NIOSCompetency` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `badgeId` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `badgeName` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ParentProfile` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `itemType` on the `PortfolioItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('LEARNER', 'PARENT', 'EDUCATOR', 'PARENT_EDUCATOR', 'ADMIN', 'SPEECH_THERAPIST');

-- CreateEnum
CREATE TYPE "ProficiencyLevel" AS ENUM ('BEGINNER', 'ELEMENTARY', 'INTERMEDIATE', 'UPPER_INTERMEDIATE', 'ADVANCED', 'MASTERY', 'NOVICE', 'PROFICIENT');

-- DropForeignKey
ALTER TABLE "FamilyMember" DROP CONSTRAINT "FamilyMember_childId_fkey";

-- DropIndex
DROP INDEX "Assessment_assessmentType_idx";

-- DropIndex
DROP INDEX "Assessment_createdBy_idx";

-- DropIndex
DROP INDEX "Assessment_status_idx";

-- DropIndex
DROP INDEX "AssessmentSubmission_assessmentId_learnerId_attemptNumber_key";

-- DropIndex
DROP INDEX "AssessmentSubmission_status_idx";

-- DropIndex
DROP INDEX "AssessmentSubmission_submittedAt_idx";

-- DropIndex
DROP INDEX "AuditLog_action_idx";

-- DropIndex
DROP INDEX "AuditLog_entityType_idx";

-- DropIndex
DROP INDEX "AuditLog_severity_idx";

-- DropIndex
DROP INDEX "AuditLog_timestamp_idx";

-- DropIndex
DROP INDEX "AuditLog_userId_idx";

-- DropIndex
DROP INDEX "CoOp_coordinatorId_idx";

-- DropIndex
DROP INDEX "CoOp_isPrivate_idx";

-- DropIndex
DROP INDEX "CoOp_tags_idx";

-- DropIndex
DROP INDEX "CoOpMembership_coOpId_idx";

-- DropIndex
DROP INDEX "CoOpMembership_familyId_idx";

-- DropIndex
DROP INDEX "CoOpMembership_status_idx";

-- DropIndex
DROP INDEX "CoOpSession_coOpId_idx";

-- DropIndex
DROP INDEX "CoOpSession_hostId_idx";

-- DropIndex
DROP INDEX "CoOpSession_sessionDate_idx";

-- DropIndex
DROP INDEX "CoOpSession_status_idx";

-- DropIndex
DROP INDEX "ContentFlag_contentType_idx";

-- DropIndex
DROP INDEX "ContentFlag_createdAt_idx";

-- DropIndex
DROP INDEX "ContentFlag_priority_idx";

-- DropIndex
DROP INDEX "ContentFlag_reviewedAt_idx";

-- DropIndex
DROP INDEX "ContentFlag_status_idx";

-- DropIndex
DROP INDEX "EducatorProfile_specialization_idx";

-- DropIndex
DROP INDEX "EducatorStudent_active_idx";

-- DropIndex
DROP INDEX "HomeschoolFamily_subscriptionStatus_idx";

-- DropIndex
DROP INDEX "Message_senderId_idx";

-- DropIndex
DROP INDEX "Message_sentAt_idx";

-- DropIndex
DROP INDEX "MessageThread_isArchived_idx";

-- DropIndex
DROP INDEX "MessageThread_lastMessageAt_idx";

-- DropIndex
DROP INDEX "MessageThread_participants_idx";

-- DropIndex
DROP INDEX "NIOSCompetency_masteryLevel_idx";

-- DropIndex
DROP INDEX "NIOSCompetency_studentId_competencyCode_subject_gradeLevel_key";

-- DropIndex
DROP INDEX "NIOSCompetency_studentId_idx";

-- DropIndex
DROP INDEX "NIOSCompetency_subject_idx";

-- DropIndex
DROP INDEX "PortfolioItem_competencies_idx";

-- DropIndex
DROP INDEX "PortfolioItem_createdAt_idx";

-- DropIndex
DROP INDEX "PortfolioItem_itemType_idx";

-- DropIndex
DROP INDEX "ProgressRecord_completedAt_idx";

-- DropIndex
DROP INDEX "ProgressRecord_learnerId_lessonId_idx";

-- DropIndex
DROP INDEX "WeeklySchedule_familyId_idx";

-- DropIndex
DROP INDEX "WeeklySchedule_weekStart_idx";

-- AlterTable
ALTER TABLE "Achievement" DROP COLUMN "iconUrl",
DROP COLUMN "title",
DROP COLUMN "type",
ADD COLUMN     "badgeId" TEXT NOT NULL,
ADD COLUMN     "badgeName" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Assessment" DROP COLUMN "assessmentType",
DROP COLUMN "attempts",
DROP COLUMN "description",
DROP COLUMN "isAdaptive",
DROP COLUMN "lessonId",
DROP COLUMN "niosCompetencies",
DROP COLUMN "passingScore",
DROP COLUMN "rubric",
DROP COLUMN "status",
DROP COLUMN "tags",
DROP COLUMN "timeLimit",
DROP COLUMN "totalPoints",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "AssessmentSubmission" DROP COLUMN "attemptNumber",
DROP COLUMN "feedback",
DROP COLUMN "gradedAt",
DROP COLUMN "gradedBy",
DROP COLUMN "status",
DROP COLUMN "timeSpent";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "entityId",
DROP COLUMN "entityType",
DROP COLUMN "ipAddress",
DROP COLUMN "location",
DROP COLUMN "metadata",
DROP COLUMN "newValue",
DROP COLUMN "oldValue",
DROP COLUMN "severity",
DROP COLUMN "userAgent";

-- AlterTable
ALTER TABLE "CoOp" DROP COLUMN "avatarUrl",
DROP COLUMN "coordinatorId",
DROP COLUMN "description",
DROP COLUMN "location",
DROP COLUMN "maxMembers",
DROP COLUMN "meetingDay",
DROP COLUMN "meetingTime",
DROP COLUMN "tags",
DROP COLUMN "updatedAt",
ADD COLUMN     "code" TEXT;

-- AlterTable
ALTER TABLE "CoOpSession" DROP COLUMN "description",
DROP COLUMN "duration",
DROP COLUMN "endTime",
DROP COLUMN "hostId",
DROP COLUMN "lessonId",
DROP COLUMN "maxParticipants",
DROP COLUMN "meetingLink",
DROP COLUMN "notes",
DROP COLUMN "participants",
DROP COLUMN "recordingUrl",
DROP COLUMN "resources",
DROP COLUMN "startTime",
DROP COLUMN "topic",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "ContentFlag" DROP COLUMN "action",
DROP COLUMN "contentId",
DROP COLUMN "contentType",
DROP COLUMN "description",
DROP COLUMN "notes",
DROP COLUMN "priority",
DROP COLUMN "resolution",
DROP COLUMN "reviewedAt",
DROP COLUMN "reviewedBy",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "EducatorProfile" DROP COLUMN "createdContent",
DROP COLUMN "timezone",
ADD COLUMN     "createdLessonIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "fullName" DROP NOT NULL,
ALTER COLUMN "qualifications" DROP NOT NULL,
DROP COLUMN "specialization",
ADD COLUMN     "specialization" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "EducatorStudent" DROP COLUMN "assignedBy",
ADD COLUMN     "studentUserId" TEXT,
ALTER COLUMN "permissions" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "FamilyMember" ADD COLUMN     "learnerProfileId" TEXT,
ADD COLUMN     "relationship" TEXT,
ALTER COLUMN "permissions" SET DEFAULT '{}';

-- AlterTable
ALTER TABLE "HomeschoolFamily" DROP COLUMN "subscriptionTier";

-- AlterTable
ALTER TABLE "LearnerProfile" DROP COLUMN "accessibilityPrefs",
DROP COLUMN "age",
DROP COLUMN "fullName",
DROP COLUMN "timezone",
ADD COLUMN     "accommodations" JSONB,
ADD COLUMN     "colorScheme" TEXT NOT NULL DEFAULT 'light',
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "disabilityTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "enableSpeechRec" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "fontFamily" TEXT NOT NULL DEFAULT 'system',
ADD COLUMN     "fontSize" INTEGER NOT NULL DEFAULT 16,
ADD COLUMN     "grade" TEXT,
ADD COLUMN     "iepGoals" TEXT,
ADD COLUMN     "lineSpacing" DOUBLE PRECISION NOT NULL DEFAULT 1.5,
ADD COLUMN     "nativeLanguage" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "proficiencyLevel" "ProficiencyLevel" NOT NULL DEFAULT 'BEGINNER',
ADD COLUMN     "school" TEXT,
ADD COLUMN     "studentId" TEXT,
ALTER COLUMN "learningLanguage" DROP NOT NULL,
ALTER COLUMN "disabilities" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "attachments",
DROP COLUMN "editedAt",
DROP COLUMN "isSystem",
DROP COLUMN "metadata",
DROP COLUMN "readAt",
DROP COLUMN "readBy",
DROP COLUMN "sentAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MessageThread" DROP COLUMN "context",
DROP COLUMN "contextId",
DROP COLUMN "isArchived",
DROP COLUMN "participantRoles",
DROP COLUMN "participants",
DROP COLUMN "subject",
ADD COLUMN     "participantIds" TEXT[];

-- AlterTable
ALTER TABLE "NIOSCompetency" DROP COLUMN "assessmentData",
DROP COLUMN "dateAchieved",
DROP COLUMN "dateStarted",
DROP COLUMN "evidenceLinks",
DROP COLUMN "gradeLevel",
DROP COLUMN "lastReviewed",
DROP COLUMN "notes",
DROP COLUMN "reviewedBy",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "description" DROP NOT NULL,
DROP COLUMN "masteryLevel",
ADD COLUMN     "masteryLevel" TEXT NOT NULL DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "ParentProfile" DROP COLUMN "fullName",
DROP COLUMN "phoneNumber",
ADD COLUMN     "notificationFrequency" TEXT NOT NULL DEFAULT 'weekly',
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'PARENT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "relationship" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PortfolioItem" DROP COLUMN "educatorNotes",
DROP COLUMN "fileName",
DROP COLUMN "fileSize",
DROP COLUMN "lessonId",
DROP COLUMN "mimeType",
DROP COLUMN "parentNotes",
DROP COLUMN "itemType",
ADD COLUMN     "itemType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProgressRecord" DROP COLUMN "attemptsCount",
DROP COLUMN "completedAt",
DROP COLUMN "responses",
ADD COLUMN     "competencyId" TEXT,
ALTER COLUMN "lessonId" DROP NOT NULL,
ALTER COLUMN "timeSpentSec" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordHash",
ADD COLUMN     "accessibilityPrefs" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "pattern" TEXT,
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'light',
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'LEARNER';

-- DropTable
DROP TABLE "CollaborationRoom";

-- DropTable
DROP TABLE "SystemMetric";

-- DropEnum
DROP TYPE "MasteryLevel";

-- DropEnum
DROP TYPE "PortfolioItemType";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "educatorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contentId" TEXT,
    "creatorId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL DEFAULT 'en',
    "gradeLevel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

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

    CONSTRAINT "LessonStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "completedAt" TIMESTAMP(3),
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentResponse" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "score" INTEGER,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonLog" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkSample" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "lessonLogId" TEXT,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkSample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "present" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeachingNote" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeachingNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentCourseProgress" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParentCourseProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumPost" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForumReply" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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

-- CreateTable
CREATE TABLE "OfficeHourRegistration" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "officeHourId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfficeHourRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_code_key" ON "Classroom"("code");

-- CreateIndex
CREATE INDEX "Classroom_educatorId_idx" ON "Classroom"("educatorId");

-- CreateIndex
CREATE INDEX "Lesson_creatorId_idx" ON "Lesson"("creatorId");

-- CreateIndex
CREATE INDEX "LessonStep_lessonId_idx" ON "LessonStep"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_learnerId_lessonId_key" ON "LessonProgress"("learnerId", "lessonId");

-- CreateIndex
CREATE INDEX "AssessmentResponse_learnerId_idx" ON "AssessmentResponse"("learnerId");

-- CreateIndex
CREATE INDEX "LessonLog_learnerId_idx" ON "LessonLog"("learnerId");

-- CreateIndex
CREATE INDEX "WorkSample_learnerId_idx" ON "WorkSample"("learnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_learnerId_date_key" ON "Attendance"("learnerId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ForumLike_postId_userId_key" ON "ForumLike"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "CoOp_code_key" ON "CoOp"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LearnerProfile_studentId_key" ON "LearnerProfile"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "NIOSCompetency_studentId_competencyCode_key" ON "NIOSCompetency"("studentId", "competencyCode");

-- CreateIndex
CREATE INDEX "ProgressRecord_learnerId_idx" ON "ProgressRecord"("learnerId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_learnerProfileId_fkey" FOREIGN KEY ("learnerProfileId") REFERENCES "LearnerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducatorStudent" ADD CONSTRAINT "EducatorStudent_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_educatorId_fkey" FOREIGN KEY ("educatorId") REFERENCES "EducatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonStep" ADD CONSTRAINT "LessonStep_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentSubmission" ADD CONSTRAINT "AssessmentSubmission_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResponse" ADD CONSTRAINT "AssessmentResponse_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonLog" ADD CONSTRAINT "LessonLog_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSample" ADD CONSTRAINT "WorkSample_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSample" ADD CONSTRAINT "WorkSample_lessonLogId_fkey" FOREIGN KEY ("lessonLogId") REFERENCES "LessonLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "LearnerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeachingNote" ADD CONSTRAINT "TeachingNote_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentCourseProgress" ADD CONSTRAINT "ParentCourseProgress_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumPost" ADD CONSTRAINT "ForumPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "ParentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumReply" ADD CONSTRAINT "ForumReply_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumLike" ADD CONSTRAINT "ForumLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ForumPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfficeHourRegistration" ADD CONSTRAINT "OfficeHourRegistration_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
