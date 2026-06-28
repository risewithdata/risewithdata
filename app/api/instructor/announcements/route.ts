import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const announcements = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, "courseId", "courseName", title, body, "postedBy", "createdAt"
       FROM "CourseAnnouncement"
       WHERE "postedBy" = $1
       ORDER BY "createdAt" DESC`,
      session.email
    );

    return NextResponse.json({
      data: announcements.map((a) => ({
        ...a,
        createdAt: a.createdAt instanceof Date ? (a.createdAt as Date).toISOString() : a.createdAt,
      })),
    });
  } catch (err) {
    console.error('[instructor/announcements] GET:', err);
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
    const { courseId, courseName, title, body: announcementBody } = body;

    if (!courseId || !courseName || !title || !announcementBody) {
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
      `INSERT INTO "CourseAnnouncement" (id, "courseId", "courseName", title, body, "postedBy", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW(), NOW())`,
      courseId,
      courseName,
      title,
      announcementBody,
      session.email
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[instructor/announcements] POST:', err);
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await prisma.$queryRawUnsafe(
      `DELETE FROM "CourseAnnouncement" WHERE id = $1 AND "postedBy" = $2`,
      id,
      session.email
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[instructor/announcements] DELETE:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
