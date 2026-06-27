import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT
         ac.id, ac.name, ac."trainerName", ac.duration,
         ac."startDate", ac."endDate", ac."seatsAvailable",
         ac."applicationsReceived", ac.status,
         sa."createdAt" AS "enrolledAt", sa.id AS "applicationId"
       FROM "StudentApplication" sa
       JOIN "AdminCourse" ac ON ac.name = sa."courseApplied"
       WHERE LOWER(sa.email) = LOWER($1)
         AND sa.status = 'APPROVED'::"ApplicationStatus"
       ORDER BY sa."createdAt" DESC`,
      session.email
    );

    const courses = rows.map((r) => ({
      ...r,
      seatsAvailable:       Number(r.seatsAvailable),
      applicationsReceived: Number(r.applicationsReceived),
      startDate:  r.startDate  instanceof Date ? (r.startDate  as Date).toISOString() : r.startDate,
      endDate:    r.endDate    instanceof Date ? (r.endDate    as Date).toISOString() : r.endDate,
      enrolledAt: r.enrolledAt instanceof Date ? (r.enrolledAt as Date).toISOString() : r.enrolledAt,
    }));

    return NextResponse.json({ data: courses });
  } catch (err) {
    console.error('[student/courses] GET:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
