/**
 * DATABASE SEED SCRIPT
 * 
 * Populates the database with sample lessons and content
 * for testing and demonstration purposes.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Sample lessons
  const lessons = [
    {
      title: 'Basic Greetings',
      description: 'Learn how to greet people in Spanish with common phrases',
      language: 'es',
      gradeLevel: 'Beginner',
      duration: 15,
      competencies: ['Speaking', 'Listening', 'Pronunciation'],
      learningObjectives: [
        'Say hello and goodbye in Spanish',
        'Ask "How are you?" and respond',
        'Use appropriate greetings for different times of day',
      ],
      creatorId: 'system',
      isPublished: true,
      multiModalContent: true,
      hasTranscripts: true,
      hasCaptions: true,
      hasAltText: true,
    },
    {
      title: 'Numbers 1-20',
      description: 'Master counting from 1 to 20 in Spanish',
      language: 'es',
      gradeLevel: 'Beginner',
      duration: 20,
      competencies: ['Vocabulary', 'Pronunciation', 'Listening'],
      learningObjectives: [
        'Count from 1 to 20 in Spanish',
        'Recognize written numbers',
        'Use numbers in basic conversations',
      ],
      creatorId: 'system',
      isPublished: true,
      multiModalContent: true,
      hasTranscripts: true,
      hasCaptions: true,
      hasAltText: true,
    },
    {
      title: 'Family Members',
      description: 'Learn vocabulary for talking about your family',
      language: 'es',
      gradeLevel: 'Beginner',
      duration: 18,
      competencies: ['Vocabulary', 'Speaking', 'Cultural Context'],
      learningObjectives: [
        'Name immediate family members in Spanish',
        'Describe family relationships',
        'Talk about your own family',
      ],
      creatorId: 'system',
      isPublished: true,
      multiModalContent: true,
      hasTranscripts: true,
      hasCaptions: true,
      hasAltText: true,
    },
    {
      title: 'Colors and Shapes',
      description: 'Identify and describe colors and basic shapes',
      language: 'es',
      gradeLevel: 'Beginner',
      duration: 15,
      competencies: ['Vocabulary', 'Visual Recognition'],
      learningObjectives: [
        'Name common colors in Spanish',
        'Identify basic shapes',
        'Describe objects using colors',
      ],
      creatorId: 'system',
      isPublished: true,
      multiModalContent: true,
      hasTranscripts: true,
      hasCaptions: true,
      hasAltText: true,
    },
    {
      title: 'Days of the Week',
      description: 'Learn the days of the week and talk about schedules',
      language: 'es',
      gradeLevel: 'Beginner',
      duration: 12,
      competencies: ['Vocabulary', 'Time Concepts'],
      learningObjectives: [
        'Say all seven days of the week',
        'Ask and answer "What day is it?"',
        'Talk about your weekly schedule',
      ],
      creatorId: 'system',
      isPublished: true,
      multiModalContent: true,
      hasTranscripts: true,
      hasCaptions: true,
      hasAltText: true,
    },
    {
      title: 'Introduction to Hindi Script',
      description: 'Learn the basics of Devanagari script',
      language: 'hi',
      gradeLevel: 'Beginner',
      duration: 25,
      competencies: ['Reading', 'Writing', 'Script Recognition'],
      learningObjectives: [
        'Recognize Devanagari vowels',
        'Understand basic script structure',
        'Write simple Hindi letters',
      ],
      creatorId: 'system',
      isPublished: true,
      multiModalContent: true,
      hasTranscripts: true,
      hasCaptions: true,
      hasAltText: true,
    },
    {
      title: 'Common Hindi Phrases',
      description: 'Essential phrases for daily conversation',
      language: 'hi',
      gradeLevel: 'Beginner',
      duration: 20,
      competencies: ['Speaking', 'Listening', 'Cultural Context'],
      learningObjectives: [
        'Use basic Hindi greetings',
        'Ask for common items',
        'Express gratitude and politeness',
      ],
      creatorId: 'system',
      isPublished: true,
      multiModalContent: true,
      hasTranscripts: true,
      hasCaptions: true,
      hasAltText: true,
    },
    {
      title: 'English Vowel Sounds',
      description: 'Master the different vowel sounds in English',
      language: 'en',
      gradeLevel: 'Elementary',
      duration: 22,
      competencies: ['Pronunciation', 'Phonics', 'Listening'],
      learningObjectives: [
        'Distinguish between short and long vowels',
        'Practice vowel pronunciation',
        'Recognize vowel patterns in words',
      ],
      creatorId: 'system',
      isPublished: true,
      multiModalContent: true,
      hasTranscripts: true,
      hasCaptions: true,
      hasAltText: true,
    },
    {
      title: 'Basic Sentence Structure',
      description: 'Learn how to construct simple English sentences',
      language: 'en',
      gradeLevel: 'Elementary',
      duration: 25,
      competencies: ['Grammar', 'Writing', 'Sentence Construction'],
      learningObjectives: [
        'Identify subject, verb, and object',
        'Write complete sentences',
        'Use proper capitalization and punctuation',
      ],
      creatorId: 'system',
      isPublished: true,
      multiModalContent: true,
      hasTranscripts: true,
      hasCaptions: true,
      hasAltText: true,
    },
    {
      title: 'Question Words',
      description: 'Learn to ask questions using who, what, where, when, why, how',
      language: 'en',
      gradeLevel: 'Elementary',
      duration: 18,
      competencies: ['Grammar', 'Speaking', 'Comprehension'],
      learningObjectives: [
        'Use question words correctly',
        'Form proper questions',
        'Respond to different types of questions',
      ],
      creatorId: 'system',
      isPublished: true,
      multiModalContent: true,
      hasTranscripts: true,
      hasCaptions: true,
      hasAltText: true,
    },
  ];

  console.log('Creating lessons...');
  for (const lesson of lessons) {
    const created = await prisma.lesson.create({
      data: lesson,
    });
    console.log(`✓ Created lesson: ${created.title}`);
  }

  console.log('\n✨ Database seeding completed!');
  console.log(`Total lessons created: ${lessons.length}`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
