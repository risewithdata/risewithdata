import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const instructorName = `${session.firstName} ${session.lastName}`;

    const courses = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, name, "trainerName", duration, "startDate", "endDate", "seatsAvailable", "applicationsReceived", status, "createdAt", "updatedAt"
       FROM "AdminCourse"
       WHERE "trainerName" = $1
       ORDER BY "createdAt" DESC`,
      instructorName
    );

    // For each course, get enrolled student count
    const coursesWithCounts = await Promise.all(
      courses.map(async (course) => {
        const countResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
          `SELECT COUNT(*) AS count FROM "StudentApplication"
           WHERE "courseApplied" = $1 AND status = 'APPROVED'::"ApplicationStatus"`,
          course.name as string
        );
        return {
          ...course,
          studentCount: Number(countResult[0].count),
          startDate: course.startDate instanceof Date ? (course.startDate as Date).toISOString() : course.startDate,
          endDate: course.endDate instanceof Date ? (course.endDate as Date).toISOString() : course.endDate,
          createdAt: course.createdAt instanceof Date ? (course.createdAt as Date).toISOString() : course.createdAt,
          updatedAt: course.updatedAt instanceof Date ? (course.updatedAt as Date).toISOString() : course.updatedAt,
        };
      })
    );

    return NextResponse.json({ data: coursesWithCounts });
  } catch (err) {
    console.error('[instructor/courses] GET:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
