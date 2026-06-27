import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'risewithdatausa@gmail.com';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('User already exists:', existing.email, existing.role);
    return;
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

  console.log('✅ Super admin created:', user.id, user.email, user.role);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
