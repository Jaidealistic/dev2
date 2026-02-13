/**
 * ASSESSMENT ROUTES
 * 
 * API endpoints for placement assessment and learning path generation:
 * - POST /api/assessment/placement - Get placement level assessment
 * - GET /api/assessment/questions - Get assessment questions
 * - POST /api/assessment/submit - Submit answers and get results
 * - POST /api/assessment/generate-path - Generate personalized learning path
 */

import express, { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { prisma } from '../db';

const router = Router();

// Assessment questions (starter level - can be expanded)
const assessmentQuestions = [
  {
    id: 'q1',
    type: 'multiple-choice',
    question: 'What is your confidence level with the language you want to learn?',
    options: [
      { id: 'o1', text: 'Complete beginner - I know almost nothing' },
      { id: 'o2', text: 'Basic - I know a few words and phrases' },
      { id: 'o3', text: 'Intermediate - I can hold simple conversations' },
      { id: 'o4', text: 'Advanced - I can understand complex topics' },
    ],
    difficulty: 'beginner',
  },
  {
    id: 'q2',
    type: 'multiple-choice',
    question: 'How many hours per week can you dedicate to learning?',
    options: [
      { id: 'o1', text: '1-2 hours' },
      { id: 'o2', text: '3-5 hours' },
      { id: 'o3', text: '5-10 hours' },
      { id: 'o4', text: '10+ hours' },
    ],
    difficulty: 'beginner',
  },
  {
    id: 'q3',
    type: 'multiple-choice',
    question: 'What is your primary learning goal?',
    options: [
      { id: 'o1', text: 'Just for fun and personal interest' },
      { id: 'o2', text: 'Improve grades in school' },
      { id: 'o3', text: 'Prepare for an exam' },
      { id: 'o4', text: 'Career advancement' },
    ],
    difficulty: 'beginner',
  },
  {
    id: 'q4',
    type: 'multiple-choice',
    question: 'How do you learn best?',
    options: [
      { id: 'o1', text: 'Listening to audio and watching videos' },
      { id: 'o2', text: 'Reading and writing' },
      { id: 'o3', text: 'Speaking and interacting' },
      { id: 'o4', text: 'A mix of everything' },
    ],
    difficulty: 'beginner',
  },
];

// ROUTE: Get Placement Assessment Questions
router.get('/questions', authMiddleware, async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      questions: assessmentQuestions,
      totalQuestions: assessmentQuestions.length,
      estimatedTime: 10, // minutes
    });
  } catch (error) {
    console.error('Error fetching assessment questions:', error);
    res.status(500).json({ error: 'Failed to fetch assessment questions' });
  }
});

// ROUTE: Submit Assessment Answers
router.post('/submit', authMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('✅ Assessment submission request received');
    console.log('✅ User ID from token:', req.user?.id);
    console.log('✅ Request body:', JSON.stringify(req.body, null, 2));
    
    const { answers } = req.body;
    const userId = req.user?.id;

    if (!userId || !answers || typeof answers !== 'object') {
      console.error('❌ Invalid assessment data:', { userId, answers: typeof answers });
      return res.status(400).json({ error: 'Invalid assessment data' });
    }

    // Calculate assessment score and determine level
    let levelScore = 0;
    // let engagementScore = 0; // engagementScore is not used
    let learningStyleScore = { audio: 0, reading: 0, speaking: 0, mixed: 0 };

    // Q1: Confidence level (0-3 points)
    if (answers.q1 === 'o1') levelScore = 0;
    else if (answers.q1 === 'o2') levelScore = 1;
    else if (answers.q1 === 'o3') levelScore = 2;
    else if (answers.q1 === 'o4') levelScore = 3;

    // Q2: Engagement (hours per week)
    // engagementScore is not used in logic

    // Q4: Learning style preference
    if (answers.q4 === 'o1') {
      learningStyleScore.audio = 3;
      learningStyleScore.mixed = 1;
    } else if (answers.q4 === 'o2') {
      learningStyleScore.reading = 3;
      learningStyleScore.mixed = 1;
    } else if (answers.q4 === 'o3') {
      learningStyleScore.speaking = 3;
      learningStyleScore.mixed = 1;
    } else if (answers.q4 === 'o4') {
      learningStyleScore.mixed = 4;
    }

    // Determine placement level
    let placementLevel: 'absolute_beginner' | 'beginner' | 'intermediate' | 'advanced';
    if (levelScore === 0) placementLevel = 'absolute_beginner';
    else if (levelScore === 1) placementLevel = 'beginner';
    else if (levelScore === 2) placementLevel = 'intermediate';
    else placementLevel = 'advanced';

    // Map to Prisma ProficiencyLevel enum
    let proficiencyLevel: 'BEGINNER' | 'ELEMENTARY' | 'INTERMEDIATE' | 'ADVANCED';
    if (placementLevel === 'absolute_beginner') proficiencyLevel = 'BEGINNER';
    else if (placementLevel === 'beginner') proficiencyLevel = 'ELEMENTARY';
    else if (placementLevel === 'intermediate') proficiencyLevel = 'INTERMEDIATE';
    else proficiencyLevel = 'ADVANCED';

    // Update or create learner profile with placement results
    const learnerProfile = await prisma.learnerProfile.upsert({
      where: { userId },
      create: {
        userId,
        proficiencyLevel,
        placementScore: levelScore,
        lastAssessmentDate: new Date(),
      },
      update: {
        proficiencyLevel,
        placementScore: levelScore,
        lastAssessmentDate: new Date(),
      },
    });

    console.log('✅ Updated learner profile:', { userId, proficiencyLevel, placementScore: levelScore });

    return res.status(200).json({
      message: 'Assessment submitted successfully',
      assessment: {
        id: learnerProfile.id,
        placementLevel,
        score: levelScore,
        recommendation: `You've been placed at the ${placementLevel.replace(/_/g, ' ')} level. We'll start with lessons appropriate for your level.`,
      },
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    return res.status(500).json({ error: 'Failed to submit assessment' });
  }
});

