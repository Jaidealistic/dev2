/**
 * PROFESSIONAL LESSON SYSTEM
 *
 * Comprehensive English lessons with Tamil translations.
 * Disability-specific lessons tagged with `disabilityTypes` array.
 *
 * Disability design principles:
 *  ADHD        – Short chunks, timers, single-task focus, immediate reward
 *  DYSLEXIA    – Phonetic guides, large text, colour-coded words, no time pressure
 *  APD         – Visual-first, written transcripts, no audio-only steps
 *  AUTISM      – Predictable structure, explicit social scripts, no ambiguity
 */

import { NextRequest, NextResponse } from 'next/server';

interface LessonStep {
  id: string;
  type: string;
  title: string;
  content?: string;
  audioUrl?: string | null;
  words?: {
    word: string;
    translation: string;
    phonetic: string;
    example: string;
  }[];
  question?: string;
  options?: {
    id: string;
    text: string;
    correct: boolean;
  }[];
  correctFeedback?: string;
  incorrectFeedback?: string;
}

interface ProfessionalLesson {
  _id: string;
  title: string;
  description: string;
  targetLanguage: string;
  learningLanguage: string;
  level: string;
  estimatedTime: number;
  disabilityTypes?: string[];
  steps: LessonStep[];
}

// Professional lesson library
const PROFESSIONAL_LESSONS: Record<string, ProfessionalLesson> = {

  /* ══════════════════════════════════════════════════════════════
     ADHD-OPTIMISED LESSONS
     Design: ≤3 min per step, progress dots, immediate feedback,
             single action per screen, no multi-step instructions
     ══════════════════════════════════════════════════════════════ */

  'adhd-lesson-1': {
    _id: 'adhd-lesson-1',
    title: 'One Word at a Time: Greetings',
    description: 'Short, focused greeting practice — one word per screen, immediate reward',
    targetLanguage: 'English',
    learningLanguage: 'en',
    level: 'beginner',
    estimatedTime: 8,
    disabilityTypes: ['ADHD'],
    steps: [
      {
        id: 'step-1', type: 'instruction', title: '👋 Ready? Just 8 minutes!',
        content: 'We will learn ONE greeting at a time.\n\nEach step is short — under 2 minutes.\n\nYou can do this! Press Next when you are ready.',
        audioUrl: null
      },
      {
        id: 'step-2', type: 'vocabulary', title: '⭐ Word 1: Hello',
        content: 'Just one word today:',
        words: [{ word: 'Hello', translation: 'வணக்கம் (Vanakkam)', phonetic: 'hə-ˈlō', example: 'Hello! I am happy to meet you.' }]
      },
      {
        id: 'step-3', type: 'practice', title: '✅ Quick Check',
        question: 'Which word means "வணக்கம்"?',
        options: [
          { id: 'a', text: 'Goodbye', correct: false },
          { id: 'b', text: 'Hello', correct: true },
          { id: 'c', text: 'Thank you', correct: false },
          { id: 'd', text: 'Sorry', correct: false }
        ],
        correctFeedback: '🎉 YES! You got it! Take a breath — great work.',
        incorrectFeedback: 'Try again — the answer is Hello. You can do it!'
      },
      {
        id: 'step-4', type: 'vocabulary', title: '⭐ Word 2: Good morning',
        content: 'One more word:',
        words: [{ word: 'Good morning', translation: 'காலை வணக்கம்', phonetic: 'gʊd ˈmɔːr-nɪŋ', example: 'Good morning! How are you?' }]
      },
      {
        id: 'step-5', type: 'practice', title: '✅ Quick Check',
        question: 'What do you say in the morning?',
        options: [
          { id: 'a', text: 'Good night', correct: false },
          { id: 'b', text: 'Good morning', correct: true },
          { id: 'c', text: 'Good evening', correct: false },
          { id: 'd', text: 'Goodbye', correct: false }
        ],
        correctFeedback: '🌟 Brilliant! Morning greeting = Good morning!',
        incorrectFeedback: 'Morning greeting = Good morning. Try once more!'
      },
      {
        id: 'step-6', type: 'summary', title: '🏆 Done! Amazing focus!',
        content: '## You finished!\n\n✅ **Hello** — any time greeting\n✅ **Good morning** — morning greeting\n\n### You stayed focused the whole time. That is a superpower! 💪\n\nNext: **Colours & Numbers** (also 8 minutes)',
        audioUrl: null
      }
    ]
  },

  'adhd-lesson-2': {
    _id: 'adhd-lesson-2',
    title: 'Colours — One at a Time',
    description: 'Learn 3 colours in 10 minutes with instant rewards and short steps',
    targetLanguage: 'English',
    learningLanguage: 'en',
    level: 'beginner',
    estimatedTime: 10,
    disabilityTypes: ['ADHD'],
    steps: [
      {
        id: 'step-1', type: 'instruction', title: '🎨 3 Colours. 10 Minutes. Let\'s go!',
        content: 'We learn RED, BLUE, GREEN today.\n\nOne colour per screen.\n\nPress Next to start!',
        audioUrl: null
      },
      {
        id: 'step-2', type: 'vocabulary', title: '🔴 Colour 1: Red',
        content: 'Focus on this one colour:',
        words: [{ word: 'Red', translation: 'சிவப்பு (Sivappu)', phonetic: 'rɛd', example: 'The apple is red.' }]
      },
      {
        id: 'step-3', type: 'practice', title: '✅ Red Check',
        question: 'What colour is "சிவப்பு"?',
        options: [
          { id: 'a', text: 'Blue', correct: false },
          { id: 'b', text: 'Green', correct: false },
          { id: 'c', text: 'Red', correct: true },
          { id: 'd', text: 'Yellow', correct: false }
        ],
        correctFeedback: '🔴 Yes! Red = சிவப்பு. You are doing great!',
        incorrectFeedback: 'Red = சிவப்பு. Try again — you can do it!'
      },
      {
        id: 'step-4', type: 'vocabulary', title: '🔵 Colour 2: Blue',
        content: 'Next colour:',
        words: [{ word: 'Blue', translation: 'நீலம் (Neelam)', phonetic: 'bluː', example: 'The sky is blue.' }]
      },
      {
        id: 'step-5', type: 'vocabulary', title: '🟢 Colour 3: Green',
        content: 'Last colour:',
        words: [{ word: 'Green', translation: 'பச்சை (Pachai)', phonetic: 'ɡriːn', example: 'The tree is green.' }]
      },
      {
        id: 'step-6', type: 'practice', title: '✅ Final Check',
        question: 'Which colour is the sky?',
        options: [
          { id: 'a', text: 'Red', correct: false },
          { id: 'b', text: 'Green', correct: false },
          { id: 'c', text: 'Blue', correct: true },
          { id: 'd', text: 'Yellow', correct: false }
        ],
        correctFeedback: '🌟 Perfect! Sky = Blue. Lesson complete!',
        incorrectFeedback: 'The sky is Blue. You\'ve got this!'
      },
      {
        id: 'step-7', type: 'summary', title: '🏆 3 Colours Mastered!',
        content: '## Fantastic work!\n\n✅ **Red** — சிவப்பு\n✅ **Blue** — நீலம்\n✅ **Green** — பச்சை\n\n### You completed the whole lesson! 🎉',
        audioUrl: null
      }
    ]
  },

  /* ══════════════════════════════════════════════════════════════
     DYSLEXIA-FRIENDLY LESSONS
     Design: Large phonetic guides, colour-coded syllables, no
             timed pressure, repeated exposure, visual word shapes
     ══════════════════════════════════════════════════════════════ */

  'dyslexia-lesson-1': {
    _id: 'dyslexia-lesson-1',
    title: 'Greetings — See It, Say It, Know It',
    description: 'Phonetic-guided greeting lesson with colour-coded syllables and no time pressure',
    targetLanguage: 'English',
    learningLanguage: 'en',
    level: 'beginner',
    estimatedTime: 20,
    disabilityTypes: ['DYSLEXIA'],
    steps: [
      {
        id: 'step-1', type: 'instruction', title: 'Welcome! Take your time. 😊',
        content: 'This lesson has NO timer.\n\nEach word is shown in big text with sounds broken into parts.\n\nRead at your own pace. Press Next when you are ready.',
        audioUrl: null
      },
      {
        id: 'step-2', type: 'vocabulary', title: 'Word 1: Hello',
        content: 'Read the word. Say it out loud. Look at the sound guide.',
        words: [
          {
            word: 'Hello',
            translation: 'வணக்கம் (Vanakkam)',
            phonetic: 'hel · loh  [HEL-oh]',
            example: 'Hello! My name is Priya.'
          }
        ]
      },
      {
        id: 'step-3', type: 'vocabulary', title: 'Word 2: Good morning',
        content: 'Two words together. Read each part:',
        words: [
          {
            word: 'Good morning',
            translation: 'காலை வணக்கம்',
            phonetic: 'good · mor · ning  [GOOD-MOR-ning]',
            example: 'Good morning! I am happy today.'
          }
        ]
      },
      {
        id: 'step-4', type: 'practice', title: 'Which word do you see?',
        question: 'Find the word that says "வணக்கம்" (Hello):',
        options: [
          { id: 'a', text: 'Goodbye', correct: false },
          { id: 'b', text: 'Hello', correct: true },
          { id: 'c', text: 'Morning', correct: false },
          { id: 'd', text: 'Thank you', correct: false }
        ],
        correctFeedback: '✅ Well done! Hello = வணக்கம். You read it correctly!',
        incorrectFeedback: 'Look for the word "Hello". Take your time — no rush!'
      },
      {
        id: 'step-5', type: 'vocabulary', title: 'Word 3: My name is',
        content: 'Three words. Read them slowly:',
        words: [
          {
            word: 'My name is',
            translation: 'என் பெயர் (En peyar)',
            phonetic: 'my · naym · iz  [MY-NAYM-iz]',
            example: 'My name is Arjun. Nice to meet you!'
          }
        ]
      },
      {
        id: 'step-6', type: 'summary', title: '🌟 Great reading!',
        content: '## You did it!\n\n✅ **Hello** — hel·loh\n✅ **Good morning** — good·mor·ning\n✅ **My name is** — my·naym·iz\n\n### Reading takes practice. You are getting better every day! 📖',
        audioUrl: null
      }
    ]
  },

  'dyslexia-lesson-2': {
    _id: 'dyslexia-lesson-2',
    title: 'Numbers 1–5 — Shape & Sound',
    description: 'Learn numbers with phonetic guides, word shapes, and visual patterns',
    targetLanguage: 'English',
    learningLanguage: 'en',
    level: 'beginner',
    estimatedTime: 18,
    disabilityTypes: ['DYSLEXIA'],
    steps: [
      {
        id: 'step-1', type: 'instruction', title: 'Numbers — See the shape, hear the sound',
        content: 'Each number word has a special shape.\n\nWe will look at the shape AND the sound.\n\nNo rush. Press Next to start.',
        audioUrl: null
      },
      {
        id: 'step-2', type: 'vocabulary', title: 'Numbers 1 and 2',
        content: 'Look at each word carefully:',
        words: [
          { word: 'One', translation: 'ஒன்று (Ondru)', phonetic: 'wun  [WUN]', example: 'I have one book.' },
          { word: 'Two', translation: 'இரண்டு (Irandu)', phonetic: 'too  [TOO]', example: 'I have two eyes.' }
        ]
      },
      {
        id: 'step-3', type: 'vocabulary', title: 'Numbers 3, 4 and 5',
        content: 'Three more words:',
        words: [
          { word: 'Three', translation: 'மூன்று (Moondru)', phonetic: 'three  [THRE-ee]', example: 'I have three friends.' },
          { word: 'Four', translation: 'நான்கு (Naangu)', phonetic: 'for  [FOR]', example: 'A table has four legs.' },
          { word: 'Five', translation: 'ஐந்து (Ainthu)', phonetic: 'fyv  [FYV]', example: 'I have five fingers.' }
        ]
      },
      {
        id: 'step-4', type: 'practice', title: 'Find the number',
        question: 'Which word means "இரண்டு" (2)?',
        options: [
          { id: 'a', text: 'One', correct: false },
          { id: 'b', text: 'Two', correct: true },
          { id: 'c', text: 'Three', correct: false },
          { id: 'd', text: 'Four', correct: false }
        ],
        correctFeedback: '✅ Yes! Two = இரண்டு. Excellent reading!',
        incorrectFeedback: 'Look for "Two" — it sounds like "too". Try again!'
      },
      {
        id: 'step-5', type: 'summary', title: '🌟 Numbers 1–5 done!',
        content: '## Brilliant work!\n\n✅ One · Two · Three · Four · Five\n\n### You read every word. That is real progress! 🎉',
        audioUrl: null
      }
    ]
  },

  /* ══════════════════════════════════════════════════════════════
     APD (AUDITORY PROCESSING DISORDER) LESSONS
     Design: Visual-first, full written transcripts for everything,
             no audio-only steps, written dialogue scripts,
             lip-reading cues, context clues highlighted
     ══════════════════════════════════════════════════════════════ */

  'apd-lesson-1': {
    _id: 'apd-lesson-1',
    title: 'Greetings — Read It, See It',
    description: 'Visual-first greeting lesson with full written transcripts and no audio dependency',
    targetLanguage: 'English',
    learningLanguage: 'en',
    level: 'beginner',
    estimatedTime: 15,
    disabilityTypes: ['APD'],
    steps: [
      {
        id: 'step-1', type: 'instruction', title: '👁️ This lesson is 100% visual',
        content: 'Everything is written out for you.\n\nNo audio is required.\n\nAll dialogues are shown as text scripts.\n\nPress Next to begin.',
        audioUrl: null
      },
      {
        id: 'step-2', type: 'vocabulary', title: 'Greeting 1: Hello',
        content: 'Read this dialogue carefully:\n\n**Person A says:** Hello!\n**Person B says:** Hello! How are you?\n**Person A says:** I am fine, thank you.',
        words: [
          { word: 'Hello', translation: 'வணக்கம் (Vanakkam)', phonetic: 'hel-oh', example: '📝 Written script: "Hello! Nice to meet you."' }
        ]
      },
      {
        id: 'step-3', type: 'vocabulary', title: 'Greeting 2: Good morning',
        content: 'Read this morning dialogue:\n\n**At school, 8 AM:**\n**Teacher:** Good morning, class!\n**Students:** Good morning, teacher!\n\n*Context clue: "Good morning" is used before 12 noon.*',
        words: [
          { word: 'Good morning', translation: 'காலை வணக்கம்', phonetic: 'good-mor-ning', example: '📝 "Good morning! The weather is nice today."' }
        ]
      },
      {
        id: 'step-4', type: 'practice', title: '📝 Reading Check',
        question: 'Read this: "Good _____, class!" — What is the missing word? (It is a morning greeting.)',
        options: [
          { id: 'a', text: 'night', correct: false },
          { id: 'b', text: 'morning', correct: true },
          { id: 'c', text: 'evening', correct: false },
          { id: 'd', text: 'afternoon', correct: false }
        ],
        correctFeedback: '✅ Correct! "Good morning" — used before noon. You read the context clue perfectly!',
        incorrectFeedback: 'Look at the context: "It is a morning greeting." The answer is "morning".'
      },
      {
        id: 'step-5', type: 'vocabulary', title: 'Greeting 3: My name is',
        content: 'Introduction script:\n\n**Person A:** Hi! My name is Kavya.\n**Person B:** Hello Kavya! My name is Ravi.\n**Person A:** Nice to meet you, Ravi!\n\n*Use this script when you meet someone new.*',
        words: [
          { word: 'My name is', translation: 'என் பெயர் (En peyar)', phonetic: 'my-naym-iz', example: '📝 "My name is [your name]. Nice to meet you!"' }
        ]
      },
      {
        id: 'step-6', type: 'summary', title: '📖 Lesson Complete!',
        content: '## Well done!\n\n✅ **Hello** — any time\n✅ **Good morning** — before noon\n✅ **My name is** — introductions\n\n### All content was visual. You did not need audio at all! 🎉',
        audioUrl: null
      }
    ]
  },

  'apd-lesson-2': {
    _id: 'apd-lesson-2',
    title: 'Family Words — Visual Scripts',
    description: 'Family vocabulary with written dialogue scripts, context clues, and no audio dependency',
    targetLanguage: 'English',
    learningLanguage: 'en',
    level: 'beginner',
    estimatedTime: 18,
    disabilityTypes: ['APD'],
    steps: [
      {
        id: 'step-1', type: 'instruction', title: '👁️ Family Vocabulary — All Visual',
        content: 'Every word comes with a written example.\n\nDialogues are shown as text scripts.\n\nRead at your own pace.',
        audioUrl: null
      },
      {
        id: 'step-2', type: 'vocabulary', title: 'Family Words',
        content: 'Read each word and its example sentence:',
        words: [
          { word: 'Mother', translation: 'அம்மா (Amma)', phonetic: 'muh-ther', example: '📝 "My mother is a doctor. She helps sick people."' },
          { word: 'Father', translation: 'அப்பா (Appa)', phonetic: 'fah-ther', example: '📝 "My father cooks dinner every evening."' },
          { word: 'Sister', translation: 'சகோதரி (Sagothari)', phonetic: 'sis-ter', example: '📝 "My sister reads books every night."' },
          { word: 'Brother', translation: 'சகோதரன் (Sagodharan)', phonetic: 'bruh-ther', example: '📝 "My brother plays cricket on weekends."' }
        ]
      },
      {
        id: 'step-3', type: 'practice', title: '📝 Family Script Check',
        question: 'Read: "My _____ is a doctor. She helps sick people." — What family word fits? (Hint: "She" = female)',
        options: [
          { id: 'a', text: 'Father', correct: false },
          { id: 'b', text: 'Brother', correct: false },
          { id: 'c', text: 'Mother', correct: true },
          { id: 'd', text: 'Uncle', correct: false }
        ],
        correctFeedback: '✅ Correct! "She" tells us it is a female — Mother!',
        incorrectFeedback: 'Clue: "She" = female family member. The answer is Mother.'
      },
      {
        id: 'step-4', type: 'summary', title: '📖 Family Words Done!',
        content: '## Great reading!\n\n✅ **Mother** — அம்மா\n✅ **Father** — அப்பா\n✅ **Sister** — சகோதரி\n✅ **Brother** — சகோதரன்\n\n### You used context clues to understand every word! 🌟',
        audioUrl: null
      }
    ]
  },

  /* ══════════════════════════════════════════════════════════════
     AUTISM-FRIENDLY LESSONS
     Design: Predictable structure (always: intro → vocab → quiz →
             summary), explicit social scripts, literal language,
             no idioms, no ambiguity, clear expectations
     ══════════════════════════════════════════════════════════════ */

  'autism-lesson-1': {
    _id: 'autism-lesson-1',
    title: 'Greetings — Exact Scripts to Use',
    description: 'Predictable structure with exact social scripts for greetings — no ambiguity',
    targetLanguage: 'English',
    learningLanguage: 'en',
    level: 'beginner',
    estimatedTime: 15,
    disabilityTypes: ['AUTISM'],
    steps: [
      {
        id: 'step-1', type: 'instruction', title: 'What will happen in this lesson',
        content: 'This lesson has 4 steps:\n\n1. You will read a greeting word.\n2. You will read an exact script to use.\n3. You will answer one question.\n4. You will see a summary.\n\nEvery lesson follows this same pattern.\n\nPress Next to start Step 1.',
        audioUrl: null
      },
      {
        id: 'step-2', type: 'vocabulary', title: 'Step 1 — Greeting: Hello',
        content: '**Exact script to use:**\n\nWhen you see someone you know:\n→ Say: "Hello, [their name]."\n\nWhen you see someone new:\n→ Say: "Hello. My name is [your name]."\n\nThese are the correct things to say.',
        words: [
          { word: 'Hello', translation: 'வணக்கம் (Vanakkam)', phonetic: 'hel-oh', example: 'Correct use: "Hello, Priya. How are you?"' }
        ]
      },
      {
        id: 'step-3', type: 'vocabulary', title: 'Step 1 — Greeting: Good morning',
        content: '**When to use "Good morning":**\n\n• Use it from 6:00 AM to 12:00 PM (noon).\n• After 12:00 PM, say "Good afternoon".\n• After 6:00 PM, say "Good evening".\n\n**Exact script:**\n→ "Good morning, [name]."',
        words: [
          { word: 'Good morning', translation: 'காலை வணக்கம்', phonetic: 'good-mor-ning', example: 'Correct: "Good morning, teacher." (before 12 PM)' }
        ]
      },
      {
        id: 'step-4', type: 'practice', title: 'Step 2 — One question',
        question: 'It is 9:00 AM. You see your teacher. What do you say?',
        options: [
          { id: 'a', text: 'Good evening, teacher.', correct: false },
          { id: 'b', text: 'Good morning, teacher.', correct: true },
          { id: 'c', text: 'Good night, teacher.', correct: false },
          { id: 'd', text: 'Good afternoon, teacher.', correct: false }
        ],
        correctFeedback: '✅ Correct! 9:00 AM is before noon. Use "Good morning".',
        incorrectFeedback: 'Rule: 6 AM–12 PM = "Good morning". It is 9 AM, so say "Good morning, teacher."'
      },
      {
        id: 'step-5', type: 'summary', title: 'Step 3 — Summary (lesson is complete)',
        content: '## This lesson is now finished.\n\n**You learned:**\n\n✅ **Hello** — use when meeting someone\n✅ **Good morning** — use from 6 AM to 12 PM\n\n**Exact scripts:**\n• "Hello, [name]."\n• "Good morning, [name]."\n\n### The next lesson will follow the same 4-step pattern.',
        audioUrl: null
      }
    ]
  },

  'autism-lesson-2': {
    _id: 'autism-lesson-2',
    title: 'Asking for Help — Exact Phrases',
    description: 'Explicit, literal scripts for asking for help in school and daily situations',
    targetLanguage: 'English',
    learningLanguage: 'en',
    level: 'beginner',
    estimatedTime: 15,
    disabilityTypes: ['AUTISM'],
    steps: [
      {
        id: 'step-1', type: 'instruction', title: 'What will happen in this lesson',
        content: 'This lesson has 4 steps (same as always):\n\n1. Read the phrase.\n2. Read when and how to use it.\n3. Answer one question.\n4. See the summary.\n\nPress Next to start.',
        audioUrl: null
      },
      {
        id: 'step-2', type: 'vocabulary', title: 'Step 1 — Phrase: Excuse me',
        content: '**When to use "Excuse me":**\n\n• When you need to get someone\'s attention.\n• When you need to pass by someone.\n• When you did not hear something.\n\n**Exact scripts:**\n→ "Excuse me, can you help me?"\n→ "Excuse me, I did not understand."\n→ "Excuse me, may I pass?"',
        words: [
          { word: 'Excuse me', translation: 'மன்னிக்கவும் (Mannikkavum)', phonetic: 'ek-skyooz-mee', example: 'Correct: "Excuse me, where is the library?"' }
        ]
      },
      {
        id: 'step-3', type: 'vocabulary', title: 'Step 1 — Phrase: I need help',
        content: '**When to use "I need help":**\n\n• When you do not understand something.\n• When you cannot do a task alone.\n\n**Exact scripts:**\n→ "I need help with this question."\n→ "I need help. I do not understand."\n\n*It is always okay to ask for help.*',
        words: [
          { word: 'I need help', translation: 'எனக்கு உதவி வேண்டும் (Enakku udhavi vendum)', phonetic: 'I-need-help', example: 'Correct: "Excuse me. I need help with this problem."' }
        ]
      },
      {
        id: 'step-4', type: 'practice', title: 'Step 2 — One question',
        question: 'You do not understand the homework. What is the correct thing to say to your teacher?',
        options: [
          { id: 'a', text: 'Good morning, teacher.', correct: false },
          { id: 'b', text: 'Excuse me. I need help with the homework.', correct: true },
          { id: 'c', text: 'Hello, teacher.', correct: false },
          { id: 'd', text: 'Thank you, teacher.', correct: false }
        ],
        correctFeedback: '✅ Correct! "Excuse me. I need help with the homework." is the right script.',
        incorrectFeedback: 'When you need help with homework, say: "Excuse me. I need help with the homework."'
      },
      {
        id: 'step-5', type: 'summary', title: 'Step 3 — Summary (lesson is complete)',
        content: '## This lesson is now finished.\n\n**You learned:**\n\n✅ **Excuse me** — to get attention or ask to pass\n✅ **I need help** — when you need assistance\n\n**Exact scripts:**\n• "Excuse me, can you help me?"\n• "I need help with [task]."\n\n### The next lesson will follow the same 4-step pattern.',
        audioUrl: null
      }
    ]
  },

  /* ══════════════════════════════════════════════════════════════
     GENERAL LESSONS (no specific disability)
     ══════════════════════════════════════════════════════════════ */
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
        disabilityTypes: lesson.disabilityTypes || [],
        steps: (lesson.steps as LessonStep[]).map((step: LessonStep) => ({
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
      steps: (defaultLesson.steps as LessonStep[]).map((step: LessonStep) => ({
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
