/**
 * DEMO LESSON WITH TTS & ACCESSIBILITY
 * 
 * A working demo lesson showcasing all implemented features
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    // Demo lesson with proper structure for MultiModalLesson component
    const demoLesson = {
      _id: lessonId,
      title: "Greetings & Introductions",
      description: "Learn how to greet people and introduce yourself in English",
      targetLanguage: "English",
      learningLanguage: "en",
      level: "beginner",
      estimatedTime: 10,
      steps: [
        {
          id: "step-1",
          type: "instruction",
          title: "Welcome!",
          content: "In this lesson, you'll learn common English greetings. Click the speaker icon to hear each phrase.",
          audioUrl: null
        },
        {
          id: "step-2",
          type: "vocabulary",
          title: "Basic Greetings",
          content: "Let's learn three essential greetings:",
          words: [
            {
              word: "Hello",
              translation: "வணக்கம் (Vanakkam)",
              pronunciation: "he-loh",
              example: "Hello, how are you?",
              audioUrl: null
            },
            {
              word: "Good morning",
              translation: "காலை வணக்கம் (Kaalai vanakkam)",
              pronunciation: "good mor-ning",
              example: "Good morning, teacher!",
              audioUrl: null
            },
            {
              word: "How are you?",
              translation: "எப்படி இருக்கிறீர்கள்? (Eppadi irukkireerkal?)",
              pronunciation: "how ar yoo",
              example: "Hello! How are you today?",
              audioUrl: null
            }
          ]
        },
        {
          id: "step-3",
          type: "practice",
          title: "Practice Time",
          question: "What do you say when you meet someone in the morning?",
          options: [
            { id: "a", text: "Good night", correct: false },
            { id: "b", text: "Good morning", correct: true },
            { id: "c", text: "Goodbye", correct: false },
            { id: "d", text: "Thank you", correct: false }
          ],
          feedback: {
            correct: "Excellent! 'Good morning' is the correct greeting before noon.",
            incorrect: "Not quite. Try again! Think about what time of day it is."
          }
        },
        {
          id: "step-4",
          type: "practice",
          title: "Greetings Quiz",
          question: "Which word means 'Hello' in English?",
          options: [
            { id: "a", text: "Goodbye", correct: false },
            { id: "b", text: "Please", correct: false },
            { id: "c", text: "Hello", correct: true },
            { id: "d", text: "Sorry", correct: false }
          ],
          feedback: {
            correct: "Perfect! 'Hello' is a universal greeting!",
            incorrect: "Try again. It's the most common greeting."
          }
        },
        {
          id: "step-5",
          type: "practice",
          title: "Asking How Someone Is",
          question: "How do you ask someone about their well-being?",
          options: [
            { id: "a", text: "What's your name?", correct: false },
            { id: "b", text: "How are you?", correct: true },
            { id: "c", text: "Where are you from?", correct: false },
            { id: "d", text: "How old are you?", correct: false }
          ],
          feedback: {
            correct: "Great job! 'How are you?' shows you care about the person.",
            incorrect: "Not quite. Think about asking about their feelings."
          }
        },
        {
          id: "step-6",
          type: "summary",
          title: "Lesson Complete!",
          content: "Congratulations! You've learned:\n\n• Hello - A friendly greeting\n• Good morning - Morning greeting\n• How are you? - Asking about someone's well-being\n\nPractice these with friends and family!"
        }
      ]
    };

    return NextResponse.json(demoLesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to load lesson' },
      { status: 500 }
    );
  }
}
