import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/prisma.config';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const body   = await req.json();

    // Toggle status
    if (body.toggleStatus) {
      await prisma.$queryRawUnsafe(
        `UPDATE "AdminCourse"
         SET status = CASE WHEN status = 'ACTIVE' THEN 'INACTIVE'::"CourseStatus"
                           ELSE 'ACTIVE'::"CourseStatus" END,
             "updatedAt" = NOW()
         WHERE id = $1`,
        id
      );
      return NextResponse.json({ ok: true });
    }

    // Full edit
    const { name, trainerName, duration, startDate, endDate, seatsAvailable } = body;
    if (!name || !trainerName || !duration || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    await prisma.$queryRawUnsafe(
      `UPDATE "AdminCourse"
       SET name = $1, "trainerName" = $2, duration = $3,
           "startDate" = $4::timestamp, "endDate" = $5::timestamp,
           "seatsAvailable" = $6, "updatedAt" = NOW()
       WHERE id = $7`,
      name, trainerName, duration, startDate, endDate,
      Number(seatsAvailable) || 0, id
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/courses] PATCH error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.$queryRawUnsafe(`DELETE FROM "AdminCourse" WHERE id = $1`, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/courses] DELETE error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}
