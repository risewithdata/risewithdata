import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status   = searchParams.get('status') ?? '';
    const course   = searchParams.get('course') ?? '';
    const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const pageSize = Math.min(50, parseInt(searchParams.get('pageSize') ?? '20'));
    const offset   = (page - 1) * pageSize;

    let where = 'WHERE 1=1';
    const params: unknown[] = [];
    let idx = 1;

    if (status) { where += ` AND status = $${idx}::"EnrollmentStatus"`; params.push(status); idx++; }
    if (course) { where += ` AND "courseName" = $${idx}`; params.push(course); idx++; }

    const [rows, totals, stats] = await Promise.all([
      prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT * FROM "Enrollment" ${where} ORDER BY "createdAt" DESC LIMIT $${idx} OFFSET $${idx + 1}`,
        ...params, pageSize, offset
      ),
      prisma.$queryRawUnsafe<{ count: number }[]>(
        `SELECT COUNT(*)::int AS count FROM "Enrollment" ${where}`,
        ...params
      ),
      prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT
           COUNT(*)::int AS total,
           COUNT(*) FILTER (WHERE status = 'PAID')::int AS paid,
           COUNT(*) FILTER (WHERE status = 'PENDING')::int AS pending,
           COUNT(*) FILTER (WHERE status = 'FAILED')::int AS failed,
           COUNT(*) FILTER (WHERE status = 'CANCELLED')::int AS cancelled,
           COALESCE(SUM(amount) FILTER (WHERE status = 'PAID'), 0)::int AS revenue
         FROM "Enrollment"`
      ),
    ]);

    const total = totals[0]?.count ?? 0;

    return NextResponse.json({
      data:       rows,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(Number(total) / pageSize),
      stats:      stats[0],
    });
  } catch (err) {
    console.error('[admin/payments] GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
