import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const users = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, email, "firstName", "lastName", role, "createdAt"
       FROM "User" WHERE id = $1 LIMIT 1`,
      session.userId
    );
    if (!users.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const apps = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, "courseApplied", trainer, status, "createdAt", "updatedAt"
       FROM "StudentApplication"
       WHERE LOWER(email) = LOWER($1)
       ORDER BY "createdAt" DESC`,
      session.email
    );

    const u = users[0];
    return NextResponse.json({
      data: {
        id:        u.id,
        email:     u.email,
        firstName: u.firstName,
        lastName:  u.lastName,
        role:      u.role,
        createdAt: u.createdAt instanceof Date ? (u.createdAt as Date).toISOString() : u.createdAt,
        applications: apps.map((a) => ({
          ...a,
          createdAt: a.createdAt instanceof Date ? (a.createdAt as Date).toISOString() : a.createdAt,
          updatedAt: a.updatedAt instanceof Date ? (a.updatedAt as Date).toISOString() : a.updatedAt,
        })),
      }
    });
  } catch (err) {
    console.error('[student/profile] GET:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    // ── Update name ───────────────────────────────────────────────────────────
    if (body.firstName !== undefined || body.lastName !== undefined) {
      const first = (body.firstName ?? session.firstName).trim();
      const last  = (body.lastName  ?? session.lastName).trim();
      if (!first || !last) return NextResponse.json({ error: 'Name cannot be empty.' }, { status: 400 });

      await prisma.$queryRawUnsafe(
        `UPDATE "User" SET "firstName" = $1, "lastName" = $2, "updatedAt" = NOW() WHERE id = $3`,
        first, last, session.userId
      );
    }

    // ── Change password ───────────────────────────────────────────────────────
    if (body.currentPassword && body.newPassword) {
      if (body.newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
      }

      const users = await prisma.$queryRawUnsafe<{ passwordHash: string }[]>(
        `SELECT "passwordHash" FROM "User" WHERE id = $1 LIMIT 1`,
        session.userId
      );
      if (!users.length) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

      const valid = await bcrypt.compare(body.currentPassword, users[0].passwordHash);
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });

      const hash = await bcrypt.hash(body.newPassword, 12);
      await prisma.$queryRawUnsafe(
        `UPDATE "User" SET "passwordHash" = $1, "updatedAt" = NOW() WHERE id = $2`,
        hash, session.userId
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[student/profile] PATCH:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
