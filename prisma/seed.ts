import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('changeme', 10)

  // Create an initial admin user if it doesn't exist
  await prisma.user.upsert({
    where: { email: 'admin@local' },
    update: {
      password: hashedPassword,
      role: UserRole.ADMIN
    },
    create: {
      email: 'admin@local',
      password: hashedPassword,
      role: UserRole.ADMIN,
      firstName: 'System',
      lastName: 'Admin'
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
