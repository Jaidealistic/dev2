import('dotenv/config');
import dbConnect from '../lib/mongodb.js';
import Lesson from '../lib/models/Lesson.js';

/**
 * Professional lesson seeding - Run with: npm run seed:lessons
 */

const lessons = [
    {
        lessonId: 'lesson_begin_greetings',
        title: {
            en: 'Greetings & Introductions',
            ta: 'வணக்கங்களும் அறிமுகங்களும்',
        },
        level: 'beginner',
        language: 'en',
        estimatedDuration: 15,
        prepTimeMinutes: 3,
        content: {
            introduction: {
                text: {
                    en: "Master essential English greetings! You'll learn how to say hello, introduce yourself, and make a great first impression.",
                    ta: 'அத்தியாவசிய ஆங்கில வாழ்த்துக்களை முழுமையாகக் கற்றுக் கொள்ளுங்கள்!',
                },
                audioUrl: { en: null, ta: null },
                imageUrl: null,
            },
            sections: [
                {
                    type: 'vocabulary',
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
                            audioUrl: null,
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
                            audioUrl: null,
                            exampleSentence: {
                                en: 'Good morning, everyone!',
                                ta: 'காலை வணக்கம், அனைவருக்கும்!',
                            },
                        },
                        {
                            word: 'My name is',
                            translation: 'என் பெயர்',
                            phoneticEn: 'maɪ neɪm ɪz',
                            phoneticTa: 'en peyar',
                            audioUrl: null,
                            exampleSentence: {
                                en: 'Hi! My name is John.',
                                ta: 'ஹாய்! என் பெயர் ஜான்.',
                            },
                        },
                    ],
                },
                {
                    type: 'practice',
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
                    ],
                },
            ],
        },
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        lessonId: 'lesson_begin_family',
        title: {
            en: 'Family & Relationships',
            ta: 'குடும்பம் & உறவுகள்',
        },
        level: 'beginner',
        language: 'en',
        estimatedDuration: 18,
        prepTimeMinutes: 4,
        content: {
            introduction: {
                text: {
                    en: "Learn to talk about your family in English! We'll cover parents, siblings, and extended family.",
                    ta: 'உங்கள் குடும்பத்தைப் பற்றி ஆங்கிலத்தில் பேசக் கற்றுக் கொள்ளுங்கள்!',
                },
                audioUrl: { en: null, ta: null },
                imageUrl: null,
            },
            sections: [
                {
                    type: 'vocabulary',
                    sectionId: 'family_vocab_001',
                    title: {
                        en: 'Immediate Family',
                        ta: 'நெருங்கிய குடும்பம்',
                    },
                    items: [\
                        {
                            word: 'Mother',
                            translation: 'அம்மா',
                            phoneticEn: 'ˈmʌð-ər',
                            phoneticTa: 'ammā',
                            audioUrl: null,
                            exampleSentence: {
                                en: 'My mother is a doctor.',
                                ta: 'என் அ

ம்மா ஒரு மருத்துவர்.',
              },
                        },
                        {
                            word: 'Father',
                            translation: 'அப்பா',
                            phoneticEn: 'ˈfɑː-ðər',
                            phoneticTa: 'appā',
                            audioUrl: null,
                            exampleSentence: {
                                en: 'My father works in a bank.',
                                ta: 'என் அப்பா ஒரு வங்கியில் வேலை செய்கிறார்.',
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

async function seedLessons() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await dbConnect();
        console.log('✅ Connected');

        console.log('📚 Seeding lessons...');
        await Lesson.deleteMany({});
        const result = await Lesson.insertMany(lessons);

        console.log(`✅ Inserted ${result.length} lessons!`);
        console.log('\n📖 Lesson IDs:');
        result.forEach(l => console.log(`   - ${l.lessonId}: ${l.title.en}`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

seedLessons();
