import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSession } from '../../../../../lib/auth';
import { prisma } from '../../../../../prisma/prisma.config';

const resend   = new Resend(process.env.RESEND_API_KEY);
const FROM     = 'RiseWithData <noreply@risewithdata.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.risewithdata.com';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, email, "firstName", "lastName", active, "createdAt"
       FROM "User" WHERE id = $1 AND role = 'INSTRUCTOR'::"Role"`,
      id
    );
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const inst = rows[0];
    const name = `${inst.firstName} ${inst.lastName}`;

    const [courses, students, announcements, materials, slots] = await Promise.all([
      prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT id, name, duration, "startDate", "endDate", "seatsAvailable", "applicationsReceived", status
         FROM "AdminCourse" WHERE "trainerName" = $1 ORDER BY "createdAt" DESC`,
        name
      ),
      prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT id, "firstName", "lastName", email, "courseApplied", "createdAt"
         FROM "StudentApplication"
         WHERE trainer = $1 AND status = 'APPROVED'::"ApplicationStatus"
         ORDER BY "createdAt" DESC`,
        name
      ),
      prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) AS count FROM "CourseAnnouncement" WHERE "postedBy" = $1`,
        inst.email as string
      ),
      prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) AS count FROM "CourseMaterial" WHERE "uploadedBy" = $1`,
        inst.email as string
      ),
      prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT id, "courseName", title, "slotDate", "startTime", "endTime", location
         FROM "CourseScheduleSlot"
         WHERE "courseId" IN (SELECT id FROM "AdminCourse" WHERE "trainerName" = $1)
         AND "slotDate" >= NOW()
         ORDER BY "slotDate" ASC LIMIT 5`,
        name
      ),
    ]);

    return NextResponse.json({
      instructor: {
        ...inst,
        createdAt: inst.createdAt instanceof Date ? (inst.createdAt as Date).toISOString() : inst.createdAt,
      },
      courses: courses.map((c) => ({
        ...c,
        startDate: c.startDate instanceof Date ? (c.startDate as Date).toISOString() : c.startDate,
        endDate:   c.endDate   instanceof Date ? (c.endDate   as Date).toISOString() : c.endDate,
      })),
      students: students.map((s) => ({
        ...s,
        createdAt: s.createdAt instanceof Date ? (s.createdAt as Date).toISOString() : s.createdAt,
      })),
      stats: {
        totalCourses:       courses.length,
        totalStudents:      students.length,
        totalAnnouncements: Number(announcements[0].count),
        totalMaterials:     Number(materials[0].count),
      },
      upcomingSlots: slots.map((s) => ({
        ...s,
        slotDate: s.slotDate instanceof Date ? (s.slotDate as Date).toISOString() : s.slotDate,
      })),
    });
  } catch (err) {
    console.error('[admin/instructors/[id]] GET:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id }     = await params;
    const body       = await req.json();
    const { action, reason } = body as { action: 'approve' | 'reject'; reason?: string };

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    if (action === 'reject' && !reason?.trim()) {
      return NextResponse.json({ error: 'Reason is required when rejecting.' }, { status: 400 });
    }

    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT email, "firstName", "lastName", active
       FROM "User" WHERE id = $1 AND role = 'INSTRUCTOR'::"Role"`,
      id
    );
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const inst = rows[0] as { email: string; firstName: string; lastName: string; active: boolean };

    const newActive = action === 'approve';
    await prisma.$queryRawUnsafe(
      `UPDATE "User" SET active = $1, "updatedAt" = NOW() WHERE id = $2`,
      newActive, id
    );

    let emailSent = false;
    let emailError: string | null = null;
    try {
      await resend.emails.send({
        from:    FROM,
        to:      [inst.email],
        subject: newActive
          ? '✅ Your RiseWithData Instructor Account Has Been Approved!'
          : 'Update on Your RiseWithData Instructor Account',
        html: newActive
          ? instructorApprovedHtml({ firstName: inst.firstName, email: inst.email, siteUrl: SITE_URL })
          : instructorRejectedHtml({ firstName: inst.firstName, reason: reason!.trim(), siteUrl: SITE_URL }),
      });
      emailSent = true;
    } catch (e) {
      emailError = e instanceof Error ? e.message : 'Email failed';
      console.error('Instructor status email failed:', e);
    }

    return NextResponse.json({ ok: true, active: newActive, emailSent, emailError });
  } catch (err) {
    console.error('[admin/instructors/[id]] PATCH:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

function instructorApprovedHtml({ firstName, email, siteUrl }: { firstName: string; email: string; siteUrl: string }) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
  <tr><td style="background:linear-gradient(135deg,#1C0F08 0%,#8B5010 100%);padding:32px 36px;text-align:center;">
    <div style="font-size:40px;margin-bottom:8px;">✅</div>
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Welcome, ${firstName}!</h1>
    <p style="margin:8px 0 0;color:#F5C040;font-size:14px;">Your instructor account has been approved</p>
  </td></tr>
  <tr><td style="padding:32px 36px;">
    <p style="margin:0 0 16px;color:#0f172a;font-size:15px;line-height:1.6;">
      Your <strong>RiseWithData</strong> instructor account is now active. You can log in using your registered email address.
    </p>
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px 24px;margin:24px 0;">
      <h3 style="margin:0 0 8px;color:#1e3a5f;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">Your Login Details</h3>
      <p style="margin:0;color:#1e40af;font-size:14px;"><strong>Email:</strong> ${email}</p>
      <p style="margin:6px 0 0;color:#475569;font-size:13px;">Use the password you set when your account was created.</p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="${siteUrl}/login" style="background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;display:inline-block;">
        Go to Dashboard →
      </a>
    </div>
    <p style="margin:0;color:#94a3b8;font-size:13px;text-align:center;">Questions? Email us at <a href="mailto:risewithdatausa@gmail.com" style="color:#64748b;">risewithdatausa@gmail.com</a></p>
  </td></tr>
  <tr><td style="background:#f1f5f9;padding:16px 36px;text-align:center;">
    <p style="margin:0;color:#94a3b8;font-size:12px;">© ${new Date().getFullYear()} RiseWithData · <a href="${siteUrl}" style="color:#94a3b8;">risewithdata.com</a></p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function instructorRejectedHtml({ firstName, reason, siteUrl }: { firstName: string; reason: string; siteUrl: string }) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
  <tr><td style="background:linear-gradient(135deg,#1C0F08 0%,#8B5010 100%);padding:32px 36px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">RiseWithData</h1>
    <p style="margin:8px 0 0;color:#F5C040;font-size:14px;">Update on Your Instructor Account</p>
  </td></tr>
  <tr><td style="padding:32px 36px;">
    <p style="margin:0 0 16px;color:#0f172a;font-size:15px;">Dear <strong>${firstName}</strong>,</p>
    <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.7;">
      Your <strong>RiseWithData</strong> instructor account has been deactivated. Here is the reason provided:
    </p>
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px 24px;margin:24px 0;">
      <h3 style="margin:0 0 8px;color:#991b1b;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">Reason</h3>
      <p style="margin:0;color:#7f1d1d;font-size:14px;line-height:1.6;">${reason}</p>
    </div>
    <p style="margin:0;color:#475569;font-size:14px;line-height:1.7;">
      If you believe this is an error or have questions, please reach out to our team directly.
    </p>
    <p style="margin:16px 0 0;color:#94a3b8;font-size:13px;text-align:center;">
      Contact us at <a href="mailto:risewithdatausa@gmail.com" style="color:#64748b;">risewithdatausa@gmail.com</a>
    </p>
  </td></tr>
  <tr><td style="background:#f1f5f9;padding:16px 36px;text-align:center;">
    <p style="margin:0;color:#94a3b8;font-size:12px;">© ${new Date().getFullYear()} RiseWithData · <a href="${siteUrl}" style="color:#94a3b8;">risewithdata.com</a></p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}
