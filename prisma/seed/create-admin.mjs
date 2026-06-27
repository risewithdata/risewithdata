import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const email = 'risewithdatausa@gmail.com';

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
  console.log('User already exists:', existing.email, existing.role);
  await prisma.$disconnect();
  process.exit(0);
}

const passwordHash = await hash('Legacy@26', 10);

const user = await prisma.user.create({
  data: {
    email,
    passwordHash,
    firstName: 'Rise',
    lastName:  'WithData',
    role:      'SUPER_ADMIN',
  },
});

console.log('Super admin created:', user.id, user.email, user.role);
await prisma.$disconnect();
