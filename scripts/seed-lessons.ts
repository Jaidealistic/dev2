import 'dotenv/config';
import dbConnect from '../lib/mongodb';
import Lesson from '../lib/models/Lesson';
import { nanoid } from 'nanoid';

/**
 * PROFESSIONAL LESSON SEEDING SCRIPT
 * 
 * Seeds comprehensive, production-ready English lessons with:
 * - Beginner to advanced levels
 * - Tamil translations
 * - Vocabulary, grammar, practice exercises
 * - Proper phonetic notation
 * 
 * Run: npm run seed:lessons OR node scripts/seed-lessons.ts
 */

const professionalLessons = [
  // === BEGINNER LESSONS ===
  {
    lessonId: `lesson_begin_greetings`,
    title: {
      en: 'Greetings & Introductions',
      ta: 'வணக்கங்களும் அறிமுகங்களும்',
    },
    level: 'beginner' as const,
    language: 'en' as const,
    estimatedDuration: 15,
    prepTimeMinutes: 3,
    content: {
      introduction: {
        text: {
          en: "Master essential English greetings! You'll learn how to say hello, introduce yourself, and make a great first impression.",
          ta: 'அத்தியாவசிய ஆங்கில வாழ்த்துக்களை முழுமையாகக் கற்றுக் கொள்ளுங்கள்! ஹலோ சொல்வது,உங்களை அறிமுகப்படுத்துவது மற்றும் சிறந்த முதல் தாக்கத்தை ஏற்படுத்துவது எப்படி என்று  நீங்கள் கற்றுக்கொள்வீர்கள்.',
        },
        audioUrl: {
          en: '/audio/lessons/greetings/intro_en.mp3',
          ta: '/audio/lessons/greetings/intro_ta.mp3',
        },
        imageUrl: '/images/lessons/greetings_banner.jpg',
      },
      sections: [
        {
          type: 'vocabulary' as const,
          sectionId: 'greet_vocab_001',
          title: {
            en: 'Essential Greetings',
            ta: 'அத்தியாவசிய வாழ்த்துக்கள்',
          },
          items: [
            {
              word: 'Hello',
              translation: 'வணக்கம்',
              phoneticEn: 'hə-ˈlō',
              phoneticTa: 'vaṇakkam',
              audioUrl: '/audio/vocab/hello_en.mp3',
              exampleSentence: {
                en: 'Hello! How are you today?',
                ta: 'வணக்கம்! இன்று எப்படி இருக்கிறீர்கள்?',
              },
            },
            {
              word: 'Good morning',
              translation: 'காலை வணக்கம்',
              phoneticEn: 'gʊd ˈmɔːr-nɪŋ',
              phoneticTa: 'kālai vaṇakkam',
              audioUrl: '/audio/vocab/good_morning_en.mp3',
              exampleSentence: {
                en: 'Good morning, everyone!',
                ta: 'காலை வணக்கம், அனைவருக்கும்!',
              },
            },
            {
              word: 'How are you?',
              translation: 'எப்படி இருக்கிறீர்கள்?',
              phoneticEn: 'haʊ ɑːr juː',
              phoneticTa: 'eppaḍi irukkīrkaḷ',
              audioUrl: '/audio/vocab/how_are_you_en.mp3',
              exampleSentence: {
                en: 'Hello Sarah, how are you?',
                ta: 'ஹலோ சாரா, எப்படி இருக்கிறீர்கள்?',
              },
            },
            {
              word: 'My name is',
              translation: 'என் பெயர்',
              phoneticEn: 'maɪ neɪm ɪz',
              phoneticTa: 'en peyar',
              audioUrl: '/audio/vocab/my_name_is_en.mp3',
              exampleSentence: {
                en: 'Hi! My name is John.',
                ta: 'ஹாய்! என் பெயர் ஜான்.',
              },
            },
          ],
        },
        {
          type: 'practice' as const,
          sectionId: 'greet_quiz_001',
          title: {
            en: 'Quick Quiz',
            ta: 'விரைவு வினா',
          },
          questions: [
            {
              questionId: 'q1',
              text: {
                en: 'What do you say when you meet someone in the morning?',
                ta: 'காலையில் ஒருவரைச் சந்திக்கும்போது நீங்கள் என்ன சொல்கிறீர்கள்?',
              },
              options: [
                { optionId: 'a', text: 'Good night', isCorrect: false },
                { optionId: 'b', text: 'Good morning', isCorrect: true },
                { optionId: 'c', text: 'Goodbye', isCorrect: false },
                { optionId: 'd', text: 'See you later', isCorrect: false },
              ],
              feedback: {
                correct: '🎉 Excellent! "Good morning" is used before noon.',
                incorrect: 'Not quite. Think about what time of day it is.',
              },
            },
            {
              questionId: 'q2',
              text: {
                en: 'How do you introduce yourself in English?',
                ta: 'உங்களை ஆங்கிலத்தில் எப்படி அறிமுகப்படுத்துகிறீர்கள்?',
              },
              options: [
                { optionId: 'a', text: 'How are you?', isCorrect: false },
                { optionId: 'b', text: 'My name is [name]', isCorrect: true },
                { optionId: 'c', text: 'Good morning', isCorrect: false },
                { optionId: 'd', text: 'Thank you', isCorrect: false },
              ],
              feedback: {
                correct: '✅ Perfect! "My name is" is the standard introduction.',
                incorrect: 'Try again. How do you tell someone your name?',
              },
            },
          ],
        },
      ],
    },
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    lessonId: `lesson_begin_family`,
    title: {
      en: 'Family & Relationships',
      ta: 'குடும்பம் & உறவுகள்',
    },
    level: 'beginner' as const,
    language: 'en' as const,
    estimatedDuration: 18,
    prepTimeMinutes: 4,
    content: {
      introduction: {
        text: {
          en: "Learn to talk about your family in English! We'll cover parents, siblings, and extended family.",
          ta: 'உங்கள் குடும்பத்தைப் பற்றி ஆங்கிலத்தில் பேசக் கற்றுக் கொள்ளுங்கள்! பெற்றோர், உடன்பிறந்தவர்கள் மற்றும் விரிவாக்கப்பட்ட குடும்பம் பற்றி நாங்கள் உள்ளடக்குவோம்.',
        },
        audioUrl: {
          en: '/audio/lessons/family/intro_en.mp3',
          ta: '/audio/lessons/family/intro_ta.mp3',
        },
        imageUrl: '/images/lessons/family_banner.jpg',
      },
      sections: [
        {
          type: 'vocabulary' as const,
          sectionId: 'family_vocab_001',
          title: {
            en: 'Immediate Family',
            ta: 'நெருங்கிய குடும்பம்',
          },
          items: [
            {
              word: 'Mother',
              translation: 'அம்மா',
              phoneticEn: 'ˈmʌð-ər',
              phoneticTa: 'ammā',
              audioUrl: '/audio/vocab/mother_en.mp3',
              exampleSentence: {
                en: 'My mother is a doctor.',
                ta: 'என் அம்மா ஒரு மருத்துவர்.',
              },
            },
            {
              word: 'Father',
              translation: 'அப்பா',
              phoneticEn: 'ˈfɑː-ðər',
              phoneticTa: 'appā',
              audioUrl: '/audio/vocab/father_en.mp3',
              exampleSentence: {
                en: 'My father works in a bank.',
                ta: 'என் அப்பா ஒரு வங்கியில் வேலை செய்கிறார்.',
              },
            },
            {
              word: 'Sister',
              translation: 'சகோதரி',
              phoneticEn: 'ˈsɪs-tər',
              phoneticTa: 'sakōtari',
              audioUrl: '/audio/vocab/sister_en.mp3',
              exampleSentence: {
                en: 'I have one younger sister.',
                ta: 'எனக்கு ஒரு தங்கை இருக்கிறாள்.',
              },
            },
            {
              word: 'Brother',
              translation: 'சகோதரன்',
              phoneticEn: 'ˈbrʌð-ər',
              phoneticTa: 'sakōtaraṉ',
              audioUrl: '/audio/vocab/brother_en.mp3',
              exampleSentence: {
                en: 'My brother is in college.',
                ta: 'என் அண்ணன் கல்லூரியில் படிக்கிறான்.',
              },
            },
          ],
        },
        {
          type: 'practice' as const,
          sectionId: 'family_quiz_001',
          title: {
            en: 'Family Quiz',
            ta: 'குடும்ப வினா',
          },
          questions: [
            {
              questionId: 'fq1',
              text: {
                en: 'What do you call your female parent?',
                ta: 'உங்கள் பெண் பெற்றோரை என்ன அழைக்கிறீர்கள்?',
              },
              options: [
                { optionId: 'a', text: 'Sister', isCorrect: false },
                { optionId: 'b', text: 'Mother', isCorrect: true },
                { optionId: 'c', text: 'Aunt', isCorrect: false },
                { optionId: 'd', text: 'Grandmother', isCorrect: false },
              ],
              feedback: {
                correct: '🎯 Correct! Your female parent is your mother.',
                incorrect: 'Not quite. Your female parent is your mother (or mom/mum).',
              },
            },
          ],
        },
      ],
    },
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    lessonId: `lesson_begin_food`,
    title: {
      en: 'Food & Dining',
      ta: 'உணவு & உணவருந்துதல்',
    },
    level: 'beginner' as const,
    language: 'en' as const,
    estimatedDuration: 20,
    prepTimeMinutes: 5,
    content: {
      introduction: {
        text: {
          en: "Food connects us all! Learn essential vocabulary for meals, common foods, and dining out.",
          ta: 'உணவு நம் அனைவரையும் இணைக்கிறது! உணவுகள், பொதுவான உணவுப் பொருட்கள் மற்றும் வெளியில் உணவருந்துவதற்கான அத்தியாவசிய சொற்களைக் கற்றுக் கொள்ளுங்கள்.',
        },
        audioUrl: {
          en: '/audio/lessons/food/intro_en.mp3',
          ta: '/audio/lessons/food/intro_ta.mp3',
        },
        imageUrl: '/images/lessons/food_banner.jpg',
      },
      sections: [
        {
          type: 'vocabulary' as const,
          sectionId: 'food_vocab_001',
          title: {
            en: 'Meals of the Day',
            ta: 'நாளின் உணவுகள்',
          },
          items: [
            {
              word: 'Breakfast',
              translation: 'காலை உணவு',
              phoneticEn: 'ˈbrek-fəst',
              phoneticTa: 'kālai uṇavu',
              audioUrl: '/audio/vocab/breakfast_en.mp3',
              exampleSentence: {
                en: 'I eat breakfast at 7 AM.',
                ta: 'நான் காலை 7 மணிக்கு காலை உணவு சாப்பிடுகிறேன்.',
              },
            },
            {
              word: 'Lunch',
              translation: 'மதிய உணவு',
              phoneticEn: 'lʌntʃ',
              phoneticTa: 'matiya uṇavu',
              audioUrl: '/audio/vocab/lunch_en.mp3',
              exampleSentence: {
                en: "Let's have lunch together.",
                ta: 'நாம் ஒன்றாக மதிய உணவு சாப்பிடலாம்.',
              },
            },
            {
              word: 'Dinner',
              translation: 'இரவு உணவு',
              phoneticEn: 'ˈdɪn-ər',
              phoneticTa: 'iravu uṇavu',
              audioUrl: '/audio/vocab/dinner_en.mp3',
              exampleSentence: {
                en: 'Dinner is at 8 PM tonight.',
                ta: 'இன்று இரவு இரவு உணவு 8 மணிக்கு.',
              },
            },
          ],
        },
        {
          type: 'practice' as const,
          sectionId: 'food_quiz_001',
          title: {
            en: 'Meal Time Quiz',
            ta: 'உணவு நேர வினா',
          },
          questions: [
            {
              questionId: 'foodq1',
              text: {
                en: 'What is the first meal of the day called?',
                ta: 'நாளின் முதல் உணவு என்ன என்று அழைக்கப்படுகிறது?',
              },
              options: [
                { optionId: 'a', text: 'Dinner', isCorrect: false },
                { optionId: 'b', text: 'Lunch', isCorrect: false },
                { optionId: 'c', text: 'Breakfast', isCorrect: true },
                { optionId: 'd', text: 'Snack', isCorrect: false },
              },
            feedback: {
              correct: '🍳 Perfect! Breakfast is the first meal, eaten in the morning.',
              incorrect: 'Think about when you wake up - the first meal is breakfast!',
            },
            },
      ],
    },
      ],
    },
createdBy: 'system',
  createdAt: new Date(),
    updatedAt: new Date(),
  },

// === INTERMEDIATE LESSON ===
{
  lessonId: `lesson_inter_shopping`,
    title: {
    en: 'Shopping & Money',
      ta: 'ஷாப்பிங் & பணம்',
    },
  level: 'intermediate' as const,
    language: 'en' as const,
      estimatedDuration: 25,
        prepTimeMinutes: 6,
          content: {
    introduction: {
      text: {
        en: "Master the art of shopping in English! Learn phrases for prices, payment, and making purchases.",
          ta: 'ஆங்கிலத்தில் ஷாப்பிங் செய்யும் கலையை மாஸ்டர் செய்யுங்கள்! விலைகள், பணம் செலுத்துதல் மற்றும் கொள்முதல் செய்வதற்கான சொற்றொடர்களைக் கற்றுக் கொள்ளுங்கள்.',
        },
      audioUrl: {
        en: '/audio/lessons/shopping/intro_en.mp3',
          ta: '/audio/lessons/shopping/intro_ta.mp3',
        },
      imageUrl: '/images/lessons/shopping_banner.jpg',
      },
    sections: [
      {
        type: 'vocabulary' as const,
        sectionId: 'shop_vocab_001',
        title: {
          en: 'Shopping Phrases',
          ta: 'ஷாப்பிங் சொற்றொடர்கள்',
        },
        items: [
          {
            word: 'How much is this?',
            translation: 'இது எவ்வளவு?',
            phoneticEn: 'haʊ mʌtʃ ɪz ðɪs',
            phoneticTa: 'itu evvaḷavu',
            audioUrl: '/audio/vocab/how_much_en.mp3',
            exampleSentence: {
              en: 'Excuse me, how much is this shirt?',
              ta: 'மன்னிக்கவும், இந்த சட்டை எவ்வளவு?',
            },
          },
          {
            word: 'I would like to buy',
            translation: 'நான் வாங்க விரும்புகிறேன்',
            phoneticEn: 'aɪ wʊd laɪk tuː baɪ',
            phoneticTa: 'nāṉ vāṅka virumpukiṟēṉ',
            audioUrl: '/audio/vocab/would_like_en.mp3',
            exampleSentence: {
              en: 'I would like to buy two apples, please.',
              ta: 'தயவுசெய்து இரண்டு ஆப்பிள்களை வாங்க விரும்புகிறேன்.',
            },
          },
        ],
      },
      {
        type: 'practice' as const,
        sectionId: 'shop_quiz_001',
        title: {
          en: 'Shopping Scenarios',
          ta: 'ஷாப்பிங் காட்சிகள்',
        },
        questions: [
          {
            questionId: 'shopq1',
            text: {
              en: 'You want to know the price. What do you say?',
              ta: 'விலையை தெரிந்து கொள்ள விரும்புகிறீர்கள். நீங்கள் என்ன சொல்கிறீர்கள்?',
            },
            options: [
              { optionId: 'a', text: 'How are you?', isCorrect: false },
              { optionId: 'b', text: 'How much is this?', isCorrect: true },
              { optionId: 'c', text: 'Where is this?', isCorrect: false },
              { optionId: 'd', text: 'Who made this?', isCorrect: false },
            ],
            feedback: {
              correct: '💰 Excellent! "How much is this?" asks for the price.',
              incorrect: 'To ask about price, say "How much is this?"',
            },
          },
        ],
      },
    ],
    },
  createdBy: 'system',
    createdAt: new Date(),
      updatedAt: new Date(),
  },
];

async function main() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await dbConnect();
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing lessons...');
    const deleteResult = await Lesson.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} old lessons`);

    console.log('📚 Inserting professional lessons...');
    const insertedLessons = await Lesson.insertMany(professionalLessons);
    console.log(`✅ Inserted ${insertedLessons.length} professional lessons`);

    console.log('\n📖 Lesson Summary:');
    for (const lesson of insertedLessons) {
      const levelEmoji = lesson.level === 'beginner' ? '🟢' : lesson.level === 'intermediate' ? '🟡' : '🔴';
      console.log(`   ${levelEmoji} [${lesson.level.toUpperCase()}] ${lesson.title.en}`);
      console.log(`      ID: ${lesson.lessonId}`);
      console.log(`      Duration: ${lesson.estimatedDuration} min\n`);
    }

    console.log('🎉 Professional lesson seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding lessons:', error);
    process.exit(1);
  }
}

main();