import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../../lib/auth';
import { prisma } from '../../../../../prisma/prisma.config';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const instructorName = `${session.firstName} ${session.lastName}`;
    const { id } = await params;

    const courses = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, name, "trainerName", duration, "startDate", "endDate", "seatsAvailable", "applicationsReceived", status, "createdAt", "updatedAt"
       FROM "AdminCourse"
       WHERE id = $1 AND "trainerName" = $2
       LIMIT 1`,
      id,
      instructorName
    );

    if (!courses.length) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const course = courses[0];

    const students = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, "firstName", "lastName", email, "courseApplied", "createdAt"
       FROM "StudentApplication"
       WHERE "courseApplied" = $1 AND status = 'APPROVED'::"ApplicationStatus"
       ORDER BY "createdAt" DESC`,
      course.name as string
    );

    return NextResponse.json({
      data: {
        ...course,
        startDate: course.startDate instanceof Date ? (course.startDate as Date).toISOString() : course.startDate,
        endDate: course.endDate instanceof Date ? (course.endDate as Date).toISOString() : course.endDate,
        createdAt: course.createdAt instanceof Date ? (course.createdAt as Date).toISOString() : course.createdAt,
        updatedAt: course.updatedAt instanceof Date ? (course.updatedAt as Date).toISOString() : course.updatedAt,
        students: students.map((s) => ({
          ...s,
          createdAt: s.createdAt instanceof Date ? (s.createdAt as Date).toISOString() : s.createdAt,
        })),
      },
    });
  } catch (err) {
    console.error('[instructor/courses/[id]] GET:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
