import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding PostgreSQL database...');

  // Clear existing data in correct order (respecting foreign key constraints)
  console.log('🗑️ Clearing existing data...');

  // 1. Level 3+ (Deepest children)
  await prisma.attendance.deleteMany();
  await prisma.assessmentResponse.deleteMany();
  await prisma.assessmentSubmission.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.workSample.deleteMany();
  await prisma.lessonLog.deleteMany();
  await prisma.nIOSCompetency.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.progressRecord.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.forumLike.deleteMany();
  await prisma.forumReply.deleteMany();
  await prisma.coOpSession.deleteMany();
  await prisma.weeklySchedule.deleteMany();

  // 2. Level 2 (Intermediate tables & Link tables)
  await prisma.educatorStudent.deleteMany();
  await prisma.familyMember.deleteMany();
  await prisma.coOpMembership.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.officeHourRegistration.deleteMany();
  await prisma.parentCourseProgress.deleteMany();
  await prisma.teachingNote.deleteMany();
  await prisma.classroom.deleteMany();
  await prisma.lessonStep.deleteMany();
  await prisma.message.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.contentFlag.deleteMany();

  // 3. Level 1 (Profiles and Parent tables)
  await prisma.coOp.deleteMany();
  await prisma.homeschoolFamily.deleteMany();
  await prisma.messageThread.deleteMany();
  await prisma.educatorProfile.deleteMany();
  await prisma.parentProfile.deleteMany();
  await prisma.learnerProfile.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.assessment.deleteMany();

  // 4. Level 0 (Final parents)
  await prisma.user.deleteMany();

  console.log('✅ Cleared all existing data');

  // Create Educator with profile
  const educatorPassword = await bcrypt.hash('educator123', 12);
  const educator = await prisma.user.create({
    data: {
      email: 'educator@linguaaccess.com',
      password: educatorPassword,
      firstName: 'Priya',
      lastName: 'Sharma',
      role: 'EDUCATOR',
      emailVerified: true,
      educatorProfile: {
        create: {
          qualifications: 'MA in Special Education, SLP',
          specialization: ['Speech-Language Pathologist'],
          institution: 'Chennai Special Needs Center',
          yearsExperience: 8,
          createdLessonIds: [],
        },
      },
    },
    include: {
      educatorProfile: true,
    },
  });

  console.log('✅ Created educator:', educator.email);

  // Create Learner with profile
  const learnerPassword = await bcrypt.hash('learner123', 12);
  const learner = await prisma.user.create({
    data: {
      email: 'learner@linguaaccess.com',
      password: learnerPassword,
      firstName: 'Aarav',
      lastName: 'Kumar',
      role: 'LEARNER',
      emailVerified: true,
      learnerProfile: {
        create: {
          primaryLanguage: 'TAMIL',
          learningLanguage: 'ENGLISH',
          disabilityTypes: ['dyslexia', 'adhd'],
          fontFamily: 'opendyslexic',
          colorScheme: 'light',
          fontSize: 18,
          lineSpacing: 1.5,
          enableSpeechRec: true,
        },
      },
    },
    include: {
      learnerProfile: true,
    },
  });

  console.log('✅ Created learner:', learner.email);

  // Create second learner for homeschool family
  const learner2Password = await bcrypt.hash('learner2', 12);
  const learner2 = await prisma.user.create({
    data: {
      email: 'learner2@linguaaccess.com',
      password: learner2Password,
      firstName: 'Meera',
      lastName: 'Kumar',
      role: 'LEARNER',
      emailVerified: true,
      learnerProfile: {
        create: {
          primaryLanguage: 'TAMIL',
          learningLanguage: 'ENGLISH',
          disabilityTypes: ['autism'],
          fontFamily: 'lexend',
          colorScheme: 'light',
          fontSize: 16,
          lineSpacing: 1.5,
          enableSpeechRec: true,
        },
      },
    },
    include: {
      learnerProfile: true,
    },
  });

  console.log('✅ Created second learner:', learner2.email);

  // Create Parent with profile
  const parentPassword = await bcrypt.hash('parent123', 12);
  const parent = await prisma.user.create({
    data: {
      email: 'parent@linguaaccess.com',
      password: parentPassword,
      firstName: 'Kavita',
      lastName: 'Patel',
      role: 'PARENT',
      emailVerified: true,
      parentProfile: {
        create: {
          relationship: 'mother',
        },
      },
    },
    include: {
      parentProfile: true,
    },
  });

  console.log('✅ Created parent:', parent.email);

  // Create Homeschool Parent-Educator with profile
  const homeschoolPassword = await bcrypt.hash('homeschool123', 12);
  const homeschoolParent = await prisma.user.create({
    data: {
      email: 'homeschool@linguaaccess.com',
      password: homeschoolPassword,
      firstName: 'Rajesh',
      lastName: 'Kumar',
      role: 'PARENT_EDUCATOR',
      emailVerified: true,
      parentProfile: {
        create: {
          relationship: 'father',
          homeschoolFamily: {
            create: {
              familyName: 'Kumar Family',
            },
          },
        },
      },
    },
    include: {
      parentProfile: {
        include: {
          homeschoolFamily: true,
        },
      },
    },
  });

  console.log('✅ Created homeschool parent:', homeschoolParent.email);

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@linguaaccess.com',
      password: adminPassword,
      firstName: 'System',
      lastName: 'Admin',
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  console.log('✅ Created admin:', admin.email);

  // Link educator to learner
  if (educator.educatorProfile && learner.learnerProfile) {
    await prisma.educatorStudent.create({
      data: {
        educatorId: educator.educatorProfile.id,
        studentId: learner.learnerProfile.id,
        permissions: {
          canEdit: true,
          canAssess: true,
          canMessage: true,
        },
        active: true,
      },
    });

    console.log('✅ Linked educator to learner');
  }

  // Link parent to learner
  if (parent.parentProfile && learner.learnerProfile) {
    await prisma.familyMember.create({
      data: {
        parentId: parent.parentProfile.id,
        childId: learner.id,
        learnerProfileId: learner.learnerProfile.id,
        permissions: {
          canViewProgress: true,
          canMessage: true,
        },
      },
    });

    console.log('✅ Linked parent to learner');
  }

  // Link homeschool parent to both children
  if (homeschoolParent.parentProfile && learner.learnerProfile && learner2.learnerProfile) {
    await prisma.familyMember.create({
      data: {
        parentId: homeschoolParent.parentProfile.id,
        childId: learner.id,
        learnerProfileId: learner.learnerProfile.id,
        permissions: {
          canViewProgress: true,
          canMessage: true,
          canEdit: true,
        },
      },
    });

    await prisma.familyMember.create({
      data: {
        parentId: homeschoolParent.parentProfile.id,
        childId: learner2.id,
        learnerProfileId: learner2.learnerProfile.id,
        permissions: {
          canViewProgress: true,
          canMessage: true,
          canEdit: true,
        },
      },
    });

    console.log('✅ Linked homeschool parent to both children');
  }

  // Create sample Co-op
  if (homeschoolParent.parentProfile?.homeschoolFamily) {
    const coOp = await prisma.coOp.create({
      data: {
        name: 'Chennai Tamil Learners Co-op',
        isPrivate: true,
      },
    });

    await prisma.coOpMembership.create({
      data: {
        coOpId: coOp.id,
        familyId: homeschoolParent.parentProfile.homeschoolFamily.id,
        role: 'coordinator',
        status: 'active',
      },
    });

    // Create a sample co-op session
    await prisma.coOpSession.create({
      data: {
        coOpId: coOp.id,
        title: 'Introduction to Tamil Greetings',
        sessionDate: new Date('2026-02-14T10:00:00Z'),
        status: 'scheduled',
      },
    });

    console.log('✅ Created sample co-op and session');
  }

  // Create sample progress records
  if (learner.learnerProfile) {
    await prisma.progressRecord.createMany({
      data: [
        {
          learnerId: learner.learnerProfile.id,
          lessonId: 'lesson_001',
          score: 85,
          timeSpentSec: 1200,
        },
        {
          learnerId: learner.learnerProfile.id,
          lessonId: 'lesson_002',
          score: 92,
          timeSpentSec: 1350,
        },
        {
          learnerId: learner.learnerProfile.id,
          lessonId: 'lesson_003',
          score: null,
          timeSpentSec: 600,
        },
      ],
    });

    console.log('✅ Created sample progress records');

    // Create sample achievements
    await prisma.achievement.createMany({
      data: [
        {
          learnerId: learner.learnerProfile.id,
          badgeId: 'first_lesson',
          badgeName: 'First Steps',
          description: 'Completed your first lesson!',
        },
        {
          learnerId: learner.learnerProfile.id,
          badgeId: 'streak_3_days',
          badgeName: '3 Day Streak',
          description: 'Learned for 3 days in a row!',
        },
      ],
    });

    console.log('✅ Created sample achievements');

    // Create sample NIOS competencies
    await prisma.nIOSCompetency.createMany({
      data: [
        {
          studentId: learner.learnerProfile.id,
          competencyCode: 'L&S1',
          subject: 'English',
          description: 'Listening and Speaking - Basic greetings',
          masteryLevel: 'PROFICIENT',
        },
        {
          studentId: learner.learnerProfile.id,
          competencyCode: 'R1',
          subject: 'English',
          description: 'Reading - Decode simple words',
          masteryLevel: 'DEVELOPING',
        },
        {
          studentId: learner.learnerProfile.id,
          competencyCode: 'W1',
          subject: 'English',
          description: 'Writing - Form letters correctly',
          masteryLevel: 'EMERGING',
        },
      ],
    });

    console.log('✅ Created sample NIOS competencies');

    // Create sample portfolio items
    await prisma.portfolioItem.createMany({
      data: [
        {
          learnerId: learner.learnerProfile.id,
          itemType: 'LESSON_LOG',
          title: 'Completed Greetings Lesson',
          description: 'Successfully completed the greetings and introductions lesson',
          competencies: ['L&S1', 'L&S2'],
          tags: ['greetings', 'speaking'],
        },
        {
          learnerId: learner.learnerProfile.id,
          itemType: 'WORK_SAMPLE',
          title: 'Pronunciation Practice Recording',
          description: 'Audio recording of greeting pronunciations',
          fileUrl: '/portfolio/audio/greeting-practice.mp3',
          competencies: ['L&S1'],
          tags: ['pronunciation', 'audio'],
        },
      ],
    });

    console.log('✅ Created sample portfolio items');
  }

  // Create sample message thread
  if (educator.educatorProfile && parent.parentProfile) {
    const messageThread = await prisma.messageThread.create({
      data: {
        participantIds: [educator.id, parent.id],
      },
    });

    await prisma.message.createMany({
      data: [
        {
          threadId: messageThread.id,
          senderId: educator.id,
          content:
            "Hello Kavita! I wanted to update you on Aarav's progress. He's doing wonderfully with his pronunciation practice!",
        },
        {
          threadId: messageThread.id,
          senderId: parent.id,
          content:
            "Thank you so much, Dr. Sharma! I've noticed he's more confident speaking at home too.",
        },
      ],
    });

    console.log('✅ Created sample message thread');
  }

  console.log('\n🎉 Database seeding complete!');
  console.log('\n📧 Login Credentials:');
  console.log('━'.repeat(50));
  console.log('Educator:   educator@linguaaccess.com / educator123');
  console.log('Learner:    learner@linguaaccess.com / learner123');
  console.log('Parent:     parent@linguaaccess.com / parent123');
  console.log('Homeschool: homeschool@linguaaccess.com / homeschool123');
  console.log('Admin:      admin@linguaaccess.com / admin123');
  console.log('━'.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });