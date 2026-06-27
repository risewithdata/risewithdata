import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function d(y, m, day) { return new Date(y, m - 1, day); }

const courses = [
  { name: 'Power BI Data Analyst Fellowship – Cohort Washington', trainerName: 'Sarah Johnson',  duration: '8 weeks',  startDate: d(2026,7,4),   endDate: d(2026,8,29),  seatsAvailable: 30, applicationsReceived: 24, status: 'ACTIVE'   },
  { name: 'Power BI Data Analyst Fellowship – Cohort Lincoln',    trainerName: 'Michael Chen',   duration: '8 weeks',  startDate: d(2026,9,5),   endDate: d(2026,10,31), seatsAvailable: 25, applicationsReceived: 18, status: 'ACTIVE'   },
  { name: 'Data Analytics Fundamentals – Spring 2026',            trainerName: 'Priya Patel',    duration: '6 weeks',  startDate: d(2026,3,1),   endDate: d(2026,4,12),  seatsAvailable: 40, applicationsReceived: 40, status: 'INACTIVE' },
  { name: 'SQL for Business Intelligence',                        trainerName: 'David Williams', duration: '4 weeks',  startDate: d(2026,5,10),  endDate: d(2026,6,7),   seatsAvailable: 20, applicationsReceived: 15, status: 'INACTIVE' },
  { name: 'Advanced DAX & Power BI Modeling',                     trainerName: 'Sarah Johnson',  duration: '5 weeks',  startDate: d(2026,8,3),   endDate: d(2026,9,7),   seatsAvailable: 20, applicationsReceived: 11, status: 'ACTIVE'   },
  { name: 'Python for Data Analysis',                             trainerName: 'Michael Chen',   duration: '10 weeks', startDate: d(2026,10,1),  endDate: d(2026,12,10), seatsAvailable: 35, applicationsReceived: 8,  status: 'ACTIVE'   },
  { name: 'Excel to Power BI Migration',                          trainerName: 'Priya Patel',    duration: '3 weeks',  startDate: d(2026,4,15),  endDate: d(2026,5,6),   seatsAvailable: 50, applicationsReceived: 42, status: 'INACTIVE' },
  { name: 'Data Storytelling & Visualization',                    trainerName: 'Emily Torres',   duration: '4 weeks',  startDate: d(2026,7,20),  endDate: d(2026,8,17),  seatsAvailable: 25, applicationsReceived: 17, status: 'ACTIVE'   },
  { name: 'Azure Data Factory Essentials',                        trainerName: 'David Williams', duration: '6 weeks',  startDate: d(2026,9,14),  endDate: d(2026,10,26), seatsAvailable: 15, applicationsReceived: 9,  status: 'ACTIVE'   },
  { name: 'Tableau for Business Analytics',                       trainerName: 'Emily Torres',   duration: '5 weeks',  startDate: d(2026,2,2),   endDate: d(2026,3,9),   seatsAvailable: 30, applicationsReceived: 30, status: 'INACTIVE' },
  { name: 'Google Looker Studio Bootcamp',                        trainerName: 'Sarah Johnson',  duration: '2 weeks',  startDate: d(2026,11,2),  endDate: d(2026,11,13), seatsAvailable: 40, applicationsReceived: 5,  status: 'ACTIVE'   },
  { name: 'Data Governance & Quality',                            trainerName: 'Michael Chen',   duration: '4 weeks',  startDate: d(2026,6,1),   endDate: d(2026,6,28),  seatsAvailable: 20, applicationsReceived: 12, status: 'INACTIVE' },
];

let inserted = 0;
for (let i = 0; i < courses.length; i++) {
  const c = courses[i];
  const id = `course_${String(i + 1).padStart(3, '0')}`;
  await prisma.$queryRawUnsafe(
    `INSERT INTO "AdminCourse"
       (id, name, "trainerName", duration, "startDate", "endDate",
        "seatsAvailable", "applicationsReceived", status, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, $4, $5::timestamp, $6::timestamp, $7, $8, $9::"CourseStatus", NOW(), NOW())
     ON CONFLICT (id) DO NOTHING`,
    id, c.name, c.trainerName, c.duration,
    c.startDate.toISOString(), c.endDate.toISOString(),
    c.seatsAvailable, c.applicationsReceived, c.status
  );
  inserted++;
}

console.log(`✅ Seeded ${inserted} courses`);
await prisma.$disconnect();
