import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../prisma/prisma.config';

const resend   = new Resend(process.env.RESEND_API_KEY);
const FROM     = 'RiseWithData <noreply@risewithdata.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.risewithdata.com';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search   = (searchParams.get('search') ?? '').trim();
    const page     = Math.max(1, Number(searchParams.get('page')     ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') ?? 10)));
    const offset   = (page - 1) * pageSize;

    const conditions: string[] = [`role = 'INSTRUCTOR'::"Role"`];
    const params: unknown[]    = [];
    let   idx = 1;

    if (search) {
      conditions.push(`("firstName" ILIKE $${idx} OR "lastName" ILIKE $${idx} OR email ILIKE $${idx})`);
      params.push(`%${search}%`);
      idx++;
    }

    const WHERE = `WHERE ${conditions.join(' AND ')}`;

    const [rows, countRows] = await Promise.all([
      prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT id, email, "firstName", "lastName", active, "createdAt"
         FROM "User" ${WHERE}
         ORDER BY "createdAt" DESC
         LIMIT $${idx} OFFSET $${idx + 1}`,
        ...params, pageSize, offset
      ),
      prisma.$queryRawUnsafe<{ total: number }[]>(
        `SELECT COUNT(*)::int AS total FROM "User" ${WHERE}`,
        ...params
      ),
    ]);

    // For each instructor, count their assigned courses and enrolled students
    const enriched = await Promise.all(
      rows.map(async (inst) => {
        const name = `${inst.firstName} ${inst.lastName}`;
        const [courseCount, studentCount] = await Promise.all([
          prisma.$queryRawUnsafe<[{ count: bigint }]>(
            `SELECT COUNT(*) AS count FROM "AdminCourse" WHERE "trainerName" = $1`, name
          ),
          prisma.$queryRawUnsafe<[{ count: bigint }]>(
            `SELECT COUNT(*) AS count FROM "StudentApplication" WHERE trainer = $1 AND status = 'APPROVED'::"ApplicationStatus"`, name
          ),
        ]);
        return {
          ...inst,
          createdAt: inst.createdAt instanceof Date ? (inst.createdAt as Date).toISOString() : inst.createdAt,
          courseCount: Number(courseCount[0].count),
          studentCount: Number(studentCount[0].count),
        };
      })
    );

    return NextResponse.json({
      data: enriched,
      total: countRows[0]?.total ?? 0,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil((countRows[0]?.total ?? 0) / pageSize)),
    });
  } catch (err) {
    console.error('[admin/instructors] GET:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstName, lastName, email, password } = await req.json();
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existing = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM "User" WHERE LOWER(email) = LOWER($1)`, email
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    await prisma.$queryRawUnsafe(
      `INSERT INTO "User" (id, email, "passwordHash", "firstName", "lastName", role, active, "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, 'INSTRUCTOR'::"Role", true, NOW(), NOW())`,
      email.toLowerCase(), hash, firstName, lastName
    );

    await resend.emails.send({
      from:    FROM,
      to:      [email],
      subject: '🎉 Welcome to RiseWithData — Your Instructor Account is Ready!',
      html:    instructorWelcomeHtml({ firstName, lastName, email, password, siteUrl: SITE_URL }),
    }).catch((e) => console.error('Instructor welcome email failed:', e));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/instructors] POST:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await prisma.$queryRawUnsafe(
      `DELETE FROM "User" WHERE id = $1 AND role = 'INSTRUCTOR'::"Role"`, id
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/instructors] DELETE:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

function instructorWelcomeHtml({ firstName, lastName, email, password, siteUrl }: {
  firstName: string; lastName: string; email: string; password: string; siteUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

  <tr><td style="background:linear-gradient(135deg,#1C0F08 0%,#E8A020 100%);padding:32px 36px;text-align:center;">
    <div style="font-size:40px;margin-bottom:8px;">👋</div>
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Welcome, ${firstName}!</h1>
    <p style="margin:8px 0 0;color:#fde68a;font-size:14px;">Your RiseWithData instructor account is ready</p>
  </td></tr>

  <tr><td style="padding:32px 36px;">
    <p style="margin:0 0 20px;color:#0f172a;font-size:15px;line-height:1.6;">
      Hi <strong>${firstName} ${lastName}</strong>, your instructor account has been created. You can log in immediately using the credentials below.
    </p>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px 24px;margin:0 0 24px;">
      <h3 style="margin:0 0 12px;color:#92400e;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">Your Login Credentials</h3>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0;color:#78350f;font-size:13px;font-weight:600;width:90px;">Email</td>
          <td style="padding:6px 0;color:#0f172a;font-size:14px;font-family:monospace;">${email}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#78350f;font-size:13px;font-weight:600;">Password</td>
          <td style="padding:6px 0;color:#0f172a;font-size:14px;font-family:monospace;">${password}</td>
        </tr>
      </table>
    </div>

    <p style="margin:0 0 20px;color:#64748b;font-size:13px;line-height:1.6;">
      For security, please change your password after your first login via the Profile section in your dashboard.
    </p>

    <div style="text-align:center;margin:24px 0;">
      <a href="${siteUrl}/login" style="background:#d97706;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;display:inline-block;">
        Log In to Dashboard →
      </a>
    </div>

    <p style="margin:0;color:#94a3b8;font-size:13px;text-align:center;">
      Questions? <a href="mailto:risewithdatausa@gmail.com" style="color:#64748b;">risewithdatausa@gmail.com</a>
    </p>
  </td></tr>

  <tr><td style="background:#f1f5f9;padding:16px 36px;text-align:center;">
    <p style="margin:0;color:#94a3b8;font-size:12px;">© ${new Date().getFullYear()} RiseWithData · <a href="${siteUrl}" style="color:#94a3b8;">risewithdata.com</a></p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
