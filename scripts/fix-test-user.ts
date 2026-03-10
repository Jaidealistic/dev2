import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function fixUser() {
    const email = 'learner@linguaaccess.com';
    const patternString = '0-1-2-3';
    const hashedPassword = await bcrypt.hash(patternString, 10);

    console.log('Fixing user:', email);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: UserRole.LEARNER,
        },
        create: {
            email,
            password: hashedPassword,
            role: UserRole.LEARNER,
            firstName: 'Test',
            lastName: 'Learner',
        },
    });

    console.log('User upserted:', user.id);

    // Ensure learner profile exists
    const profile = await prisma.learnerProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
            userId: user.id,
            nativeLanguage: 'en',
        },
    });

    console.log('Learner profile ensured:', profile.id);
}

fixUser()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
