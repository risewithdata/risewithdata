import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../../prisma/prisma.config';
import { signToken, setSessionCookie } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, lastName, password } = await req.json();

    if (!email || !firstName || !lastName || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    // Email must belong to an approved application.
    // Fallback: if the webhook hasn't fired yet (race condition) or no ACTIVE
    // course existed at payment time, check for a PAID Enrollment and create
    // the StudentApplication on the spot so registration succeeds.
    let approved = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM "StudentApplication"
       WHERE LOWER(email) = LOWER($1) AND status = 'APPROVED'::"ApplicationStatus"
       LIMIT 1`,
      email
    );

    if (!approved.length) {
      const paidEnrollment = await prisma.$queryRawUnsafe<{
        id: string; fullName: string; courseName: string;
      }[]>(
        `SELECT id, "fullName", "courseName"
         FROM "Enrollment"
         WHERE LOWER(email) = LOWER($1) AND status = 'PAID'::"EnrollmentStatus"
         ORDER BY "paidAt" DESC LIMIT 1`,
        email
      );

      if (!paidEnrollment.length) {
        return NextResponse.json(
          { error: 'No approved application found for this email address.' },
          { status: 403 }
        );
      }

      // Create the StudentApplication now (webhook was too slow or missed a course)
      const nameParts   = (paidEnrollment[0].fullName ?? '').trim().split(' ');
      const fn          = nameParts[0] ?? firstName;
      const ln          = nameParts.slice(1).join(' ') || fn;

      const courses = await prisma.$queryRawUnsafe<{ name: string }[]>(
        `SELECT name FROM "AdminCourse"
         WHERE status = 'ACTIVE'::"CourseStatus"
         ORDER BY "createdAt" DESC LIMIT 1`
      );
      const courseApplied = courses[0]?.name ?? null;

      const appId = 'c' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
      await prisma.$queryRawUnsafe(
        `INSERT INTO "StudentApplication"
           (id, "firstName", "lastName", email, zipcode, "linkedinName", "courseApplied",
            "resumeFileName", "resumeFileType", "resumeFileSizeBytes", status, "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,'','',$5,'','',0,'APPROVED'::"ApplicationStatus",NOW(),NOW())`,
        appId, fn, ln, email.toLowerCase().trim(), courseApplied
      );
      approved = [{ id: appId }];
    }

    // Check if account already exists
    const existing = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM "User" WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      email
    );
    if (existing.length) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Generate cuid-like id
    const newId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    await prisma.$queryRawUnsafe(
      `INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", role, active, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, 'STUDENT'::"Role", true, NOW(), NOW())`,
      newId, email.toLowerCase().trim(), passwordHash,
      firstName.trim(), lastName.trim()
    );

    // Auto sign-in after registration
    const token = await signToken({
      userId:    newId,
      email:     email.toLowerCase().trim(),
      role:      'STUDENT',
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
    });
    const cookie = setSessionCookie(token);

    const res = NextResponse.json({ ok: true, redirect: '/dashboard/student' });
    res.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof res.cookies.set>[2]);
    return res;
  } catch (err) {
    console.error('[register] POST:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
