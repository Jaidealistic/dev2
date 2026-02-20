import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

export async function POST(req: Request) {
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
        const { studentId } = body;

        if (!studentId) {
            return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
        }

        // 1. Find the student by ID
        // We search across LearnerProfile's studentId field
        const studentProfile = await prisma.learnerProfile.findUnique({
            where: { studentId },
            include: { user: true }
        });

        if (!studentProfile) {
            return NextResponse.json({ error: 'Student not found with this ID' }, { status: 404 });
        }

        // 2. Find/Create Parent Profile
        // We already have logic in dashboard to create if missing, but let's be safe
        let parentProfile = await prisma.parentProfile.findUnique({
            where: { userId }
        });

        if (!parentProfile) {
            parentProfile = await prisma.parentProfile.create({
                data: { userId }
            });
        }

        // 3. Create Family Link
        // Check if already linked
        const existingLink = await prisma.familyMember.findUnique({
            where: {
                parentId_childId: {
                    parentId: parentProfile.id,
                    childId: studentProfile.user.id
                }
            }
        });

        if (existingLink) {
            return NextResponse.json({ error: 'Student already is linked to your account' }, { status: 409 });
        }

        const newLink = await prisma.familyMember.create({
            data: {
                parentId: parentProfile.id,
                childId: studentProfile.user.id,
                learnerProfileId: studentProfile.id,
                relationship: 'Child', // Default
                permissions: { canViewProgress: true, canAssignLessons: true }
            },
            include: {
                child: {
                    include: { learnerProfile: true }
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Child linked successfully',
            familyMember: newLink
        });

    } catch (error) {
        console.error('Link child error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
