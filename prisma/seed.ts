import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create an initial admin user if it doesn't exist
  await prisma.user.upsert({
    where: { email: 'admin@local' },
    update: {},
    create: {
      email: 'admin@local',
      password: 'changeme',
      role: UserRole.ADMIN,
    },
  })

  console.log('Seed complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
