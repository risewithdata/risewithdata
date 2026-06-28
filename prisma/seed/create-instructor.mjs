import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const instructors = [
  {
    email: 'sarah.johnson@risewithdata.com',
    password: 'instructor123',
    firstName: 'Sarah',
    lastName: 'Johnson',
  },
  {
    email: 'michael.chen@risewithdata.com',
    password: 'instructor123',
    firstName: 'Michael',
    lastName: 'Chen',
  },
  {
    email: 'priya.patel@risewithdata.com',
    password: 'instructor123',
    firstName: 'Priya',
    lastName: 'Patel',
  },
];

let created = 0;
let skipped = 0;

for (const instructor of instructors) {
  const existing = await prisma.user.findUnique({ where: { email: instructor.email } });
  if (existing) {
    console.log(`Skipped (already exists): ${instructor.email} [${existing.role}]`);
    skipped++;
    continue;
  }

  const passwordHash = await hash(instructor.password, 10);
  const user = await prisma.user.create({
    data: {
      email: instructor.email,
      passwordHash,
      firstName: instructor.firstName,
      lastName: instructor.lastName,
      role: 'INSTRUCTOR',
    },
  });

  console.log(`Created instructor: ${user.firstName} ${user.lastName} <${user.email}> [${user.id}]`);
  created++;
}

console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
await prisma.$disconnect();
