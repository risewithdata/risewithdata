import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../prisma/prisma.config';

function courseProgress(startDate: Date, endDate: Date) {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (now < start) return { label: 'Upcoming', pct: 0 };
  if (now > end) return { label: 'Completed', pct: 100 };
  const pct = Math.round(((now - start) / (end - start)) * 100);
  return { label: 'In Progress', pct };
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const instructorName = `${session.firstName} ${session.lastName}`;

    const courses = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, name, "trainerName", duration, "startDate", "endDate", status
       FROM "AdminCourse"
       WHERE "trainerName" = $1
       ORDER BY "startDate" ASC`,
      instructorName
    );

    const progressData = await Promise.all(
      courses.map(async (course) => {
        const countResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
          `SELECT COUNT(*) AS count FROM "StudentApplication"
           WHERE "courseApplied" = $1 AND status = 'APPROVED'::"ApplicationStatus"`,
          course.name as string
        );
        const totalStudents = Number(countResult[0].count);
        const startDate = course.startDate instanceof Date ? (course.startDate as Date) : new Date(course.startDate as string);
        const endDate = course.endDate instanceof Date ? (course.endDate as Date) : new Date(course.endDate as string);
        const prog = courseProgress(startDate, endDate);

        return {
          id: course.id,
          name: course.name,
          duration: course.duration,
          status: course.status,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          totalStudents,
          progressPct: prog.pct,
          progressLabel: prog.label,
        };
      })
    );

    return NextResponse.json({ data: progressData });
  } catch (err) {
    console.error('[instructor/progress] GET:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
