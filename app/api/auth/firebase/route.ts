import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

export async function POST(req: Request) {
    try {
        const { idToken } = await req.json();

        if (!idToken) {
            return NextResponse.json({ error: 'ID Token required' }, { status: 400 });
        }

        // 1. Verify Firebase Token
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const { email, uid, name, picture } = decodedToken;

        if (!email) {
            return NextResponse.json({ error: 'Email required in token' }, { status: 400 });
        }

        // 2. Find or Create User in Prisma
        let user = await prisma.user.findUnique({
            where: { email },
            include: { learnerProfile: true }
        });

        if (!user) {
            // Create new user
            // Default to LEARNER role, or infer? For now default to LEARNER.
            // Split name
            const [firstName, ...lastNameParts] = (name || 'New User').split(' ');
            const lastName = lastNameParts.join(' ');

            user = await prisma.user.create({
                data: {
                    email,
                    password: '', // No password for firebase users
                    firstName: firstName || 'New',
                    lastName: lastName || 'User',
                    avatar: picture,
                    role: 'LEARNER',
                    emailVerified: true,
                    learnerProfile: {
                        create: {
                            // Create empty profile
                        }
                    }
                },
                include: { learnerProfile: true }
            });
        }

        // 3. Generate App JWT (same as standard login)
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
            },
            SECRET_KEY,
            { expiresIn: '30d' }
        );

        // 4. Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                onboardingComplete: !!((user.role === 'LEARNER' && user.learnerProfile?.grade) || user.role !== 'LEARNER'), // Simplified
            }
        });

    } catch (error) {
        console.error('Firebase Login Error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
}
