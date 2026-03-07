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
                    items: [
                        {
                            word: 'Mother',
                            translation: 'அம்மா',
                            phoneticEn: 'ˈmʌð-ər',
                            phoneticTa: 'ammā',
                            audioUrl: null,
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
    // ─── BEGINNER: Numbers & Counting ───
    {
        lessonId: 'lesson_begin_numbers',
        title: { en: 'Numbers & Counting', ta: 'எண்கள் மற்றும் எண்ணுதல்' },
        level: 'beginner', language: 'en', estimatedDuration: 12, prepTimeMinutes: 2,
        content: {
            introduction: { text: { en: 'Learn to count from 1-20 and use numbers in daily life.', ta: '1 முதல் 20 வரை எண்ணக் கற்றுக்கொள்ளுங்கள்!' }, audioUrl: { en: null, ta: null }, imageUrl: null },
            sections: [{ type: 'vocabulary', sectionId: 'num_vocab_001', title: { en: 'Numbers 1-10', ta: 'எண்கள் 1-10' }, items: [
                { word: 'One', translation: 'ஒன்று', phoneticEn: 'wʌn', phoneticTa: 'oṉṟu', audioUrl: null, exampleSentence: { en: 'I have one apple.', ta: 'என்னிடம் ஒரு ஆப்பிள் உள்ளது.' } },
                { word: 'Two', translation: 'இரண்டு', phoneticEn: 'tuː', phoneticTa: 'iraṇṭu', audioUrl: null, exampleSentence: { en: 'I have two books.', ta: 'என்னிடம் இரண்டு புத்தகங்கள் உள்ளன.' } },
                { word: 'Three', translation: 'மூன்று', phoneticEn: 'θriː', phoneticTa: 'mūṉṟu', audioUrl: null, exampleSentence: { en: 'Three plus two is five.', ta: 'மூன்று கூட்டல் இரண்டு சமம் ஐந்து.' } },
            ]}],
        },
        createdBy: 'system', createdAt: new Date(), updatedAt: new Date(),
    },
    // ─── BEGINNER: Colors & Shapes ───
    {
        lessonId: 'lesson_begin_colors',
        title: { en: 'Colors & Shapes', ta: 'நிறங்கள் மற்றும் வடிவங்கள்' },
        level: 'beginner', language: 'en', estimatedDuration: 10, prepTimeMinutes: 2,
        content: {
            introduction: { text: { en: 'Discover the names of colors and basic shapes around you.', ta: 'உங்களைச் சுற்றியுள்ள நிறங்கள் மற்றும் வடிவங்களைக் கற்றுக்கொள்ளுங்கள்.' }, audioUrl: { en: null, ta: null }, imageUrl: null },
            sections: [{ type: 'vocabulary', sectionId: 'color_vocab_001', title: { en: 'Primary Colors', ta: 'முதன்மை நிறங்கள்' }, items: [
                { word: 'Red', translation: 'சிவப்பு', phoneticEn: 'rɛd', phoneticTa: 'civappu', audioUrl: null, exampleSentence: { en: 'The apple is red.', ta: 'ஆப்பிள் சிவப்பு.' } },
                { word: 'Blue', translation: 'நீலம்', phoneticEn: 'bluː', phoneticTa: 'nīlam', audioUrl: null, exampleSentence: { en: 'The sky is blue.', ta: 'வானம் நீலம்.' } },
                { word: 'Green', translation: 'பச்சை', phoneticEn: 'ɡriːn', phoneticTa: 'paccai', audioUrl: null, exampleSentence: { en: 'The leaves are green.', ta: 'இலைகள் பச்சை.' } },
            ]}],
        },
        createdBy: 'system', createdAt: new Date(), updatedAt: new Date(),
    },
    // ─── BEGINNER TAMIL: தமிழ் எழுத்துக்கள் (Tamil Alphabet) ───
    {
        lessonId: 'lesson_begin_tamil_alphabet',
        title: { en: 'Tamil Alphabet Basics', ta: 'தமிழ் எழுத்துக்கள் அடிப்படை' },
        level: 'beginner', language: 'ta', estimatedDuration: 20, prepTimeMinutes: 5,
        content: {
            introduction: { text: { en: 'Learn the Tamil vowels (உயிரெழுத்துக்கள்) — the foundation of Tamil script.', ta: 'தமிழ் உயிரெழுத்துக்களைக் கற்றுக் கொள்ளுங்கள்!' }, audioUrl: { en: null, ta: null }, imageUrl: null },
            sections: [{ type: 'vocabulary', sectionId: 'ta_alpha_001', title: { en: 'Tamil Vowels', ta: 'உயிரெழுத்துக்கள்' }, items: [
                { word: 'அ', translation: 'a (as in "about")', phoneticEn: 'a', phoneticTa: 'a', audioUrl: null, exampleSentence: { en: 'அம்மா (Mother)', ta: 'அம்மா' } },
                { word: 'ஆ', translation: 'aa (as in "father")', phoneticEn: 'aː', phoneticTa: 'ā', audioUrl: null, exampleSentence: { en: 'ஆடு (Goat)', ta: 'ஆடு' } },
                { word: 'இ', translation: 'i (as in "if")', phoneticEn: 'ɪ', phoneticTa: 'i', audioUrl: null, exampleSentence: { en: 'இலை (Leaf)', ta: 'இலை' } },
            ]}],
        },
        createdBy: 'system', createdAt: new Date(), updatedAt: new Date(),
    },
    // ─── BEGINNER TAMIL: Daily Words ───
    {
        lessonId: 'lesson_begin_tamil_daily',
        title: { en: 'Tamil Daily Words', ta: 'அன்றாட வார்த்தைகள்' },
        level: 'beginner', language: 'ta', estimatedDuration: 15, prepTimeMinutes: 3,
        content: {
            introduction: { text: { en: 'Learn essential Tamil words used in everyday conversations.', ta: 'அன்றாட உரையாடலில் பயன்படுத்தப்படும் அத்தியாவசிய தமிழ் வார்த்தைகளைக் கற்றுக் கொள்ளுங்கள்.' }, audioUrl: { en: null, ta: null }, imageUrl: null },
            sections: [{ type: 'vocabulary', sectionId: 'ta_daily_001', title: { en: 'Everyday Words', ta: 'அன்றாட வார்த்தைகள்' }, items: [
                { word: 'தண்ணீர்', translation: 'Water', phoneticEn: 'water', phoneticTa: 'taṇṇīr', audioUrl: null, exampleSentence: { en: 'Please give me water.', ta: 'தயவுசெய்து தண்ணீர் கொடுங்கள்.' } },
                { word: 'உணவு', translation: 'Food', phoneticEn: 'food', phoneticTa: 'uṇavu', audioUrl: null, exampleSentence: { en: 'The food is delicious.', ta: 'உணவு சுவையாக உள்ளது.' } },
                { word: 'வீடு', translation: 'Home', phoneticEn: 'home', phoneticTa: 'vīṭu', audioUrl: null, exampleSentence: { en: 'I am going home.', ta: 'நான் வீட்டுக்குச் செல்கிறேன்.' } },
            ]}],
        },
        createdBy: 'system', createdAt: new Date(), updatedAt: new Date(),
    },
    // ─── INTERMEDIATE: Daily Routines ───
    {
        lessonId: 'lesson_inter_routines',
        title: { en: 'Daily Routines & Habits', ta: 'தினசரி பழக்கவழக்கங்கள்' },
        level: 'intermediate', language: 'en', estimatedDuration: 20, prepTimeMinutes: 4,
        content: {
            introduction: { text: { en: 'Describe your daily activities using present tense and time expressions.', ta: 'நிகழ்கால மற்றும் நேர வெளிப்பாடுகளைப் பயன்படுத்தி உங்கள் அன்றாட நடவடிக்கைகளை விவரிக்கவும்.' }, audioUrl: { en: null, ta: null }, imageUrl: null },
            sections: [{ type: 'vocabulary', sectionId: 'routine_vocab_001', title: { en: 'Morning Routine', ta: 'காலை நடவடிக்கை' }, items: [
                { word: 'Wake up', translation: 'எழுந்திரு', phoneticEn: 'weɪk ʌp', phoneticTa: 'eḻuntiru', audioUrl: null, exampleSentence: { en: 'I wake up at 7 AM.', ta: 'நான் காலை 7 மணிக்கு எழுந்திருக்கிறேன்.' } },
                { word: 'Brush my teeth', translation: 'பல் தேய்', phoneticEn: 'brʌʃ maɪ tiːθ', phoneticTa: 'pal tēy', audioUrl: null, exampleSentence: { en: 'I brush my teeth every morning.', ta: 'நான் ஒவ்வொரு காலையும் பல் தேய்க்கிறேன்.' } },
            ]}],
        },
        createdBy: 'system', createdAt: new Date(), updatedAt: new Date(),
    },
    // ─── INTERMEDIATE: Shopping & Money ───
    {
        lessonId: 'lesson_inter_shopping',
        title: { en: 'Shopping & Money', ta: 'கடை மற்றும் பணம்' },
        level: 'intermediate', language: 'en', estimatedDuration: 20, prepTimeMinutes: 4,
        content: {
            introduction: { text: { en: 'Learn how to shop, bargain, and handle money conversations.', ta: 'கடையில் பேசவும், பேரம் பேசவும், பணம் தொடர்பான உரையாடல்களைக் கையாளவும் கற்றுக்கொள்ளுங்கள்.' }, audioUrl: { en: null, ta: null }, imageUrl: null },
            sections: [{ type: 'vocabulary', sectionId: 'shop_vocab_001', title: { en: 'At the Shop', ta: 'கடையில்' }, items: [
                { word: 'How much?', translation: 'எவ்வளவு?', phoneticEn: 'haʊ mʌtʃ', phoneticTa: 'evvaḷavu', audioUrl: null, exampleSentence: { en: 'How much does this cost?', ta: 'இது எவ்வளவு?' } },
                { word: 'Too expensive', translation: 'மிகவும் விலை அதிகம்', phoneticEn: 'tuː ɪkˈspɛnsɪv', phoneticTa: 'mikavum vilai atikam', audioUrl: null, exampleSentence: { en: 'This is too expensive for me.', ta: 'இது எனக்கு மிகவும் விலை அதிகம்.' } },
            ]}],
        },
        createdBy: 'system', createdAt: new Date(), updatedAt: new Date(),
    },
    // ─── INTERMEDIATE: Travel & Directions ───
    {
        lessonId: 'lesson_inter_travel',
        title: { en: 'Travel & Directions', ta: 'பயணமும் திசைகளும்' },
        level: 'intermediate', language: 'en', estimatedDuration: 18, prepTimeMinutes: 3,
        content: {
            introduction: { text: { en: 'Navigate around town, ask for directions, and talk about travel plans.', ta: 'நகரத்தில் சுற்றவும், திசைகளைக் கேட்கவும், பயண திட்டங்களைப் பற்றி பேசவும் கற்றுக்கொள்ளுங்கள்.' }, audioUrl: { en: null, ta: null }, imageUrl: null },
            sections: [{ type: 'vocabulary', sectionId: 'travel_vocab_001', title: { en: 'Asking Directions', ta: 'திசைகளைக் கேட்குதல்' }, items: [
                { word: 'Where is...?', translation: 'எங்கே உள்ளது...?', phoneticEn: 'wɛr ɪz', phoneticTa: 'eṅkē uḷḷatu', audioUrl: null, exampleSentence: { en: 'Where is the train station?', ta: 'ரயில் நிலையம் எங்கே உள்ளது?' } },
                { word: 'Turn left', translation: 'இடது பக்கம் திரும்பு', phoneticEn: 'tɜːrn lɛft', phoneticTa: 'iṭatu pakkam tirumpu', audioUrl: null, exampleSentence: { en: 'Turn left at the signal.', ta: 'சிக்னலில் இடது பக்கம் திரும்புங்கள்.' } },
            ]}],
        },
        createdBy: 'system', createdAt: new Date(), updatedAt: new Date(),
    },
    // ─── ADVANCED: Business English ───
    {
        lessonId: 'lesson_adv_business',
        title: { en: 'Business English', ta: 'வணிக ஆங்கிலம்' },
        level: 'advanced', language: 'en', estimatedDuration: 25, prepTimeMinutes: 5,
        content: {
            introduction: { text: { en: 'Master professional communication: emails, presentations, and negotiations.', ta: 'தொழில்முறை தகவல்தொடர்பை முழுமையாகக் கற்றுக் கொள்ளுங்கள்.' }, audioUrl: { en: null, ta: null }, imageUrl: null },
            sections: [{ type: 'vocabulary', sectionId: 'biz_vocab_001', title: { en: 'Email Phrases', ta: 'மின்னஞ்சல் சொற்றொடர்கள்' }, items: [
                { word: 'I am writing to inform you', translation: 'உங்களுக்குத் தெரிவிக்க எழுதுகிறேன்', phoneticEn: 'aɪ æm ˈraɪtɪŋ tuː ɪnˈfɔːrm juː', phoneticTa: 'uṅkaḷukkut terivikka eḻutukiṟēṉ', audioUrl: null, exampleSentence: { en: 'I am writing to inform you about the meeting.', ta: 'கூட்டத்தைப் பற்றி உங்களுக்குத் தெரிவிக்க எழுதுகிறேன்.' } },
                { word: 'Please find attached', translation: 'இணைக்கப்பட்டதைக் காண்க', phoneticEn: 'pliːz faɪnd əˈtætʃt', phoneticTa: 'iṇaikkappattataik kāṇka', audioUrl: null, exampleSentence: { en: 'Please find attached the quarterly report.', ta: 'காலாண்டு அறிக்கை இணைக்கப்பட்டதைக் காணவும்.' } },
            ]}],
        },
        createdBy: 'system', createdAt: new Date(), updatedAt: new Date(),
    },
    // ─── ADVANCED: Literature & Poetry ───
    {
        lessonId: 'lesson_adv_literature',
        title: { en: 'Literature & Storytelling', ta: 'இலக்கியம் மற்றும் கதைசொல்லல்' },
        level: 'advanced', language: 'en', estimatedDuration: 30, prepTimeMinutes: 5,
        content: {
            introduction: { text: { en: 'Explore literary devices, narrative structures, and the art of storytelling.', ta: 'இலக்கிய உத்திகள், கதைப் புனைவுகள் மற்றும் கதைசொல்லலின் கலையை ஆராயுங்கள்.' }, audioUrl: { en: null, ta: null }, imageUrl: null },
            sections: [{ type: 'vocabulary', sectionId: 'lit_vocab_001', title: { en: 'Literary Terms', ta: 'இலக்கிய சொற்கள்' }, items: [
                { word: 'Metaphor', translation: 'உருவகம்', phoneticEn: 'ˈmɛt.ə.fɔːr', phoneticTa: 'uruvakam', audioUrl: null, exampleSentence: { en: 'Life is a journey — a metaphor we all understand.', ta: 'வாழ்க்கை ஒரு பயணம் — நாம் அனைவரும் புரிந்துகொள்ளும் ஒரு உருவகம்.' } },
                { word: 'Protagonist', translation: 'கதாநாயகன்', phoneticEn: 'prəˈtæɡ.ə.nɪst', phoneticTa: 'katānāyakaṉ', audioUrl: null, exampleSentence: { en: 'The protagonist overcame many challenges.', ta: 'கதாநாயகன் பல சவால்களை வென்றான்.' } },
            ]}],
        },
        createdBy: 'system', createdAt: new Date(), updatedAt: new Date(),
    },
];

async function seedLessons() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await dbConnect();
        console.log('✅ Connected');

        console.log('📚 Seeding lessons...');
        await Lesson.deleteMany({});
        
        // Ensure all lessons have required schema fields before inserting
        const validLessons = lessons.map(lesson => {
            // Add teachingGuide if missing
            if (!lesson.teachingGuide) {
                lesson.teachingGuide = {
                    overview: { en: 'Basic overview', ta: 'அடிப்படை கண்ணோட்டம்' },
                    learningObjectives: { en: ['Learn basics'], ta: ['அடிப்படைகளை அறிக'] },
                    steps: [{
                        stepNumber: 1,
                        title: 'Introduction',
                        durationMinutes: 5,
                        script: 'Welcome to the lesson.',
                        materialsNeeded: [],
                        adaptations: {}
                    }]
                };
            }
            
            // Ensure all sections have items
            if (lesson.content && lesson.content.sections) {
                lesson.content.sections = lesson.content.sections.map(sec => {
                    if (!sec.items) sec.items = [];
                    return sec;
                });
            }
            
            return lesson;
        });

        const result = await Lesson.insertMany(validLessons);

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
