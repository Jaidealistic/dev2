import fs from 'fs';

const professionalLessons = [
  ...Array.from({ length: 9 }).map((_, i) => ({
    lessonId: `lesson_extra_${i + 1}`,
    title: {
      en: `Vocabulary Building Part ${i + 1}`,
      ta: `சொற்களஞ்சியம் பகுதி ${i + 1}`,
    },
    level: i < 3 ? 'beginner' : i < 6 ? 'intermediate' : 'advanced',
    language: 'en',
    estimatedDuration: 15 + i * 5,
    prepTimeMinutes: 5,
    content: {
      introduction: {
        text: {
          en: `Expand your English vocabulary with Part ${i + 1}.`,
          ta: `பகுதி ${i + 1} உடன் உங்கள் ஆங்கில சொற்களஞ்சியத்தை விரிவாக்குங்கள்.`,
        },
        audioUrl: {
          en: `/audio/lessons/extra/intro_en.mp3`,
          ta: `/audio/lessons/extra/intro_ta.mp3`,
        },
        imageUrl: `/images/lessons/extra_banner.jpg`,
      },
      sections: [
        {
          type: 'vocabulary',
          sectionId: `extra_vocab_00${i + 1}`,
          title: {
            en: `Key Words ${i + 1}`,
            ta: `முக்கிய வார்த்தைகள் ${i + 1}`,
          },
          items: [
            {
              word: `Word ${i + 1}A`,
              translation: `வார்த்தை ${i + 1}A`,
              phoneticEn: `wɜːrd ${i + 1}eɪ`,
              phoneticTa: `vārttai ${i + 1}A`,
              audioUrl: `/audio/vocab/word_${i + 1}A.mp3`,
              exampleSentence: {
                en: `This is example for word ${i + 1}A.`,
                ta: `இது வார்த்தை ${i + 1}A க்கான உதாரணம்.`,
              },
            },
            {
              word: `Word ${i + 1}B`,
              translation: `வார்த்தை ${i + 1}B`,
              phoneticEn: `wɜːrd ${i + 1}biː`,
              phoneticTa: `vārttai ${i + 1}B`,
              audioUrl: `/audio/vocab/word_${i + 1}B.mp3`,
              exampleSentence: {
                en: `This is example for word ${i + 1}B.`,
                ta: `இது வார்த்தை ${i + 1}B க்கான உதாரணம்.`,
              },
            }
          ],
        },
        {
          type: 'practice',
          sectionId: `extra_quiz_00${i + 1}`,
          title: {
            en: `Knowledge Check ${i + 1}`,
            ta: `அறிவு சரிபார்ப்பு ${i + 1}`,
          },
          items: [
            {
              questionId: `exq${i + 1}`,
              text: {
                en: `What is Word ${i + 1}A?`,
                ta: `வார்த்தை ${i + 1}A என்றால் என்ன?`,
              },
              options: [
                { optionId: 'a', text: `Option 1`, isCorrect: false },
                { optionId: 'b', text: `Word ${i + 1}A`, isCorrect: true },
                { optionId: 'c', text: `Option 3`, isCorrect: false },
                { optionId: 'd', text: `Option 4`, isCorrect: false },
              ],
              feedback: {
                correct: 'Correct!',
                incorrect: 'Try again.',
              },
            },
          ],
        },
      ],
    },
    teachingGuide: {
      overview: { en: 'Vocabulary building.', ta: 'சொற்களஞ்சியம் கட்டிடம்.' },
      learningObjectives: { en: ['Learn new words'], ta: ['புதிய வார்த்தைகளை கற்றுக்கொள்ளுங்கள்'] },
      steps: [],
    },
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
  }))
];

let content = fs.readFileSync('./scripts/seed-lessons.ts', 'utf8');
const replacement = "];\n\nconst extraLessons = " + JSON.stringify(professionalLessons, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'") + " as any;\n\nprofessionalLessons.push(...extraLessons);\n\nasync function main() {";

// Use Regex to handle CRLF and LF safely
content = content.replace(/\];\s*async function main\(\) \{/, replacement);

fs.writeFileSync('./scripts/seed-lessons.ts', content);
console.log('Successfully appended 9 lessons to seed-lessons.ts');
