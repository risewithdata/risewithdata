import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Delete all existing courses
await prisma.$queryRawUnsafe(`DELETE FROM "AdminCourse"`);
console.log('🗑️  Cleared all existing courses');

const courses = [
  {
    id:                   'course_001',
    name:                 'Power BI Data Analyst Fellowship',
    trainerName:          'Sarah Johnson',
    duration:             '8 weeks',
    startDate:            '2026-07-04T00:00:00',
    endDate:              '2026-08-29T00:00:00',
    seatsAvailable:       30,
    applicationsReceived: 24,
    status:               'ACTIVE',
  },
  {
    id:                   'course_002',
    name:                 'Cohort Washington',
    trainerName:          'Michael Chen',
    duration:             '8 weeks',
    startDate:            '2026-07-04T00:00:00',
    endDate:              '2026-08-29T00:00:00',
    seatsAvailable:       25,
    applicationsReceived: 18,
    status:               'ACTIVE',
  },
  {
    id:                   'course_003',
    name:                 'Cohort Lincoln',
    trainerName:          'Priya Patel',
    duration:             '8 weeks',
    startDate:            '2026-09-05T00:00:00',
    endDate:              '2026-10-31T00:00:00',
    seatsAvailable:       25,
    applicationsReceived: 10,
    status:               'ACTIVE',
  },
];

for (const c of courses) {
  await prisma.$queryRawUnsafe(
    `INSERT INTO "AdminCourse"
       (id, name, "trainerName", duration, "startDate", "endDate",
        "seatsAvailable", "applicationsReceived", status, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5::timestamp, $6::timestamp, $7, $8, $9::"CourseStatus", NOW(), NOW())`,
    c.id, c.name, c.trainerName, c.duration,
    c.startDate, c.endDate,
    c.seatsAvailable, c.applicationsReceived, c.status
  );
  console.log(`✅ Added: ${c.name}`);
}

await prisma.$disconnect();
