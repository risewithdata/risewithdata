import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../../lib/auth';
import { prisma } from '../../../../../prisma/prisma.config';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT
         ac.id, ac.name, ac."trainerName", ac.duration,
         ac."startDate", ac."endDate", ac."seatsAvailable",
         ac."applicationsReceived", ac.status,
         sa."createdAt" AS "enrolledAt", sa.id AS "applicationId",
         sa."firstName", sa."lastName"
       FROM "AdminCourse" ac
       JOIN "StudentApplication" sa ON sa."courseApplied" = ac.name
       WHERE ac.id = $1
         AND LOWER(sa.email) = LOWER($2)
         AND sa.status = 'APPROVED'::"ApplicationStatus"
       LIMIT 1`,
      id, session.email
    );

    if (!rows.length) return NextResponse.json({ error: 'Course not found or not enrolled' }, { status: 404 });

    const r = rows[0];
    return NextResponse.json({
      data: {
        ...r,
        seatsAvailable:       Number(r.seatsAvailable),
        applicationsReceived: Number(r.applicationsReceived),
        startDate:  r.startDate  instanceof Date ? (r.startDate  as Date).toISOString() : r.startDate,
        endDate:    r.endDate    instanceof Date ? (r.endDate    as Date).toISOString() : r.endDate,
        enrolledAt: r.enrolledAt instanceof Date ? (r.enrolledAt as Date).toISOString() : r.enrolledAt,
      }
    });
  } catch (err) {
    console.error('[student/courses/[id]] GET:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
