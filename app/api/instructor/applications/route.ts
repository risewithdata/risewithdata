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

    const applications = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, "firstName", "lastName", email, "courseApplied", status, "createdAt", "updatedAt"
       FROM "StudentApplication"
       WHERE trainer = $1 AND status = 'APPROVED'::"ApplicationStatus"
       ORDER BY "createdAt" DESC`,
      instructorName
    );

    return NextResponse.json({
      data: applications.map((a) => ({
        ...a,
        createdAt: a.createdAt instanceof Date ? (a.createdAt as Date).toISOString() : a.createdAt,
        updatedAt: a.updatedAt instanceof Date ? (a.updatedAt as Date).toISOString() : a.updatedAt,
      })),
    });
  } catch (err) {
    console.error('[instructor/applications] GET:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
