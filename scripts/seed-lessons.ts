import 'dotenv/config';
import dbConnect from '../lib/mongodb';
import Lesson from '../lib/models/Lesson';
import { nanoid } from 'nanoid';

const sampleLessons = [
  {
    lessonId: `lesson_${nanoid(10)}`,
    title: {
      en: 'Greetings and Introductions',
      ta: 'வணக்கங்களும் அறிமுகங்களும்',
    },
    level: 'beginner' as const,
    language: 'en' as const,
    estimatedDuration: 25,
    prepTimeMinutes: 5,
    content: {
      introduction: {
        text: {
          en: "Today we'll learn how to greet people and introduce ourselves in English.",
          ta: 'இன்று நாம் ஆங்கிலத்தில் மக்களை வாழ்த்துவது மற்றும் நம்மை அறிமுகப்படுத்துவது எப்படி என்று கற்போம்.',
        },
        audioUrl: {
          en: '/audio/lessons/001/intro_en.mp3',
          ta: '/audio/lessons/001/intro_ta.mp3',
        },
        imageUrl: '/images/lessons/001/greeting.jpg',
      },
      sections: [
        {
          type: 'vocabulary' as const,
          sectionId: 'vocab_001',
          title: {
            en: 'Key Vocabulary',
            ta: 'முக்கிய சொற்கள்',
          },
          items: [
            {
              word: 'Hello',
              translation: 'வணக்கம்',
              phoneticEn: 'həˈloʊ',
              phoneticTa: 'vaṇakkam',
              audioUrl: '/audio/vocab/hello_en.mp3',
              exampleSentence: {
                en: 'Hello, my name is Sarah.',
                ta: 'வணக்கம், என் பெயர் சாரா.',
              },
            },
            {
              word: 'Goodbye',
              translation: 'போய்விட்டு வருகிறேன்',
              phoneticEn: 'ɡʊdˈbaɪ',
              phoneticTa: 'pōyviṭṭu varukiṟēṉ',
              audioUrl: '/audio/vocab/goodbye_en.mp3',
              exampleSentence: {
                en: 'Goodbye, see you tomorrow!',
                ta: 'போய்விட்டு வருகிறேன், நாளை பார்க்கலாம்!',
              },
            },
          ],
        },
        {
          type: 'practice' as const,
          sectionId: 'practice_001',
          title: {
            en: 'Practice Exercise',
            ta: 'பயிற்சி',
          },
          items: [
            {
              exerciseType: 'multipleChoice',
              question: {
                text: {
                  en: "How do you say 'Hello' in Tamil?",
                  ta: "தமிழில் 'Hello' என்பது எப்படி?",
                },
              },
              options: ['வணக்கம்', 'நன்றி', 'பார்க்கலாம்', 'போய்விட்டு வருகிறேன்'],
              correctAnswer: 'வணக்கம்',
            },
          ],
        },
      ],
    },
    teachingGuide: {
      overview: {
        en: 'This lesson introduces basic greetings in English',
        ta: 'இந்த பாடம் ஆங்கிலத்தில் அடிப்படை வாழ்த்துக்களை அறிமுகப்படுத்துகிறது',
      },
      learningObjectives: {
        en: ['Learn to say hello and goodbye', 'Introduce yourself'],
        ta: ['வணக்கம் மற்றும் விடைபெறுதல் கற்றல்', 'உங்களை அறிமுகப்படுத்துதல்'],
      },
      steps: [
        {
          stepNumber: 1,
          title: 'Introduction',
          durationMinutes: 5,
          script:
            "Say: 'Today we're learning greetings. When you meet someone, what do you say? That's right - Hello!'",
          materialsNeeded: ['Flashcards', 'Audio player'],
          adaptations: {
            dyslexia: 'Use large font flashcards (24pt minimum)',
            adhd: 'Set a visible 5-minute timer',
            autism: 'Show exact schedule: Step 1, Step 2, Step 3',
            apd: 'Speak 25% slower than normal, no background noise',
          },
        },
      ],
    },
    niosCompetencies: ['L&S1', 'L&S2'],
    createdBy: 'system',
    status: 'published' as const,
    visibility: 'public' as const,
    tags: ['greetings', 'basics', 'beginner'],
    difficulty: 1,
    thumbnail: '/images/lessons/001/thumb.jpg',
    version: 1,
  },
  // Add more lessons here...
];

async function main() {
  console.log('🌱 Seeding MongoDB lessons...');

  await dbConnect();

  // Clear existing lessons
  await Lesson.deleteMany({});
  console.log('✅ Cleared existing lessons');

  // Insert sample lessons
  const inserted = await Lesson.insertMany(sampleLessons);
  console.log(`✅ Inserted ${inserted.length} sample lessons`);

  console.log('\n🎉 Lesson seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });