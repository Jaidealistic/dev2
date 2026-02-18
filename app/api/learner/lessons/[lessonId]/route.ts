/**
 * PROFESSIONAL LESSON SYSTEM
 * 
 * Comprehensive English lessons with Tamil translations
 */

import { NextRequest, NextResponse } from 'next/server';

// Professional lesson library
const PROFESSIONAL_LESSONS: Record<string, any> = {
  'demo-lesson-1': {
    _id: 'demo-lesson-1',
    title: "Greetings & Introductions",
    description: "Master essential English greetings and learn how to introduce yourself confidently",
    targetLanguage: "English",
    learningLanguage: "en",
    level: "beginner",
    estimatedTime: 12,
    steps: [
      {
        id: "step-1",
        type: "instruction",
        title: "Welcome! 🎉",
        content: "In this lesson, you'll learn the most important English greetings. These phrases will help you make a great first impression!\n\n**What you'll learn:**\n• How to say hello\n• Morning/evening greetings\n• How to introduce yourself\n• How to ask how someone is\n\nClick 'Next' when you're ready to begin!",
        audioUrl: null
      },
      {
        id: "step-2",
        type: "vocabulary",
        title: "Essential Greetings",
        content: "Let's learn three essential greetings. Listen to each one:",
        words: [
          {
            word: "Hello",
            translation: "வணக்கம் (Vanakkam)",
            phonetic: "hə-ˈlō",
            example: "Hello! How are you today?"
          },
          {
            word: "Good morning",
            translation: "காலை வணக்கம் (Kaalai vanakkam)",
            phonetic: "gʊd ˈmɔːr-nɪŋ",
            example: "Good morning, everyone!"
          },
          {
            word: "How are you?",
            translation: "எப்படி இருக்கிறீர்கள்? (Eppadi irukkireerkal?)",
            phonetic: "haʊ ɑːr juː",
            example: "Hi Sarah! How are you?"
          }
        ]
      },
      {
        id: "step-3",
        type: "practice",
        title: "Quick Practice",
        question: "What do you say when you meet someone in the morning?",
        options: [
          { id: "a", text: "Good night", correct: false },
          { id: "b", text: "Good morning", correct: true },
          { id: "c", text: "Goodbye", correct: false },
          { id: "d", text: "Thank you", correct: false }
        ],
        correctFeedback: "🎉 Excellent! 'Good morning' is perfect for morning greetings.",
        incorrectFeedback: "Not quite. Think about the time of day - it's morning!"
      },
      {
        id: "step-4",
        type: "vocabulary",
        title: "Introducing Yourself",
        content: "Now let's learn how to tell people your name:",
        words: [
          {
            word: "My name is",
            translation: "என் பெயர் (En peyar)",
            phonetic: "maɪ neɪm ɪz",
            example: "Hi! My name is Sarah. Nice to meet you!"
          },
          {
            word: "Nice to meet you",
            translation: "உங்களை சந்தித்து மகிழ்ச்சி (Ungalai sandhithu maghizchi)",
            phonetic: "nys tuː miːt juː",
            example: "Hello! Nice to meet you!"
          }
        ]
      },
      {
        id: "step-5",
        type: "practice",
        title: "Introduction Quiz",
        question: "How do you tell someone your name?",
        options: [
          { id: "a", text: "How are you?", correct: false },
          { id: "b", text: "My name is [name]", correct: true },
          { id: "c", text: "Good morning", correct: false },
          { id: "d", text: "Where are you from?", correct: false }
        ],
        correctFeedback: "✅ Perfect! 'My name is' is the standard way to introduce yourself.",
        incorrectFeedback: "Try again! Think about how you tell someone what you're called."
      },
      {
        id: "step-6",
        type: "summary",
        title: "Lesson Complete! 🎊",
        content: "## Congratulations!\n\nYou've mastered essential English greetings:\n\n✅ **Hello** - Universal greeting\n✅ **Good morning** - Morning greeting\n✅ **How are you?** - Asking about well-being\n✅ **My name is** - Introducing yourself\n✅ **Nice to meet you** - Polite greeting\n\n### Next Steps\nPractice these phrases with friends and family! Ready for the next lesson on **Family & Relationships**?",
        audioUrl: null
      }
    ]
  },

  'demo-lesson-2': {
    _id: 'demo-lesson-2',
    title: "Family & Relationships",
    description: "Learn how to talk about your family members in English",
    targetLanguage: "English",
    learningLanguage: "en",
    level: "beginner",
    estimatedTime: 15,
    steps: [
      {
        id: "step-1",
        type: "instruction",
        title: "Family Vocabulary 👨‍👩‍👧‍👦",
        content: "Family is important in every culture! In this lesson, you'll learn:\n\n• Parents (mother, father)\n• Siblings (sister, brother)\n• How to describe your family\n\nLet's begin!",
        audioUrl: null
      },
      {
        id: "step-2",
        type: "vocabulary",
        title: "Immediate Family",
        content: "Let's learn about your closest family members:",
        words: [
          {
            word: "Mother",
            translation: "அம்மா (Amma)",
            phonetic: "ˈmʌð-ər",
            example: "My mother is a teacher."
          },
          {
            word: "Father",
            translation: "அப்பா (Appa)",
            phonetic: "ˈfɑː-ðər",
            example: "My father works in a bank."
          },
          {
            word: "Sister",
            translation: "சகோதரி (Sagothari)",
            phonetic: "ˈsɪs-tər",
            example: "I have one younger sister."
          },
          {
            word: "Brother",
            translation: "சகோதரன் (Sagodharan)",
            phonetic: "ˈbrʌð-ər",
            example: "My brother is in college."
          }
        ]
      },
      {
        id: "step-3",
        type: "practice",
        title: "Family Quiz",
        question: "What do you call your female parent?",
        options: [
          { id: "a", text: "Sister", correct: false },
          { id: "b", text: "Mother", correct: true },
          { id: "c", text: "Grandmother", correct: false },
          { id: "d", text: "Aunt", correct: false }
        ],
        correctFeedback: "🎯 Correct! Your female parent is your mother (mom/mum).",
        incorrectFeedback: "Not quite. Your female parent is your mother."
      },
      {
        id: "step-4",
        type: "summary",
        title: "Well Done! 🌟",
        content: "## Great Work!\n\nYou've learned:\n\n✅ **Mother** & **Father** - Your parents\n✅ **Sister** & **Brother** - Your siblings\n\n### Practice Tip\nTry describing your family to a friend using these new words!\n\nNext lesson: **Food & Dining**",
        audioUrl: null
      }
    ]
  },

  'demo-lesson-3': {
    _id: 'demo-lesson-3',
    title: "Food & Dining",
    description: "Essential vocabulary for food, meals, and eating out",
    targetLanguage: "English",
    learningLanguage: "en",
    level: "beginner",
    estimatedTime: 18,
    steps: [
      {
        id: "step-1",
        type: "instruction",
        title: "Food Vocabulary 🍽️",
        content: "Food connects us all! Learn:\n\n• Meal names (breakfast, lunch, dinner)\n• Common foods\n• How to order food\n\nLet's start!",
        audioUrl: null
      },
      {
        id: "step-2",
        type: "vocabulary",
        title: "Meals of the Day",
        content: "The three main meals:",
        words: [
          {
            word: "Breakfast",
            translation: "காலை உணவு (Kaalai unavu)",
            phonetic: "ˈbrek-fəst",
            example: "I eat breakfast at 7 AM."
          },
          {
            word: "Lunch",
            translation: "மதிய உணவு (Madhiya unavu)",
            phonetic: "lʌntʃ",
            example: "Let's have lunch together."
          },
          {
            word: "Dinner",
            translation: "இரவு உணவு (Iravu unavu)",
            phonetic: "ˈdɪn-ər",
            example: "Dinner is at 8 PM tonight."
          }
        ]
      },
      {
        id: "step-3",
        type: "practice",
        title: "Meal Times",
        question: "What is the morning meal called?",
        options: [
          { id: "a", text: "Dinner", correct: false },
          { id: "b", text: "Lunch", correct: false },
          { id: "c", text: "Breakfast", correct: true },
          { id: "d", text: "Snack", correct: false }
        ],
        correctFeedback: "🍳 Perfect! Breakfast is the first meal, eaten in the morning.",
        incorrectFeedback: "Think about when you wake up - the first meal is breakfast!"
      },
      {
        id: "step-4",
        type: "summary",
        title: "Delicious! 🎉",
        content: "## Excellent Progress!\n\nYou now know:\n\n✅ **Breakfast, Lunch, Dinner** - The three main meals\n\n### Keep Learning\nNext lesson: **Shopping & Money** for intermediate learners!",
        audioUrl: null
      }
    ]
  },

  'demo-lesson-4': {
    _id: 'demo-lesson-4',
    title: "Shopping & Money",
    description: "Learn how to shop and handle money conversations",
    targetLanguage: "English",
    learningLanguage: "en",
    level: "intermediate",
    estimatedTime: 20,
    steps: [
      {
        id: "step-1",
        type: "instruction",
        title: "Shopping English 🛍️",
        content: "Shopping in English requires specific vocabulary. You'll learn:\n\n• How to ask prices\n• Making purchases\n• Payment methods\n\nLet's shop!",
        audioUrl: null
      },
      {
        id: "step-2",
        type: "vocabulary",
        title: "Shopping Phrases",
        content: "Essential phrases for shopping:",
        words: [
          {
            word: "How much is this?",
            translation: "இது எவ்வளவு? (Idhu evvalavu?)",
            phonetic: "haʊ mʌtʃ ɪz ðɪs",
            example: "Excuse me, how much is this shirt?"
          },
          {
            word: "I would like to buy",
            translation: "நான் வாங்க விரும்புகிறேன் (Naan vaanga virumbugiren)",
            phonetic: "aɪ wʊd laɪk tuː baɪ",
            example: "I would like to buy two apples, please."
          }
        ]
      },
      {
        id: "step-3",
        type: "practice",
        title: "Shopping Scenario",
        question: "You want to know the price. What do you say?",
        options: [
          { id: "a", text: "How are you?", correct: false },
          { id: "b", text: "How much is this?", correct: true },
          { id: "c", text: "Where is this?", correct: false },
          { id: "d", text: "When is this?", correct: false }
        ],
        correctFeedback: "💰 Perfect! 'How much is this?' asks for the price.",
        incorrectFeedback: "To ask about price, say 'How much is this?'"
      },
      {
        id: "step-4",
        type: "summary",
        title: "Shopping Pro! 🎊",
        content: "## Congratulations!\n\nYou've mastered:\n\n✅ **How much is this?** - Asking prices\n✅ **I would like to buy** - Making purchases\n\nYou're ready to shop in English!",
        audioUrl: null
      }
    ]
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    // Return professional lesson if it exists
    const lesson = PROFESSIONAL_LESSONS[lessonId];

    if (lesson) {
      // Transform to match MultiModalLesson expectations
      const transformedLesson = {
        id: lesson._id,
        title: lesson.title,
        description: lesson.description,
        estimatedDuration: lesson.estimatedTime,
        competencies: [],
        steps: lesson.steps.map((step: any) => ({
          id: step.id,
          stepType: step.type, // Map 'type' to 'stepType'
          title: step.title,
          content: step
        }))
      };

      return NextResponse.json({
        success: true,
        lesson: transformedLesson
      });
    }

    // Fallback to demo-lesson-1 if lesson not found
    const defaultLesson = PROFESSIONAL_LESSONS['demo-lesson-1'];
    const transformedDefault = {
      id: defaultLesson._id,
      title: defaultLesson.title,
      description: defaultLesson.description,
      estimatedDuration: defaultLesson.estimatedTime,
      competencies: [],
      steps: defaultLesson.steps.map((step: any) => ({
        id: step.id,
        stepType: step.type,
        title: step.title,
        content: step
      }))
    };

    return NextResponse.json({
      success: true,
      lesson: transformedDefault
    });

  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load lesson' },
      { status: 500 }
    );
  }
}
