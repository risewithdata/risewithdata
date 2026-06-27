import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const EMAIL    = 'olivia.wilson@hotmail.com';
const PASSWORD = 'student123';

// Look up the student's name from their application
const apps = await prisma.$queryRawUnsafe(
  `SELECT "firstName", "lastName" FROM "StudentApplication" WHERE LOWER(email) = LOWER($1) LIMIT 1`,
  EMAIL
);

const firstName = apps[0]?.firstName ?? 'Olivia';
const lastName  = apps[0]?.lastName  ?? 'Wilson';

const passwordHash = await bcrypt.hash(PASSWORD, 12);

// Check if User already exists
const existing = await prisma.$queryRawUnsafe(
  `SELECT id FROM "User" WHERE LOWER(email) = LOWER($1) LIMIT 1`,
  EMAIL
);

if (existing.length) {
  // Update password
  await prisma.$queryRawUnsafe(
    `UPDATE "User" SET "passwordHash" = $1, "updatedAt" = NOW() WHERE LOWER(email) = LOWER($2)`,
    passwordHash, EMAIL
  );
  console.log(`✅ Password updated for ${EMAIL}`);
} else {
  // Create new User record
  await prisma.$queryRawUnsafe(
    `INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", role, active, "createdAt", "updatedAt")
     VALUES (gen_random_uuid()::text, $1, $2, $3, $4, 'STUDENT'::"Role", true, NOW(), NOW())`,
    EMAIL, passwordHash, firstName, lastName
  );
  console.log(`✅ Created account for ${firstName} ${lastName} (${EMAIL})`);
}

console.log(`   Email:    ${EMAIL}`);
console.log(`   Password: ${PASSWORD}`);
await prisma.$disconnect();
