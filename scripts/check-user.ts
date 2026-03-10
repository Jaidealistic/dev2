import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'learner@linguaaccess.com' },
    });
    console.log('User found:', user ? 'Yes' : 'No');
    if (user) {
        console.log('User Role:', user.role);
        console.log('User Password (hashed):', user.password);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
