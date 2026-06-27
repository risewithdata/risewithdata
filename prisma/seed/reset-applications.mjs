import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Clear all existing applications
const deleted = await prisma.$queryRawUnsafe(`DELETE FROM "StudentApplication"`);
console.log('🗑️  Cleared all student applications');

// 5 dummy records — varied statuses and courses
const records = [
  {
    firstName: 'Emily',
    lastName: 'Carter',
    email: 'emily.carter@gmail.com',
    zipcode: '10001',
    linkedinName: 'emily-carter-data',
    courseApplied: 'Power BI Data Analyst Fellowship',
    trainer: 'Sarah Johnson',
    status: 'PENDING',
    resumeFileName: 'emily_carter_resume.pdf',
    resumeFileType: 'application/pdf',
    resumeFileSizeBytes: 245760,
  },
  {
    firstName: 'James',
    lastName: 'Thompson',
    email: 'james.thompson@outlook.com',
    zipcode: '30301',
    linkedinName: 'james-thompson-bi',
    courseApplied: 'Cohort Washington',
    trainer: 'Michael Chen',
    status: 'APPROVED',
    resumeFileName: 'james_thompson_resume.pdf',
    resumeFileType: 'application/pdf',
    resumeFileSizeBytes: 312320,
  },
  {
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.m@yahoo.com',
    zipcode: '77001',
    linkedinName: 'sophiamartinez',
    courseApplied: 'Cohort Lincoln',
    trainer: 'Priya Patel',
    status: 'APPROVED',
    resumeFileName: 'sophia_martinez_resume.pdf',
    resumeFileType: 'application/pdf',
    resumeFileSizeBytes: 198656,
  },
  {
    firstName: 'Liam',
    lastName: 'Anderson',
    email: 'liam.anderson@gmail.com',
    zipcode: '60601',
    linkedinName: 'liam-anderson-dev',
    courseApplied: 'Power BI Data Analyst Fellowship',
    trainer: 'Sarah Johnson',
    status: 'REJECTED',
    resumeFileName: 'liam_anderson_resume.pdf',
    resumeFileType: 'application/pdf',
    resumeFileSizeBytes: 278528,
  },
  {
    firstName: 'Olivia',
    lastName: 'Wilson',
    email: 'olivia.wilson@hotmail.com',
    zipcode: '98101',
    linkedinName: 'olivia-wilson-analyst',
    courseApplied: 'Cohort Washington',
    trainer: 'Michael Chen',
    status: 'PENDING',
    resumeFileName: 'olivia_wilson_resume.pdf',
    resumeFileType: 'application/pdf',
    resumeFileSizeBytes: 225280,
  },
];

for (const r of records) {
  await prisma.$queryRawUnsafe(
    `INSERT INTO "StudentApplication"
       (id, "firstName", "lastName", email, zipcode, "linkedinName",
        "courseApplied", trainer, status, "resumeFileName", "resumeFileType",
        "resumeFileSizeBytes", "createdAt", "updatedAt")
     VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7,
             $8::"ApplicationStatus", $9, $10, $11, NOW(), NOW())`,
    r.firstName, r.lastName, r.email, r.zipcode, r.linkedinName,
    r.courseApplied, r.trainer, r.status,
    r.resumeFileName, r.resumeFileType, r.resumeFileSizeBytes
  );
  console.log(`  ✅ ${r.firstName} ${r.lastName} — ${r.status}`);
}

console.log('\n✅ Done — 5 student applications seeded');
await prisma.$disconnect();
