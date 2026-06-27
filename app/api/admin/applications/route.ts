import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search   = (searchParams.get('search')   ?? '').trim();
    const status   = searchParams.get('status')    ?? '';
    const course   = (searchParams.get('course')   ?? '').trim();
    const dateFrom = searchParams.get('dateFrom')  ?? '';
    const dateTo   = searchParams.get('dateTo')    ?? '';
    const page     = Math.max(1, Number(searchParams.get('page')     ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') ?? 10)));
    const offset   = (page - 1) * pageSize;

    // Build WHERE clauses dynamically
    const conditions: string[] = [];
    const params: unknown[]    = [];
    let   idx = 1;

    if (search) {
      conditions.push(`(
        "firstName"    ILIKE $${idx} OR
        "lastName"     ILIKE $${idx} OR
        "email"        ILIKE $${idx} OR
        "linkedinName" ILIKE $${idx}
      )`);
      params.push(`%${search}%`);
      idx++;
    }

    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      conditions.push(`status = $${idx}::"ApplicationStatus"`);
      params.push(status);
      idx++;
    }

    if (course) {
      conditions.push(`"courseApplied" ILIKE $${idx}`);
      params.push(`%${course}%`);
      idx++;
    }

    if (dateFrom) {
      conditions.push(`"createdAt" >= $${idx}::timestamptz`);
      params.push(dateFrom);
      idx++;
    }

    if (dateTo) {
      conditions.push(`"createdAt" <= $${idx}::timestamptz`);
      params.push(new Date(new Date(dateTo).setHours(23, 59, 59, 999)).toISOString());
      idx++;
    }

    const WHERE = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const dataQuery  = `SELECT id, "firstName", "lastName", email, "courseApplied", trainer,
                               status, "resumeFileName", "linkedinName", zipcode, "createdAt", "updatedAt"
                        FROM "StudentApplication"
                        ${WHERE}
                        ORDER BY "createdAt" DESC
                        LIMIT $${idx} OFFSET $${idx + 1}`;

    const countQuery = `SELECT COUNT(*)::int AS total FROM "StudentApplication" ${WHERE}`;

    const statsQuery = `SELECT
        COUNT(*)::int                                                  AS total,
        COUNT(*) FILTER (WHERE status = 'PENDING')::int               AS "PENDING",
        COUNT(*) FILTER (WHERE status = 'APPROVED')::int              AS "APPROVED",
        COUNT(*) FILTER (WHERE status = 'REJECTED')::int              AS "REJECTED"
      FROM "StudentApplication"`;

    const [rows, countRows, statsRows] = await Promise.all([
      prisma.$queryRawUnsafe<Record<string, unknown>[]>(dataQuery,    ...params, pageSize, offset),
      prisma.$queryRawUnsafe<{ total: number }[]>(countQuery,         ...params),
      prisma.$queryRawUnsafe<{ total: number; PENDING: number; APPROVED: number; REJECTED: number }[]>(statsQuery),
    ]);

    const total     = countRows[0]?.total ?? 0;
    const statsRow  = statsRows[0] ?? { total: 0, PENDING: 0, APPROVED: 0, REJECTED: 0 };

    return NextResponse.json({
      data:       rows,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      stats:      statsRow,
    });
  } catch (err) {
    console.error('[admin/applications] GET error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
