import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search   = (searchParams.get('search')   ?? '').trim();
    const status   = searchParams.get('status')    ?? '';
    const dateFrom = searchParams.get('dateFrom')  ?? '';
    const dateTo   = searchParams.get('dateTo')    ?? '';
    const page     = Math.max(1, Number(searchParams.get('page')     ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') ?? 10)));
    const offset   = (page - 1) * pageSize;

    const conditions: string[] = [];
    const params: unknown[]    = [];
    let   idx = 1;

    if (search) {
      conditions.push(`("firstName" ILIKE $${idx} OR "lastName" ILIKE $${idx} OR "linkedinName" ILIKE $${idx} OR email ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }
    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      conditions.push(`status = $${idx}::"ApplicationStatus"`);
      params.push(status);
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

    const [rows, countRows] = await Promise.all([
      prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT id, "firstName", "lastName", email, zipcode, "linkedinName", "resumeFileName", "resumeFileType", "resumeFileSizeBytes", status, "createdAt"
         FROM "VolunteerApplication" ${WHERE}
         ORDER BY "createdAt" DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        ...params, pageSize, offset
      ),
      prisma.$queryRawUnsafe<{ total: number }[]>(
        `SELECT COUNT(*)::int AS total FROM "VolunteerApplication" ${WHERE}`,
        ...params
      ),
    ]);

    const total = countRows[0]?.total ?? 0;

    return NextResponse.json({
      data: rows.map((r) => ({
        ...r,
        createdAt: r.createdAt instanceof Date ? (r.createdAt as Date).toISOString() : r.createdAt,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (err) {
    console.error('[admin/volunteers] GET:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}
