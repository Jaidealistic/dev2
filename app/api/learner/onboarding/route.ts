import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { generateStudentId } from '@/lib/utils';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

export async function PUT(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        interface JWTPayload {
            userId: string;
        }

        const token = authHeader.split(' ')[1];
        let decoded: JWTPayload;
        try {
            decoded = jwt.verify(token, SECRET_KEY) as JWTPayload;
        } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        const { userId } = decoded;

        const body = await req.json();
        const {
            dateOfBirth,
            gradeLevel,
            schoolName,
            nativeLanguage,
            learningLanguages,
            languageGoals,
            disabilities, // Array of strings: ['adhd', 'dyslexia']
            iepGoals,
            fontFamily,
            textSize,
            lineSpacing,
            colorScheme,
            captionsEnabled,
            speechRecognitionEnabled,
            reducedMotion,
            placementLevel
        } = body;

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { learnerProfile: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Convert frontend disabilities (lowercase) to DB enum-style strings (UPPERCASE)
        // to match the lesson tagging convention (ADHD, DYSLEXIA, etc.)
        const disabilityTypes = (disabilities || [])
            .filter((d: string) => d !== 'none')
            .map((d: string) => d.toUpperCase()); // 'adhd' -> 'ADHD'

        // Prepare update data
        const updateData = {
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            grade: gradeLevel,
            school: schoolName,
            nativeLanguage,
            // We don't have a direct field for learningLanguages array in schema, 
            // but we can store it in preferences or just ignore for now if not in schema.
            // Schema has `learningLanguage` (Singular enum) but frontend allows multiple.
            // We'll store accommodations / preferences in Json fields.
            disabilityTypes,
            iepGoals,
            fontFamily,
            fontSize: parseInt(textSize as string) || 16,
            lineSpacing: parseFloat(lineSpacing as string) || 1.5,
            colorScheme,
            enableSpeechRec: speechRecognitionEnabled,
            accommodations: {
                captionsEnabled,
                reducedMotion,
                learningLanguages, // Store here for now
                languageGoals,
                placementLevel
            }
        };

        // Upsert learner profile
        const profile = await prisma.learnerProfile.upsert({
            where: { userId },
            create: {
                userId,
                studentId: generateStudentId(),
                ...updateData
            },
            update: updateData
        });

        // Also update User record for redundancy if needed (e.g. language, theme)
        await prisma.user.update({
            where: { id: userId },
            data: {
                language: nativeLanguage === 'tamil' ? 'ta' : 'en',
                theme: colorScheme,
                accessibilityPrefs: {
                    fontFamily,
                    fontSize: textSize,
                    lineSpacing,
                    reducedMotion,
                    captionsEnabled
                }
            }
        });

        return NextResponse.json({ success: true, profile });

    } catch (error) {
        console.error('Onboarding save error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
