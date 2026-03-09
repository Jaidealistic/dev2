import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUsers() {
    const users = await prisma.user.findMany({
        select: { email: true, role: true }
    });
    console.log('Registered Users:', users);
    await prisma.$disconnect();
}

checkUsers();
