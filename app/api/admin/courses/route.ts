import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma.config';

function cuid() {
  return 'c' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search   = (searchParams.get('search')  ?? '').trim();
    const trainer  = (searchParams.get('trainer') ?? '').trim();
    const status   =  searchParams.get('status')  ?? '';
    const sortBy   =  searchParams.get('sortBy')  ?? 'createdAt';
    const sortDir  =  searchParams.get('sortDir') ?? 'desc';
    const page     = Math.max(1, Number(searchParams.get('page')     ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') ?? 10)));
    const offset   = (page - 1) * pageSize;

    const SORT_COLS: Record<string, string> = {
      createdAt: '"createdAt"', name: 'name', trainerName: '"trainerName"',
      startDate: '"startDate"', endDate: '"endDate"', seatsAvailable: '"seatsAvailable"',
    };
    const col = SORT_COLS[sortBy] ?? '"createdAt"';
    const dir = sortDir === 'asc' ? 'ASC' : 'DESC';

    const conditions: string[] = [];
    const params: unknown[]    = [];
    let idx = 1;

    if (search) {
      conditions.push(`(name ILIKE $${idx} OR "trainerName" ILIKE $${idx})`);
      params.push(`%${search}%`); idx++;
    }
    if (trainer) {
      conditions.push(`"trainerName" ILIKE $${idx}`);
      params.push(`%${trainer}%`); idx++;
    }
    if (status && ['ACTIVE', 'INACTIVE'].includes(status)) {
      conditions.push(`status = $${idx}::"CourseStatus"`);
      params.push(status); idx++;
    }

    const WHERE = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows, countRows, trainerRows, statsRows] = await Promise.all([
      prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT id, name, "trainerName", duration,
                "startDate", "endDate", "seatsAvailable",
                "applicationsReceived", status, "createdAt", "updatedAt"
         FROM "AdminCourse" ${WHERE}
         ORDER BY ${col} ${dir}
         LIMIT $${idx} OFFSET $${idx + 1}`,
        ...params, pageSize, offset
      ),
      prisma.$queryRawUnsafe<{ total: number }[]>(
        `SELECT COUNT(*)::int AS total FROM "AdminCourse" ${WHERE}`,
        ...params
      ),
      prisma.$queryRawUnsafe<{ trainerName: string }[]>(
        `SELECT DISTINCT "trainerName" FROM "AdminCourse" ORDER BY "trainerName"`
      ),
      prisma.$queryRawUnsafe<{ total: number; ACTIVE: number; INACTIVE: number }[]>(
        `SELECT COUNT(*)::int AS total,
                COUNT(*) FILTER (WHERE status = 'ACTIVE')::int   AS "ACTIVE",
                COUNT(*) FILTER (WHERE status = 'INACTIVE')::int AS "INACTIVE"
         FROM "AdminCourse"`
      ),
    ]);

    const total    = countRows[0]?.total ?? 0;
    const statsRow = statsRows[0] ?? { total: 0, ACTIVE: 0, INACTIVE: 0 };
    const trainers = trainerRows.map((r) => r.trainerName);

    return NextResponse.json({
      data:       rows,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      stats:      statsRow,
      trainers,
    });
  } catch (err) {
    console.error('[admin/courses] GET error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, trainerName, duration, startDate, endDate, seatsAvailable } = body;
    if (!name || !trainerName || !duration || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const id = cuid();
    await prisma.$queryRawUnsafe(
      `INSERT INTO "AdminCourse" (id, name, "trainerName", duration, "startDate", "endDate",
         "seatsAvailable", "applicationsReceived", status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5::timestamp, $6::timestamp, $7, 0, 'ACTIVE'::"CourseStatus", NOW(), NOW())`,
      id, name, trainerName, duration, startDate, endDate, Number(seatsAvailable) || 0
    );
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error('[admin/courses] POST error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}
