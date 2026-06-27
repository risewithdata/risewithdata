import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Fetch all 5 applications ordered by createdAt
const apps = await prisma.$queryRawUnsafe(
  `SELECT id, "firstName", "lastName", email FROM "StudentApplication" ORDER BY "createdAt" ASC`
);

console.log(`Found ${apps.length} applications\n`);

const passwordHash = await bcrypt.hash('student123', 12);

for (let i = 0; i < apps.length; i++) {
  const app      = apps[i];
  const newEmail = `studentapt${i + 1}@gmail.com`;
  const oldEmail = app.email;

  // Update application email
  await prisma.$queryRawUnsafe(
    `UPDATE "StudentApplication" SET email = $1, "updatedAt" = NOW() WHERE id = $2`,
    newEmail, app.id
  );

  // Remove old User record if it exists (different email)
  if (oldEmail && oldEmail !== newEmail) {
    await prisma.$queryRawUnsafe(
      `DELETE FROM "User" WHERE LOWER(email) = LOWER($1)`,
      oldEmail
    );
  }

  // Upsert User record with new email
  const existing = await prisma.$queryRawUnsafe(
    `SELECT id FROM "User" WHERE LOWER(email) = LOWER($1) LIMIT 1`,
    newEmail
  );

  if (existing.length) {
    await prisma.$queryRawUnsafe(
      `UPDATE "User" SET "passwordHash" = $1, "firstName" = $2, "lastName" = $3, "updatedAt" = NOW() WHERE LOWER(email) = LOWER($4)`,
      passwordHash, app.firstName, app.lastName, newEmail
    );
    console.log(`  ✏️  Updated  ${newEmail}  (${app.firstName} ${app.lastName})`);
  } else {
    await prisma.$queryRawUnsafe(
      `INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", role, active, "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, 'STUDENT'::"Role", true, NOW(), NOW())`,
      newEmail, passwordHash, app.firstName, app.lastName
    );
    console.log(`  ✅  Created  ${newEmail}  (${app.firstName} ${app.lastName})`);
  }
}

console.log('\n✅ Done — all 5 students updated');
console.log('   Password for all: student123');
await prisma.$disconnect();
