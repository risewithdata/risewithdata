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

    const students = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, "firstName", "lastName", email, "courseApplied", "createdAt"
       FROM "StudentApplication"
       WHERE trainer = $1 AND status = 'APPROVED'::"ApplicationStatus"
       ORDER BY "createdAt" DESC`,
      instructorName
    );

    return NextResponse.json({
      data: students.map((s) => ({
        ...s,
        createdAt: s.createdAt instanceof Date ? (s.createdAt as Date).toISOString() : s.createdAt,
      })),
    });
  } catch (err) {
    console.error('[instructor/students] GET:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
