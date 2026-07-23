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
      `SELECT id, "firstName", "lastName", email, zipcode, "linkedinName",
              "resumeFileName", "resumeFileType", "resumeFileSizeBytes",
              status, "adminNotes", "createdAt", "updatedAt"
       FROM "VolunteerApplication" WHERE id = $1`,
      id
    );
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const row = rows[0];
    return NextResponse.json({
      data: {
        ...row,
        createdAt: row.createdAt instanceof Date ? (row.createdAt as Date).toISOString() : row.createdAt,
        updatedAt: row.updatedAt instanceof Date ? (row.updatedAt as Date).toISOString() : row.updatedAt,
      },
    });
  } catch (err) {
    console.error('[admin/volunteers/[id]] GET:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body   = await req.json();
    const status: string = body.status;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT "firstName", "lastName", email, status AS "currentStatus"
       FROM "VolunteerApplication" WHERE id = $1`,
      id
    );
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const vol = rows[0] as { firstName: string; lastName: string; email: string; currentStatus: string };
    if (vol.currentStatus === status) return NextResponse.json({ ok: true });

    const rejectionReason: string = (body.rejectionReason ?? '').trim();
    if (status === 'REJECTED' && !rejectionReason) {
      return NextResponse.json({ error: 'Rejection reason is required.' }, { status: 400 });
    }

    await prisma.$queryRawUnsafe(
      `UPDATE "VolunteerApplication"
       SET status = $1::"ApplicationStatus", "adminNotes" = $2, "updatedAt" = NOW()
       WHERE id = $3`,
      status,
      status === 'REJECTED' ? rejectionReason : (body.adminNotes ?? null),
      id
    );

    let emailSent = false;
    let emailError: string | null = null;
    if (vol.email) {
      const emailPayload =
        status === 'APPROVED'
          ? {
              subject: '🎉 Your RiseWithData Volunteer Application Has Been Approved!',
              html:    volunteerApprovalHtml({ firstName: vol.firstName, siteUrl: SITE_URL }),
            }
          : {
              subject: 'Update on Your RiseWithData Volunteer Application',
              html:    volunteerRejectionHtml({ firstName: vol.firstName, rejectionReason, siteUrl: SITE_URL }),
            };
      try {
        await resend.emails.send({ from: FROM, to: [vol.email], ...emailPayload });
        emailSent = true;
      } catch (e) {
        emailError = e instanceof Error ? e.message : 'Email delivery failed';
        console.error('Volunteer status email failed:', e);
      }
    }

    return NextResponse.json({ ok: true, status, emailSent, emailError });
  } catch (err) {
    console.error('[admin/volunteers/[id]] PATCH:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

function volunteerApprovalHtml({ firstName, siteUrl }: { firstName: string; siteUrl: string }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

  <tr><td style="background:linear-gradient(135deg,#1C0F08 0%,#C88010 100%);padding:32px 36px;text-align:center;">
    <div style="font-size:40px;margin-bottom:8px;">🎉</div>
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Congratulations, ${firstName}!</h1>
    <p style="margin:8px 0 0;color:#fde68a;font-size:14px;">Your volunteer application has been approved</p>
  </td></tr>

  <tr><td style="padding:32px 36px;">
    <p style="margin:0 0 16px;color:#0f172a;font-size:15px;line-height:1.6;">
      We're excited to welcome you to the <strong>RiseWithData</strong> volunteer team! Your skills and dedication will make a real difference for our students and community.
    </p>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px 24px;margin:24px 0;">
      <h3 style="margin:0 0 8px;color:#92400e;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">What's Next</h3>
      <p style="margin:0;color:#78350f;font-size:14px;line-height:1.7;">
        Our team will reach out within 2–3 business days with your onboarding information, including your volunteer schedule and orientation details.
      </p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="${siteUrl}" style="background:#d97706;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;display:inline-block;">
        Visit RiseWithData →
      </a>
    </div>
    <p style="margin:0;color:#94a3b8;font-size:13px;text-align:center;">
      Questions? Email us at <a href="mailto:risewithdatausa@gmail.com" style="color:#64748b;">risewithdatausa@gmail.com</a>
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

function volunteerRejectionHtml({ firstName, rejectionReason, siteUrl }: { firstName: string; rejectionReason: string; siteUrl: string }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

  <tr><td style="background:linear-gradient(135deg,#1C0F08 0%,#8B5010 100%);padding:32px 36px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">RiseWithData</h1>
    <p style="margin:8px 0 0;color:#fde68a;font-size:14px;">Update on Your Volunteer Application</p>
  </td></tr>

  <tr><td style="padding:32px 36px;">
    <p style="margin:0 0 16px;color:#0f172a;font-size:15px;">Dear <strong>${firstName}</strong>,</p>
    <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.7;">
      Thank you for your interest in volunteering with <strong>RiseWithData</strong>. After careful review, we are unable to move forward with your application at this time.
    </p>
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px 24px;margin:24px 0;">
      <h3 style="margin:0 0 8px;color:#991b1b;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">Reason</h3>
      <p style="margin:0;color:#7f1d1d;font-size:14px;line-height:1.6;">${rejectionReason}</p>
    </div>
    <p style="margin:0;color:#475569;font-size:14px;line-height:1.7;">
      We encourage you to address the feedback above and consider re-applying in the future. We appreciate your time and commitment to our mission.
    </p>
    <p style="margin:16px 0 0;color:#94a3b8;font-size:13px;text-align:center;">
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
