import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const materials = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, "courseId", "courseName", title, description, "fileName", "fileType", "uploadedBy", "createdAt"
       FROM "CourseMaterial"
       WHERE "uploadedBy" = $1
       ORDER BY "createdAt" DESC`,
      session.email
    );

    return NextResponse.json({
      data: materials.map((m) => ({
        ...m,
        createdAt: m.createdAt instanceof Date ? (m.createdAt as Date).toISOString() : m.createdAt,
      })),
    });
  } catch (err) {
    console.error('[instructor/materials] GET:', err);
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
    const { courseId, courseName, title, description, fileName, fileType } = body;

    if (!courseId || !courseName || !title || !fileName || !fileType) {
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
      `INSERT INTO "CourseMaterial" (id, "courseId", "courseName", title, description, "fileName", "fileType", "uploadedBy", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      courseId,
      courseName,
      title,
      description ?? null,
      fileName,
      fileType,
      session.email
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[instructor/materials] POST:', err);
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
      `DELETE FROM "CourseMaterial" WHERE id = $1 AND "uploadedBy" = $2`,
      id,
      session.email
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[instructor/materials] DELETE:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
