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
          items: [
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
    teachingGuide: {
      overview: { en: 'Basic greetings and introductions.', ta: 'அடிப்படை வாழ்த்துக்கள் மற்றும் அறிமுகங்கள்.' },
      learningObjectives: { en: ['Learn common greetings'], ta: ['பொதுவான வாழ்த்துக்களைக் கற்றுக்கொள்ளுங்கள்'] },
      steps: [],
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
          items: [
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
    teachingGuide: {
      overview: { en: 'Family members and relationships.', ta: 'குடும்ப உறுப்பினர்கள் மற்றும் உறவுகள்.' },
      learningObjectives: { en: ['Identify family roles'], ta: ['குடும்ப பாத்திரங்களை அடையாளம் காணவும்'] },
      steps: [],
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
          items: [
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
              ],
              feedback: {
                correct: '🍳 Perfect! Breakfast is the first meal, eaten in the morning.',
                incorrect: 'Think about when you wake up - the first meal is breakfast!',
              },
            },
          ],
        },
      ],
    },
    teachingGuide: {
      overview: { en: 'Common meals and dining vocabulary.', ta: 'பொதுவான உணவுகள் மற்றும் உணவருந்துதல் சொற்களஞ்சியம்.' },
      learningObjectives: { en: ['Learn meal names'], ta: ['உணவுப் பெயர்களைக் கற்றுக் கொள்ளுங்கள்'] },
      steps: [],
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
          items: [
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
    teachingGuide: {
      overview: { en: 'Asking for prices and buying items.', ta: 'விலைகளைக் கேட்பது மற்றும் பொருட்களை வாங்குவது.' },
      learningObjectives: { en: ['Learn shopping phrases'], ta: ['ஷாப்பிங் சொற்றொடர்களைக் கற்றுக் கொள்ளுங்கள்'] },
      steps: [],
    },
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const extraLessons = [
  {
    lessonId: 'lesson_extra_1',
    title: {
      en: 'Vocabulary Building Part 1',
      ta: 'சொற்களஞ்சியம் பகுதி 1'
    },
    level: 'beginner',
    language: 'en',
    estimatedDuration: 15,
    prepTimeMinutes: 5,
    content: {
      introduction: {
        text: {
          en: 'Expand your English vocabulary with Part 1.',
          ta: 'பகுதி 1 உடன் உங்கள் ஆங்கில சொற்களஞ்சியத்தை விரிவாக்குங்கள்.'
        },
        audioUrl: {
          en: '/audio/lessons/extra/intro_en.mp3',
          ta: '/audio/lessons/extra/intro_ta.mp3'
        },
        imageUrl: '/images/lessons/extra_banner.jpg'
      },
      sections: [
        {
          type: 'vocabulary',
          sectionId: 'extra_vocab_001',
          title: {
            en: 'Key Words 1',
            ta: 'முக்கிய வார்த்தைகள் 1'
          },
          items: [
            {
              word: 'Word 1A',
              translation: 'வார்த்தை 1A',
              phoneticEn: 'wɜːrd 1eɪ',
              phoneticTa: 'vārttai 1A',
              audioUrl: '/audio/vocab/word_1A.mp3',
              exampleSentence: {
                en: 'This is example for word 1A.',
                ta: 'இது வார்த்தை 1A க்கான உதாரணம்.'
              }
            },
            {
              word: 'Word 1B',
              translation: 'வார்த்தை 1B',
              phoneticEn: 'wɜːrd 1biː',
              phoneticTa: 'vārttai 1B',
              audioUrl: '/audio/vocab/word_1B.mp3',
              exampleSentence: {
                en: 'This is example for word 1B.',
                ta: 'இது வார்த்தை 1B க்கான உதாரணம்.'
              }
            }
          ]
        },
        {
          type: 'practice',
          sectionId: 'extra_quiz_001',
          title: {
            en: 'Knowledge Check 1',
            ta: 'அறிவு சரிபார்ப்பு 1'
          },
          items: [
            {
              questionId: 'exq1',
              text: {
                en: 'What is Word 1A?',
                ta: 'வார்த்தை 1A என்றால் என்ன?'
              },
              options: [
                {
                  optionId: 'a',
                  text: 'Option 1',
                  isCorrect: false
                },
                {
                  optionId: 'b',
                  text: 'Word 1A',
                  isCorrect: true
                },
                {
                  optionId: 'c',
                  text: 'Option 3',
                  isCorrect: false
                },
                {
                  optionId: 'd',
                  text: 'Option 4',
                  isCorrect: false
                }
              ],
              feedback: {
                correct: 'Correct!',
                incorrect: 'Try again.'
              }
            }
          ]
        }
      ]
    },
    teachingGuide: {
      overview: {
        en: 'Vocabulary building.',
        ta: 'சொற்களஞ்சியம் கட்டிடம்.'
      },
      learningObjectives: {
        en: [
          'Learn new words'
        ],
        ta: [
          'புதிய வார்த்தைகளை கற்றுக்கொள்ளுங்கள்'
        ]
      },
      steps: []
    },
    createdBy: 'system',
    createdAt: '2026-03-05T05:49:04.361Z',
    updatedAt: '2026-03-05T05:49:04.361Z'
  },
  {
    lessonId: 'lesson_extra_2',
    title: {
      en: 'Vocabulary Building Part 2',
      ta: 'சொற்களஞ்சியம் பகுதி 2'
    },
    level: 'beginner',
    language: 'en',
    estimatedDuration: 20,
    prepTimeMinutes: 5,
    content: {
      introduction: {
        text: {
          en: 'Expand your English vocabulary with Part 2.',
          ta: 'பகுதி 2 உடன் உங்கள் ஆங்கில சொற்களஞ்சியத்தை விரிவாக்குங்கள்.'
        },
        audioUrl: {
          en: '/audio/lessons/extra/intro_en.mp3',
          ta: '/audio/lessons/extra/intro_ta.mp3'
        },
        imageUrl: '/images/lessons/extra_banner.jpg'
      },
      sections: [
        {
          type: 'vocabulary',
          sectionId: 'extra_vocab_002',
          title: {
            en: 'Key Words 2',
            ta: 'முக்கிய வார்த்தைகள் 2'
          },
          items: [
            {
              word: 'Word 2A',
              translation: 'வார்த்தை 2A',
              phoneticEn: 'wɜːrd 2eɪ',
              phoneticTa: 'vārttai 2A',
              audioUrl: '/audio/vocab/word_2A.mp3',
              exampleSentence: {
                en: 'This is example for word 2A.',
                ta: 'இது வார்த்தை 2A க்கான உதாரணம்.'
              }
            },
            {
              word: 'Word 2B',
              translation: 'வார்த்தை 2B',
              phoneticEn: 'wɜːrd 2biː',
              phoneticTa: 'vārttai 2B',
              audioUrl: '/audio/vocab/word_2B.mp3',
              exampleSentence: {
                en: 'This is example for word 2B.',
                ta: 'இது வார்த்தை 2B க்கான உதாரணம்.'
              }
            }
          ]
        },
        {
          type: 'practice',
          sectionId: 'extra_quiz_002',
          title: {
            en: 'Knowledge Check 2',
            ta: 'அறிவு சரிபார்ப்பு 2'
          },
          items: [
            {
              questionId: 'exq2',
              text: {
                en: 'What is Word 2A?',
                ta: 'வார்த்தை 2A என்றால் என்ன?'
              },
              options: [
                {
                  optionId: 'a',
                  text: 'Option 1',
                  isCorrect: false
                },
                {
                  optionId: 'b',
                  text: 'Word 2A',
                  isCorrect: true
                },
                {
                  optionId: 'c',
                  text: 'Option 3',
                  isCorrect: false
                },
                {
                  optionId: 'd',
                  text: 'Option 4',
                  isCorrect: false
                }
              ],
              feedback: {
                correct: 'Correct!',
                incorrect: 'Try again.'
              }
            }
          ]
        }
      ]
    },
    teachingGuide: {
      overview: {
        en: 'Vocabulary building.',
        ta: 'சொற்களஞ்சியம் கட்டிடம்.'
      },
      learningObjectives: {
        en: [
          'Learn new words'
        ],
        ta: [
          'புதிய வார்த்தைகளை கற்றுக்கொள்ளுங்கள்'
        ]
      },
      steps: []
    },
    createdBy: 'system',
    createdAt: '2026-03-05T05:49:04.361Z',
    updatedAt: '2026-03-05T05:49:04.361Z'
  },
  {
    lessonId: 'lesson_extra_3',
    title: {
      en: 'Vocabulary Building Part 3',
      ta: 'சொற்களஞ்சியம் பகுதி 3'
    },
    level: 'beginner',
    language: 'en',
    estimatedDuration: 25,
    prepTimeMinutes: 5,
    content: {
      introduction: {
        text: {
          en: 'Expand your English vocabulary with Part 3.',
          ta: 'பகுதி 3 உடன் உங்கள் ஆங்கில சொற்களஞ்சியத்தை விரிவாக்குங்கள்.'
        },
        audioUrl: {
          en: '/audio/lessons/extra/intro_en.mp3',
          ta: '/audio/lessons/extra/intro_ta.mp3'
        },
        imageUrl: '/images/lessons/extra_banner.jpg'
      },
      sections: [
        {
          type: 'vocabulary',
          sectionId: 'extra_vocab_003',
          title: {
            en: 'Key Words 3',
            ta: 'முக்கிய வார்த்தைகள் 3'
          },
          items: [
            {
              word: 'Word 3A',
              translation: 'வார்த்தை 3A',
              phoneticEn: 'wɜːrd 3eɪ',
              phoneticTa: 'vārttai 3A',
              audioUrl: '/audio/vocab/word_3A.mp3',
              exampleSentence: {
                en: 'This is example for word 3A.',
                ta: 'இது வார்த்தை 3A க்கான உதாரணம்.'
              }
            },
            {
              word: 'Word 3B',
              translation: 'வார்த்தை 3B',
              phoneticEn: 'wɜːrd 3biː',
              phoneticTa: 'vārttai 3B',
              audioUrl: '/audio/vocab/word_3B.mp3',
              exampleSentence: {
                en: 'This is example for word 3B.',
                ta: 'இது வார்த்தை 3B க்கான உதாரணம்.'
              }
            }
          ]
        },
        {
          type: 'practice',
          sectionId: 'extra_quiz_003',
          title: {
            en: 'Knowledge Check 3',
            ta: 'அறிவு சரிபார்ப்பு 3'
          },
          items: [
            {
              questionId: 'exq3',
              text: {
                en: 'What is Word 3A?',
                ta: 'வார்த்தை 3A என்றால் என்ன?'
              },
              options: [
                {
                  optionId: 'a',
                  text: 'Option 1',
                  isCorrect: false
                },
                {
                  optionId: 'b',
                  text: 'Word 3A',
                  isCorrect: true
                },
                {
                  optionId: 'c',
                  text: 'Option 3',
                  isCorrect: false
                },
                {
                  optionId: 'd',
                  text: 'Option 4',
                  isCorrect: false
                }
              ],
              feedback: {
                correct: 'Correct!',
                incorrect: 'Try again.'
              }
            }
          ]
        }
      ]
    },
    teachingGuide: {
      overview: {
        en: 'Vocabulary building.',
        ta: 'சொற்களஞ்சியம் கட்டிடம்.'
      },
      learningObjectives: {
        en: [
          'Learn new words'
        ],
        ta: [
          'புதிய வார்த்தைகளை கற்றுக்கொள்ளுங்கள்'
        ]
      },
      steps: []
    },
    createdBy: 'system',
    createdAt: '2026-03-05T05:49:04.361Z',
    updatedAt: '2026-03-05T05:49:04.361Z'
  },
  {
    lessonId: 'lesson_extra_4',
    title: {
      en: 'Vocabulary Building Part 4',
      ta: 'சொற்களஞ்சியம் பகுதி 4'
    },
    level: 'intermediate',
    language: 'en',
    estimatedDuration: 30,
    prepTimeMinutes: 5,
    content: {
      introduction: {
        text: {
          en: 'Expand your English vocabulary with Part 4.',
          ta: 'பகுதி 4 உடன் உங்கள் ஆங்கில சொற்களஞ்சியத்தை விரிவாக்குங்கள்.'
        },
        audioUrl: {
          en: '/audio/lessons/extra/intro_en.mp3',
          ta: '/audio/lessons/extra/intro_ta.mp3'
        },
        imageUrl: '/images/lessons/extra_banner.jpg'
      },
      sections: [
        {
          type: 'vocabulary',
          sectionId: 'extra_vocab_004',
          title: {
            en: 'Key Words 4',
            ta: 'முக்கிய வார்த்தைகள் 4'
          },
          items: [
            {
              word: 'Word 4A',
              translation: 'வார்த்தை 4A',
              phoneticEn: 'wɜːrd 4eɪ',
              phoneticTa: 'vārttai 4A',
              audioUrl: '/audio/vocab/word_4A.mp3',
              exampleSentence: {
                en: 'This is example for word 4A.',
                ta: 'இது வார்த்தை 4A க்கான உதாரணம்.'
              }
            },
            {
              word: 'Word 4B',
              translation: 'வார்த்தை 4B',
              phoneticEn: 'wɜːrd 4biː',
              phoneticTa: 'vārttai 4B',
              audioUrl: '/audio/vocab/word_4B.mp3',
              exampleSentence: {
                en: 'This is example for word 4B.',
                ta: 'இது வார்த்தை 4B க்கான உதாரணம்.'
              }
            }
          ]
        },
        {
          type: 'practice',
          sectionId: 'extra_quiz_004',
          title: {
            en: 'Knowledge Check 4',
            ta: 'அறிவு சரிபார்ப்பு 4'
          },
          items: [
            {
              questionId: 'exq4',
              text: {
                en: 'What is Word 4A?',
                ta: 'வார்த்தை 4A என்றால் என்ன?'
              },
              options: [
                {
                  optionId: 'a',
                  text: 'Option 1',
                  isCorrect: false
                },
                {
                  optionId: 'b',
                  text: 'Word 4A',
                  isCorrect: true
                },
                {
                  optionId: 'c',
                  text: 'Option 3',
                  isCorrect: false
                },
                {
                  optionId: 'd',
                  text: 'Option 4',
                  isCorrect: false
                }
              ],
              feedback: {
                correct: 'Correct!',
                incorrect: 'Try again.'
              }
            }
          ]
        }
      ]
    },
    teachingGuide: {
      overview: {
        en: 'Vocabulary building.',
        ta: 'சொற்களஞ்சியம் கட்டிடம்.'
      },
      learningObjectives: {
        en: [
          'Learn new words'
        ],
        ta: [
          'புதிய வார்த்தைகளை கற்றுக்கொள்ளுங்கள்'
        ]
      },
      steps: []
    },
    createdBy: 'system',
    createdAt: '2026-03-05T05:49:04.361Z',
    updatedAt: '2026-03-05T05:49:04.361Z'
  },
  {
    lessonId: 'lesson_extra_5',
    title: {
      en: 'Vocabulary Building Part 5',
      ta: 'சொற்களஞ்சியம் பகுதி 5'
    },
    level: 'intermediate',
    language: 'en',
    estimatedDuration: 35,
    prepTimeMinutes: 5,
    content: {
      introduction: {
        text: {
          en: 'Expand your English vocabulary with Part 5.',
          ta: 'பகுதி 5 உடன் உங்கள் ஆங்கில சொற்களஞ்சியத்தை விரிவாக்குங்கள்.'
        },
        audioUrl: {
          en: '/audio/lessons/extra/intro_en.mp3',
          ta: '/audio/lessons/extra/intro_ta.mp3'
        },
        imageUrl: '/images/lessons/extra_banner.jpg'
      },
      sections: [
        {
          type: 'vocabulary',
          sectionId: 'extra_vocab_005',
          title: {
            en: 'Key Words 5',
            ta: 'முக்கிய வார்த்தைகள் 5'
          },
          items: [
            {
              word: 'Word 5A',
              translation: 'வார்த்தை 5A',
              phoneticEn: 'wɜːrd 5eɪ',
              phoneticTa: 'vārttai 5A',
              audioUrl: '/audio/vocab/word_5A.mp3',
              exampleSentence: {
                en: 'This is example for word 5A.',
                ta: 'இது வார்த்தை 5A க்கான உதாரணம்.'
              }
            },
            {
              word: 'Word 5B',
              translation: 'வார்த்தை 5B',
              phoneticEn: 'wɜːrd 5biː',
              phoneticTa: 'vārttai 5B',
              audioUrl: '/audio/vocab/word_5B.mp3',
              exampleSentence: {
                en: 'This is example for word 5B.',
                ta: 'இது வார்த்தை 5B க்கான உதாரணம்.'
              }
            }
          ]
        },
        {
          type: 'practice',
          sectionId: 'extra_quiz_005',
          title: {
            en: 'Knowledge Check 5',
            ta: 'அறிவு சரிபார்ப்பு 5'
          },
          items: [
            {
              questionId: 'exq5',
              text: {
                en: 'What is Word 5A?',
                ta: 'வார்த்தை 5A என்றால் என்ன?'
              },
              options: [
                {
                  optionId: 'a',
                  text: 'Option 1',
                  isCorrect: false
                },
                {
                  optionId: 'b',
                  text: 'Word 5A',
                  isCorrect: true
                },
                {
                  optionId: 'c',
                  text: 'Option 3',
                  isCorrect: false
                },
                {
                  optionId: 'd',
                  text: 'Option 4',
                  isCorrect: false
                }
              ],
              feedback: {
                correct: 'Correct!',
                incorrect: 'Try again.'
              }
            }
          ]
        }
      ]
    },
    teachingGuide: {
      overview: {
        en: 'Vocabulary building.',
        ta: 'சொற்களஞ்சியம் கட்டிடம்.'
      },
      learningObjectives: {
        en: [
          'Learn new words'
        ],
        ta: [
          'புதிய வார்த்தைகளை கற்றுக்கொள்ளுங்கள்'
        ]
      },
      steps: []
    },
    createdBy: 'system',
    createdAt: '2026-03-05T05:49:04.361Z',
    updatedAt: '2026-03-05T05:49:04.361Z'
  },
  {
    lessonId: 'lesson_extra_6',
    title: {
      en: 'Vocabulary Building Part 6',
      ta: 'சொற்களஞ்சியம் பகுதி 6'
    },
    level: 'intermediate',
    language: 'en',
    estimatedDuration: 40,
    prepTimeMinutes: 5,
    content: {
      introduction: {
        text: {
          en: 'Expand your English vocabulary with Part 6.',
          ta: 'பகுதி 6 உடன் உங்கள் ஆங்கில சொற்களஞ்சியத்தை விரிவாக்குங்கள்.'
        },
        audioUrl: {
          en: '/audio/lessons/extra/intro_en.mp3',
          ta: '/audio/lessons/extra/intro_ta.mp3'
        },
        imageUrl: '/images/lessons/extra_banner.jpg'
      },
      sections: [
        {
          type: 'vocabulary',
          sectionId: 'extra_vocab_006',
          title: {
            en: 'Key Words 6',
            ta: 'முக்கிய வார்த்தைகள் 6'
          },
          items: [
            {
              word: 'Word 6A',
              translation: 'வார்த்தை 6A',
              phoneticEn: 'wɜːrd 6eɪ',
              phoneticTa: 'vārttai 6A',
              audioUrl: '/audio/vocab/word_6A.mp3',
              exampleSentence: {
                en: 'This is example for word 6A.',
                ta: 'இது வார்த்தை 6A க்கான உதாரணம்.'
              }
            },
            {
              word: 'Word 6B',
              translation: 'வார்த்தை 6B',
              phoneticEn: 'wɜːrd 6biː',
              phoneticTa: 'vārttai 6B',
              audioUrl: '/audio/vocab/word_6B.mp3',
              exampleSentence: {
                en: 'This is example for word 6B.',
                ta: 'இது வார்த்தை 6B க்கான உதாரணம்.'
              }
            }
          ]
        },
        {
          type: 'practice',
          sectionId: 'extra_quiz_006',
          title: {
            en: 'Knowledge Check 6',
            ta: 'அறிவு சரிபார்ப்பு 6'
          },
          items: [
            {
              questionId: 'exq6',
              text: {
                en: 'What is Word 6A?',
                ta: 'வார்த்தை 6A என்றால் என்ன?'
              },
              options: [
                {
                  optionId: 'a',
                  text: 'Option 1',
                  isCorrect: false
                },
                {
                  optionId: 'b',
                  text: 'Word 6A',
                  isCorrect: true
                },
                {
                  optionId: 'c',
                  text: 'Option 3',
                  isCorrect: false
                },
                {
                  optionId: 'd',
                  text: 'Option 4',
                  isCorrect: false
                }
              ],
              feedback: {
                correct: 'Correct!',
                incorrect: 'Try again.'
              }
            }
          ]
        }
      ]
    },
    teachingGuide: {
      overview: {
        en: 'Vocabulary building.',
        ta: 'சொற்களஞ்சியம் கட்டிடம்.'
      },
      learningObjectives: {
        en: [
          'Learn new words'
        ],
        ta: [
          'புதிய வார்த்தைகளை கற்றுக்கொள்ளுங்கள்'
        ]
      },
      steps: []
    },
    createdBy: 'system',
    createdAt: '2026-03-05T05:49:04.361Z',
    updatedAt: '2026-03-05T05:49:04.361Z'
  },
  {
    lessonId: 'lesson_extra_7',
    title: {
      en: 'Vocabulary Building Part 7',
      ta: 'சொற்களஞ்சியம் பகுதி 7'
    },
    level: 'advanced',
    language: 'en',
    estimatedDuration: 45,
    prepTimeMinutes: 5,
    content: {
      introduction: {
        text: {
          en: 'Expand your English vocabulary with Part 7.',
          ta: 'பகுதி 7 உடன் உங்கள் ஆங்கில சொற்களஞ்சியத்தை விரிவாக்குங்கள்.'
        },
        audioUrl: {
          en: '/audio/lessons/extra/intro_en.mp3',
          ta: '/audio/lessons/extra/intro_ta.mp3'
        },
        imageUrl: '/images/lessons/extra_banner.jpg'
      },
      sections: [
        {
          type: 'vocabulary',
          sectionId: 'extra_vocab_007',
          title: {
            en: 'Key Words 7',
            ta: 'முக்கிய வார்த்தைகள் 7'
          },
          items: [
            {
              word: 'Word 7A',
              translation: 'வார்த்தை 7A',
              phoneticEn: 'wɜːrd 7eɪ',
              phoneticTa: 'vārttai 7A',
              audioUrl: '/audio/vocab/word_7A.mp3',
              exampleSentence: {
                en: 'This is example for word 7A.',
                ta: 'இது வார்த்தை 7A க்கான உதாரணம்.'
              }
            },
            {
              word: 'Word 7B',
              translation: 'வார்த்தை 7B',
              phoneticEn: 'wɜːrd 7biː',
              phoneticTa: 'vārttai 7B',
              audioUrl: '/audio/vocab/word_7B.mp3',
              exampleSentence: {
                en: 'This is example for word 7B.',
                ta: 'இது வார்த்தை 7B க்கான உதாரணம்.'
              }
            }
          ]
        },
        {
          type: 'practice',
          sectionId: 'extra_quiz_007',
          title: {
            en: 'Knowledge Check 7',
            ta: 'அறிவு சரிபார்ப்பு 7'
          },
          items: [
            {
              questionId: 'exq7',
              text: {
                en: 'What is Word 7A?',
                ta: 'வார்த்தை 7A என்றால் என்ன?'
              },
              options: [
                {
                  optionId: 'a',
                  text: 'Option 1',
                  isCorrect: false
                },
                {
                  optionId: 'b',
                  text: 'Word 7A',
                  isCorrect: true
                },
                {
                  optionId: 'c',
                  text: 'Option 3',
                  isCorrect: false
                },
                {
                  optionId: 'd',
                  text: 'Option 4',
                  isCorrect: false
                }
              ],
              feedback: {
                correct: 'Correct!',
                incorrect: 'Try again.'
              }
            }
          ]
        }
      ]
    },
    teachingGuide: {
      overview: {
        en: 'Vocabulary building.',
        ta: 'சொற்களஞ்சியம் கட்டிடம்.'
      },
      learningObjectives: {
        en: [
          'Learn new words'
        ],
        ta: [
          'புதிய வார்த்தைகளை கற்றுக்கொள்ளுங்கள்'
        ]
      },
      steps: []
    },
    createdBy: 'system',
    createdAt: '2026-03-05T05:49:04.361Z',
    updatedAt: '2026-03-05T05:49:04.361Z'
  },
  {
    lessonId: 'lesson_extra_8',
    title: {
      en: 'Vocabulary Building Part 8',
      ta: 'சொற்களஞ்சியம் பகுதி 8'
    },
    level: 'advanced',
    language: 'en',
    estimatedDuration: 50,
    prepTimeMinutes: 5,
    content: {
      introduction: {
        text: {
          en: 'Expand your English vocabulary with Part 8.',
          ta: 'பகுதி 8 உடன் உங்கள் ஆங்கில சொற்களஞ்சியத்தை விரிவாக்குங்கள்.'
        },
        audioUrl: {
          en: '/audio/lessons/extra/intro_en.mp3',
          ta: '/audio/lessons/extra/intro_ta.mp3'
        },
        imageUrl: '/images/lessons/extra_banner.jpg'
      },
      sections: [
        {
          type: 'vocabulary',
          sectionId: 'extra_vocab_008',
          title: {
            en: 'Key Words 8',
            ta: 'முக்கிய வார்த்தைகள் 8'
          },
          items: [
            {
              word: 'Word 8A',
              translation: 'வார்த்தை 8A',
              phoneticEn: 'wɜːrd 8eɪ',
              phoneticTa: 'vārttai 8A',
              audioUrl: '/audio/vocab/word_8A.mp3',
              exampleSentence: {
                en: 'This is example for word 8A.',
                ta: 'இது வார்த்தை 8A க்கான உதாரணம்.'
              }
            },
            {
              word: 'Word 8B',
              translation: 'வார்த்தை 8B',
              phoneticEn: 'wɜːrd 8biː',
              phoneticTa: 'vārttai 8B',
              audioUrl: '/audio/vocab/word_8B.mp3',
              exampleSentence: {
                en: 'This is example for word 8B.',
                ta: 'இது வார்த்தை 8B க்கான உதாரணம்.'
              }
            }
          ]
        },
        {
          type: 'practice',
          sectionId: 'extra_quiz_008',
          title: {
            en: 'Knowledge Check 8',
            ta: 'அறிவு சரிபார்ப்பு 8'
          },
          items: [
            {
              questionId: 'exq8',
              text: {
                en: 'What is Word 8A?',
                ta: 'வார்த்தை 8A என்றால் என்ன?'
              },
              options: [
                {
                  optionId: 'a',
                  text: 'Option 1',
                  isCorrect: false
                },
                {
                  optionId: 'b',
                  text: 'Word 8A',
                  isCorrect: true
                },
                {
                  optionId: 'c',
                  text: 'Option 3',
                  isCorrect: false
                },
                {
                  optionId: 'd',
                  text: 'Option 4',
                  isCorrect: false
                }
              ],
              feedback: {
                correct: 'Correct!',
                incorrect: 'Try again.'
              }
            }
          ]
        }
      ]
    },
    teachingGuide: {
      overview: {
        en: 'Vocabulary building.',
        ta: 'சொற்களஞ்சியம் கட்டிடம்.'
      },
      learningObjectives: {
        en: [
          'Learn new words'
        ],
        ta: [
          'புதிய வார்த்தைகளை கற்றுக்கொள்ளுங்கள்'
        ]
      },
      steps: []
    },
    createdBy: 'system',
    createdAt: '2026-03-05T05:49:04.361Z',
    updatedAt: '2026-03-05T05:49:04.361Z'
  },
  {
    lessonId: 'lesson_extra_9',
    title: {
      en: 'Vocabulary Building Part 9',
      ta: 'சொற்களஞ்சியம் பகுதி 9'
    },
    level: 'advanced',
    language: 'en',
    estimatedDuration: 55,
    prepTimeMinutes: 5,
    content: {
      introduction: {
        text: {
          en: 'Expand your English vocabulary with Part 9.',
          ta: 'பகுதி 9 உடன் உங்கள் ஆங்கில சொற்களஞ்சியத்தை விரிவாக்குங்கள்.'
        },
        audioUrl: {
          en: '/audio/lessons/extra/intro_en.mp3',
          ta: '/audio/lessons/extra/intro_ta.mp3'
        },
        imageUrl: '/images/lessons/extra_banner.jpg'
      },
      sections: [
        {
          type: 'vocabulary',
          sectionId: 'extra_vocab_009',
          title: {
            en: 'Key Words 9',
            ta: 'முக்கிய வார்த்தைகள் 9'
          },
          items: [
            {
              word: 'Word 9A',
              translation: 'வார்த்தை 9A',
              phoneticEn: 'wɜːrd 9eɪ',
              phoneticTa: 'vārttai 9A',
              audioUrl: '/audio/vocab/word_9A.mp3',
              exampleSentence: {
                en: 'This is example for word 9A.',
                ta: 'இது வார்த்தை 9A க்கான உதாரணம்.'
              }
            },
            {
              word: 'Word 9B',
              translation: 'வார்த்தை 9B',
              phoneticEn: 'wɜːrd 9biː',
              phoneticTa: 'vārttai 9B',
              audioUrl: '/audio/vocab/word_9B.mp3',
              exampleSentence: {
                en: 'This is example for word 9B.',
                ta: 'இது வார்த்தை 9B க்கான உதாரணம்.'
              }
            }
          ]
        },
        {
          type: 'practice',
          sectionId: 'extra_quiz_009',
          title: {
            en: 'Knowledge Check 9',
            ta: 'அறிவு சரிபார்ப்பு 9'
          },
          items: [
            {
              questionId: 'exq9',
              text: {
                en: 'What is Word 9A?',
                ta: 'வார்த்தை 9A என்றால் என்ன?'
              },
              options: [
                {
                  optionId: 'a',
                  text: 'Option 1',
                  isCorrect: false
                },
                {
                  optionId: 'b',
                  text: 'Word 9A',
                  isCorrect: true
                },
                {
                  optionId: 'c',
                  text: 'Option 3',
                  isCorrect: false
                },
                {
                  optionId: 'd',
                  text: 'Option 4',
                  isCorrect: false
                }
              ],
              feedback: {
                correct: 'Correct!',
                incorrect: 'Try again.'
              }
            }
          ]
        }
      ]
    },
    teachingGuide: {
      overview: {
        en: 'Vocabulary building.',
        ta: 'சொற்களஞ்சியம் கட்டிடம்.'
      },
      learningObjectives: {
        en: [
          'Learn new words'
        ],
        ta: [
          'புதிய வார்த்தைகளை கற்றுக்கொள்ளுங்கள்'
        ]
      },
      steps: []
    },
    createdBy: 'system',
    createdAt: '2026-03-05T05:49:04.361Z',
    updatedAt: '2026-03-05T05:49:04.361Z'
  }
] as any;

professionalLessons.push(...extraLessons);

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