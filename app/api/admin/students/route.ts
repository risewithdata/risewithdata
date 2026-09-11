import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET(_req: NextRequest) {
  try {
    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, "firstName", "lastName", email, active, "createdAt"
       FROM "User"
       WHERE role = 'STUDENT'::"Role"
       ORDER BY "createdAt" DESC`
    );
    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error('[admin/students] GET:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}
