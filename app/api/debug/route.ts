
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateStudentId } from '@/lib/utils';

export async function GET() {
    const envCheck = {
        DATABASE_URL: process.env.DATABASE_URL ? 'Defined (value hidden)' : 'Missing',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Defined (value hidden)' : 'Missing',
        NODE_ENV: process.env.NODE_ENV,
    };

    let dbStatus = 'Checking...';
    let dbError = null;

    try {
        // Check tables
        const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table';`;
        dbStatus = `Connected. Tables: ${JSON.stringify(tables)}`;

        // Attempt creation
        try {
            const testEmail = `test-${Date.now()}@example.com`;
            await prisma.user.create({
                data: {
                    email: testEmail,
                    password: 'hash',
                    role: 'LEARNER',
                    firstName: 'Debug',
                    lastName: 'User',
                    learnerProfile: {
                        create: {
                            studentId: generateStudentId(),
                            learningLanguage: 'ENGLISH',
                            disabilityTypes: '[]',
                        }
                    }
                }
            });
            dbStatus += ' & User Create OK';
        } catch (createError: any) {
            console.error('Debug User Create Error:', createError);
            dbStatus += ' & User Create Failed: ' + createError.message;
        }

    } catch (error: any) {
        dbStatus = 'Failed';
        dbError = error.message;
    }

    return NextResponse.json({
        envCheck,
        dbStatus,
        dbError
    });
}
