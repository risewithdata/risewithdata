import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const instructorName = `${session.firstName} ${session.lastName}`;

    const slots = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT s.id, s."courseId", s."courseName", s.title, s."slotDate", s."startTime", s."endTime", s.location, s.notes, s."createdAt"
       FROM "CourseScheduleSlot" s
       INNER JOIN "AdminCourse" c ON c.id = s."courseId"
       WHERE c."trainerName" = $1
       ORDER BY s."slotDate" ASC`,
      instructorName
    );

    return NextResponse.json({
      data: slots.map((s) => ({
        ...s,
        slotDate: s.slotDate instanceof Date ? (s.slotDate as Date).toISOString() : s.slotDate,
        createdAt: s.createdAt instanceof Date ? (s.createdAt as Date).toISOString() : s.createdAt,
      })),
    });
  } catch (err) {
    console.error('[instructor/schedule] GET:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const instructorName = `${session.firstName} ${session.lastName}`;

    const body = await req.json();
    const { courseId, courseName, title, slotDate, startTime, endTime, location, notes } = body;

    if (!courseId || !courseName || !title || !slotDate || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the course belongs to this instructor
    const courseCheck = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
      `SELECT COUNT(*) AS count FROM "AdminCourse" WHERE id = $1 AND "trainerName" = $2`,
      courseId,
      instructorName
    );
    if (Number(courseCheck[0].count) === 0) {
      return NextResponse.json({ error: 'Course not found or unauthorized' }, { status: 403 });
    }

    await prisma.$queryRawUnsafe(
      `INSERT INTO "CourseScheduleSlot" (id, "courseId", "courseName", title, "slotDate", "startTime", "endTime", location, notes, "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4::timestamp, $5, $6, $7, $8, NOW(), NOW())`,
      courseId,
      courseName,
      title,
      slotDate,
      startTime,
      endTime,
      location ?? null,
      notes ?? null
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[instructor/schedule] POST:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const instructorName = `${session.firstName} ${session.lastName}`;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    // Only delete if the slot belongs to a course owned by this instructor
    await prisma.$queryRawUnsafe(
      `DELETE FROM "CourseScheduleSlot"
       WHERE id = $1 AND "courseId" IN (
         SELECT id FROM "AdminCourse" WHERE "trainerName" = $2
       )`,
      id,
      instructorName
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[instructor/schedule] DELETE:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
