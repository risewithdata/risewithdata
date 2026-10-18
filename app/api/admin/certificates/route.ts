import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma.config';

function cuid() {
  return 'c' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
}

const COURSE_SHORT_CODES: Record<string, string> = {
  'Starter':           'STR',
  'Core':              'COR',
  'Advanced':          'ADV',
  'Elite':             'ELT',
  'Cohort Lincoln':    'LIN',
  'November Cohort': 'WAS',
};

function getCourseShortCode(courseName: string): string {
  if (COURSE_SHORT_CODES[courseName]) return COURSE_SHORT_CODES[courseName];
  return courseName.replace(/\s+/g, '').slice(0, 3).toUpperCase();
}

export async function GET() {
  try {
    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT * FROM "Certificate" ORDER BY "createdAt" DESC`
    );
    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error('[admin/certificates] GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentName, studentEmail, courseName, trainerName, issuedDate } = body;

    if (!studentName || !studentEmail || !courseName || !trainerName || !issuedDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const shortCode = getCourseShortCode(courseName);
    const year = new Date(issuedDate).getFullYear();

    // Get next sequential number for this course+year
    const existing = await prisma.$queryRawUnsafe<{ count: number }[]>(
      `SELECT COUNT(*)::int AS count FROM "Certificate"
       WHERE "courseShortCode" = $1 AND EXTRACT(YEAR FROM "issuedDate") = $2`,
      shortCode, year
    );
    const seq = String((existing[0]?.count ?? 0) + 1).padStart(4, '0');
    const certificateNumber = `RWD-${shortCode}-${year}-${seq}`;

    const id = cuid();
    await prisma.$queryRawUnsafe(
      `INSERT INTO "Certificate" (id, "certificateNumber", "studentName", "studentEmail",
         "courseName", "courseShortCode", "trainerName", "issuedDate", status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::timestamp, 'ACTIVE'::"CertificateStatus", NOW(), NOW())`,
      id, certificateNumber, studentName, studentEmail, courseName, shortCode, trainerName, issuedDate
    );

    return NextResponse.json({ ok: true, certificateNumber });
  } catch (err) {
    console.error('[admin/certificates] POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
