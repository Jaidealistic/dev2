import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding detailed educational lessons...');

    // Create or find a system user to be the creator
    const systemUser = await prisma.user.upsert({
        where: { email: 'system@lexfix.com' },
        update: {},
        create: {
            email: 'system@lexfix.com',
            password: 'system-placeholder-password',
            firstName: 'Lexfix',
            lastName: 'Educator',
            role: 'ADMIN',
            isEmailVerified: true,
        },
    });

    const creatorId = systemUser.id;

    // Helper to clear existing lessons to avoid duplicates during dev
    await prisma.lesson.deleteMany({ where: { creatorId } });

    // Lesson 1: Daily Routines (Mi Rutina Diaria)
    await prisma.lesson.create({
        data: {
            title: 'Mi Rutina Diaria: Morning Habits',
            description: 'Learn how to describe your morning routine in Spanish, from waking up to having breakfast.',
            language: 'es-ES',
            gradeLevel: '2',
            estimatedDuration: 15,
            subject: 'Spanish',
            creatorId,
            isPublished: true,
            publishedAt: new Date(),
            competencies: ['Daily Life', 'Reflexive Verbs'],
            learningObjectives: ['Describe morning actions', 'Use reflexive verbs correctly', 'Identify breakfast vocabulary'],
            steps: {
                create: [
                    {
                        stepNumber: 1,
                        title: 'Waking Up',
                        stepType: 'content',
                        content: {
                            text: 'To describe your routine, we use reflexive verbs. "Me despierto" means "I wake up". "Me levanto" means "I get up".',
                            audioUrl: '/audio/daily_routine_1.mp3',
                        },
                    },
                    {
                        stepNumber: 2,
                        title: 'Getting Ready',
                        stepType: 'content',
                        content: {
                            text: 'Next, "Me ducho" (I shower) and "Me visto" (I get dressed). Notice the "Me" before the verb!',
                        },
                    },
                    {
                        stepNumber: 3,
                        title: 'Exercise: Reflexive Pronouns',
                        stepType: 'exercise',
                        content: {
                            exercise: {
                                question: 'Which word goes before the verb to say "I wake myself up"?',
                                type: 'multiple-choice',
                                options: ['Yo', 'Me', 'Te', 'Se'],
                                correctAnswer: 'Me',
                            },
                        },
                    },
                    {
                        stepNumber: 4,
                        title: 'Speech: Morning Greeting',
                        stepType: 'speech',
                        content: {
                            text: 'Say: "Me levanto a las siete"',
                            exercise: {
                                question: 'Pronounce: "Me levanto a las siete"',
                                type: 'speech',
                                correctAnswer: 'me levanto a las siete',
                            },
                        },
                    },
                ],
            },
        },
    });

    // Lesson 2: Family Members (Mi Familia)
    await prisma.lesson.create({
        data: {
            title: 'Mi Familia: Core Members',
            description: 'Identify and describe immediate family members in Spanish.',
            language: 'es-ES',
            gradeLevel: '1',
            estimatedDuration: 12,
            subject: 'Spanish',
            creatorId,
            isPublished: true,
            publishedAt: new Date(),
            competencies: ['Social Relations', 'Personal Identity'],
            learningObjectives: ['Name core family members', 'Use possessive adjectives', 'Describe family size'],
            steps: {
                create: [
                    {
                        stepNumber: 1,
                        title: 'Parents and Siblings',
                        stepType: 'content',
                        content: {
                            text: 'Madre (Mother), Padre (Father), Hermano (Brother), Hermana (Sister). To say "My mother", use "Mi madre".',
                        },
                    },
                    {
                        stepNumber: 2,
                        title: 'Grandparents',
                        stepType: 'content',
                        content: {
                            text: 'Abuelo (Grandfather) and Abuela (Grandmother). Spanish nouns often change their ending for gender!',
                        },
                    },
                    {
                        stepNumber: 3,
                        title: 'Exercise: Matching',
                        stepType: 'exercise',
                        content: {
                            exercise: {
                                question: 'How do you say "My brother"?',
                                type: 'multiple-choice',
                                options: ['Mi madre', 'Mi hermano', 'Mi abuelo', 'Mi hermana'],
                                correctAnswer: 'Mi hermano',
                            },
                        },
                    },
                    {
                        stepNumber: 4,
                        title: 'Speech Practice',
                        stepType: 'speech',
                        content: {
                            text: 'Say: "Mi familia es grande"',
                            exercise: {
                                question: 'Pronounce: "Mi familia es grande"',
                                type: 'speech',
                                correctAnswer: 'mi familia es grande',
                            },
                        },
                    },
                ],
            },
        },
    });

    // Lesson 3: Food & Dining (En el Restaurante)
    await prisma.lesson.create({
        data: {
            title: 'En el Restaurante: Ordering Food',
            description: 'Essential phrases and vocabulary for dining out in a Spanish-speaking country.',
            language: 'es-ES',
            gradeLevel: '2',
            estimatedDuration: 20,
            subject: 'Spanish',
            creatorId,
            isPublished: true,
            publishedAt: new Date(),
            competencies: ['Practical Situations', 'Food Vocabulary'],
            learningObjectives: ['Request a table', 'Order basic breakfast/lunch', 'Ask for the bill'],
            steps: {
                create: [
                    {
                        stepNumber: 1,
                        title: 'Asking for a Table',
                        stepType: 'content',
                        content: {
                            text: '"Una mesa para dos, por favor" (A table for two, please). "Por favor" is essential!',
                        },
                    },
                    {
                        stepNumber: 2,
                        title: 'Ordering',
                        stepType: 'content',
                        content: {
                            text: '"Quisiera un café" (I would like a coffee). "La cuenta" (The bill).',
                        },
                    },
                    {
                        stepNumber: 3,
                        title: 'Exercise: Essential Nouns',
                        stepType: 'exercise',
                        content: {
                            exercise: {
                                question: 'What does "La cuenta" mean?',
                                type: 'multiple-choice',
                                options: ['The food', 'The table', 'The bill', 'The water'],
                                correctAnswer: 'The bill',
                            },
                        },
                    },
                    {
                        stepNumber: 4,
                        title: 'Speech Practice',
                        stepType: 'speech',
                        content: {
                            text: 'Say: "La cuenta, por favor"',
                            exercise: {
                                question: 'Pronounce: "La cuenta, por favor"',
                                type: 'speech',
                                correctAnswer: 'la cuenta por favor',
                            },
                        },
                    },
                ],
            },
        },
    });

    // Lesson 4: Traveling & Directions (El Viaje)
    await prisma.lesson.create({
        data: {
            title: 'El Viaje: Finding Your Way',
            description: 'Learn how to ask for and understand basic directions in a city.',
            language: 'es-ES',
            gradeLevel: '3',
            estimatedDuration: 18,
            subject: 'Spanish',
            creatorId,
            isPublished: true,
            publishedAt: new Date(),
            competencies: ['Navigation', 'Public Infrastructure'],
            learningObjectives: ['Ask where a place is', 'Understand left vs right', 'Identify transport hubs'],
            steps: {
                create: [
                    {
                        stepNumber: 1,
                        title: 'Where is...?',
                        stepType: 'content',
                        content: {
                            text: '"¿Dónde está la estación?" (Where is the station?). "Estación" could be metro or bus!',
                        },
                    },
                    {
                        stepNumber: 2,
                        title: 'Left, Right, Straight',
                        stepType: 'content',
                        content: {
                            text: '"A la izquierda" (to the left). "A la derecha" (to the right). "Todo recto" (straight ahead).',
                        },
                    },
                    {
                        stepNumber: 3,
                        title: 'Exercise: Directions',
                        stepType: 'exercise',
                        content: {
                            exercise: {
                                question: 'What is "A la derecha"?',
                                type: 'multiple-choice',
                                options: ['To the left', 'Straight ahead', 'To the right', 'Stop'],
                                correctAnswer: 'To the right',
                            },
                        },
                    },
                    {
                        stepNumber: 4,
                        title: 'Speech Practice',
                        stepType: 'speech',
                        content: {
                            text: 'Say: "¿Dónde está el hotel?"',
                            exercise: {
                                question: 'Pronounce: "¿Dónde está el hotel?"',
                                type: 'speech',
                                correctAnswer: 'donde esta el hotel',
                            },
                        },
                    },
                ],
            },
        },
    });

    // Lesson 5: My Emotions (Mis Emociones)
    await prisma.lesson.create({
        data: {
            title: 'Mis Emociones: Expressing Feelings',
            description: 'Vocabulary for describing how you feel in different situations.',
            language: 'es-ES',
            gradeLevel: '1',
            estimatedDuration: 10,
            subject: 'Spanish',
            creatorId,
            isPublished: true,
            publishedAt: new Date(),
            competencies: ['Emotional Intelligence', 'Descriptors'],
            learningObjectives: ['Identify basic emotions', 'Respond to "¿Cómo estás?"', 'Describe others feelings'],
            steps: {
                create: [
                    {
                        stepNumber: 1,
                        title: 'Happy and Sad',
                        stepType: 'content',
                        content: {
                            text: '"Estoy feliz" (I am happy). "Estoy triste" (I am sad). We use the verb "estar" for temporary feelings.',
                        },
                    },
                    {
                        stepNumber: 2,
                        title: 'Tired and Excited',
                        stepType: 'content',
                        content: {
                            text: '"Estoy cansado" (I am tired). "Estoy emocionado" (I am excited). Nouns change endings based on your gender!',
                        },
                    },
                    {
                        stepNumber: 3,
                        title: 'Exercise: Verbs',
                        stepType: 'exercise',
                        content: {
                            exercise: {
                                question: 'Which verb do we use for feelings?',
                                type: 'multiple-choice',
                                options: ['Ser', 'Estar', 'Tener', 'Hacer'],
                                correctAnswer: 'Estar',
                            },
                        },
                    },
                    {
                        stepNumber: 4,
                        title: 'Speech Practice',
                        stepType: 'speech',
                        content: {
                            text: 'Say: "Estoy muy feliz hoy"',
                            exercise: {
                                question: 'Pronounce: "Estoy muy feliz hoy"',
                                type: 'speech',
                                correctAnswer: 'estoy muy feliz hoy',
                            },
                        },
                    },
                ],
            },
        },
    });

    // Lesson 6: Weather & Seasons (El Tiempo)
    await prisma.lesson.create({
        data: {
            title: 'El Tiempo: Seasons and Climate',
            description: 'How to talk about the weather and the four seasons.',
            language: 'es-ES',
            gradeLevel: '2',
            estimatedDuration: 15,
            subject: 'Spanish',
            creatorId,
            isPublished: true,
            publishedAt: new Date(),
            competencies: ['Nature', 'Time Awareness'],
            learningObjectives: ['Name the four seasons', 'Describe daily weather', 'Identify temperature terms'],
            steps: {
                create: [
                    {
                        stepNumber: 1,
                        title: 'The Seasons',
                        stepType: 'content',
                        content: {
                            text: 'La primavera (Spring), El verano (Summer), El otoño (Autumn), El invierno (Winter).',
                        },
                    },
                    {
                        stepNumber: 2,
                        title: 'Current Weather',
                        stepType: 'content',
                        content: {
                            text: '"Hace sol" (It is sunny). "Hace frío" (It is cold). "Está lloviendo" (It is raining).',
                        },
                    },
                    {
                        stepNumber: 3,
                        title: 'Exercise: Seasons',
                        stepType: 'exercise',
                        content: {
                            exercise: {
                                question: 'Which season is "El verano"?',
                                type: 'multiple-choice',
                                options: ['Winter', 'Summer', 'Autumn', 'Spring'],
                                correctAnswer: 'Summer',
                            },
                        },
                    },
                    {
                        stepNumber: 4,
                        title: 'Speech Practice',
                        stepType: 'speech',
                        content: {
                            text: 'Say: "Hoy hace mucho calor"',
                            exercise: {
                                question: 'Pronounce: "Hoy hace mucho calor"',
                                type: 'speech',
                                correctAnswer: 'hoy hace mucho calor',
                            },
                        },
                    },
                ],
            },
        },
    });

    console.log('✅ Successfully seeded 6 detailed lessons.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