// ROUTE: Generate Personalized Learning Path
router.post('/generate-path', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { placementLevel, learningLanguages } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get appropriate lessons for this level
    const lessons = await prisma.lesson.findMany({
      where: {
        isPublished: true,
        ...(learningLanguages?.length > 0 ? {
          language: {
            in: learningLanguages,
          },
        } : {}),
      },
      take: 10,
    });

    // Sort by difficulty to match placement level
    const difficultyOrder: Record<string, number> = {
      'beginner': 0,
      'elementary': 1,
      'intermediate': 2,
      'advanced': 3,
    };

    const placementMap: Record<string, string[]> = {
      'absolute_beginner': ['beginner'],
      'beginner': ['beginner', 'elementary'],
      'intermediate': ['elementary', 'intermediate'],
      'advanced': ['intermediate', 'advanced'],
    };

    const appropriateLessons = lessons
      .filter(l => placementMap[placementLevel]?.includes(l.gradeLevel?.toLowerCase() || ''))
      .sort((a, b) => {
        const aLevel = difficultyOrder[a.gradeLevel?.toLowerCase() || 'beginner'] || 0;
        const bLevel = difficultyOrder[b.gradeLevel?.toLowerCase() || 'beginner'] || 0;
        return aLevel - bLevel;
      });

    // Create learning path recommendations
    const learningPath = appropriateLessons.map((lesson, index) => ({
      order: index + 1,
      lesson: {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration || lesson.estimatedDuration || 15,
        language: lesson.language,
      },
      reason: index === 0 
        ? 'Perfect starting point for your level'
        : `Build on your ${index === 1 ? 'foundational' : 'growing'} skills`,
      estimatedTimeToComplete: (lesson.duration || lesson.estimatedDuration || 15) * (5 - Math.min(4, index)),
    }));

    // Map placement level to proficiency level enum
    const proficiencyMap: Record<string, string> = {
      'absolute_beginner': 'BEGINNER',
      'beginner': 'ELEMENTARY',
      'intermediate': 'INTERMEDIATE',
      'advanced': 'ADVANCED',
    };

    // Update learner profile with learning languages if provided
    const existingProfile = await prisma.learnerProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      await prisma.learnerProfile.update({
        where: { userId },
        data: {
          proficiencyLevel: (proficiencyMap[placementLevel] || 'BEGINNER') as any,
          ...(learningLanguages?.length > 0 ? { learningLanguages } : {}),
        },
      });
    }

    return res.status(200).json({
      message: 'Learning path generated successfully',
      learningPath: {
        level: placementLevel,
        totalLessons: learningPath.length,
        estimatedTotalHours: Math.ceil(
          learningPath.reduce((sum, item) => sum + item.estimatedTimeToComplete, 0) / 60
        ),
        lessons: learningPath,
        next: learningPath[0] || null,
      },
    });
  } catch (error) {
    console.error('Error generating learning path:', error);
    return res.status(500).json({ error: 'Failed to generate learning path' });
  }
});

export default router;
