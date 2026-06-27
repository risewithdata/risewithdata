import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '../../../../../prisma/prisma.config';

const resend   = new Resend(process.env.RESEND_API_KEY);
const FROM     = 'RiseWithData <onboarding@resend.dev>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://risewithdata.com';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, "firstName", "lastName", email, zipcode, "linkedinName",
              "courseApplied", trainer, status, "adminNotes", "rejectionReason",
              "resumeFileName", "resumeFileType", "resumeFileSizeBytes",
              "createdAt", "updatedAt"
       FROM "StudentApplication" WHERE id = $1`,
      id
    );
    if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: rows[0] });
  } catch (err) {
    console.error('[applications/[id]] GET:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id }   = await params;
    const body     = await req.json();

    // ── Save admin notes ──────────────────────────────────────────────────────
    if ('adminNotes' in body && !body.status) {
      await prisma.$queryRawUnsafe(
        `UPDATE "StudentApplication" SET "adminNotes" = $1, "updatedAt" = NOW() WHERE id = $2`,
        body.adminNotes ?? null, id
      );
      return NextResponse.json({ ok: true });
    }

    // ── Status update (approve / reject) ─────────────────────────────────────
    const status: string = body.status;
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Fetch application so we can email the student + update course seats
    const appRows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT "firstName", "lastName", email, "courseApplied", status AS "currentStatus"
       FROM "StudentApplication" WHERE id = $1`,
      id
    );
    if (!appRows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const app = appRows[0] as {
      firstName: string; lastName: string; email: string;
      courseApplied: string | null; currentStatus: string;
    };

    if (app.currentStatus === status) {
      return NextResponse.json({ ok: true, message: 'Status unchanged' });
    }

    if (status === 'APPROVED') {
      // Update status
      await prisma.$queryRawUnsafe(
        `UPDATE "StudentApplication"
         SET status = 'APPROVED'::"ApplicationStatus", "updatedAt" = NOW()
         WHERE id = $1`,
        id
      );

      // Decrease seat count (only if seats > 0 and course name matches)
      if (app.courseApplied) {
        await prisma.$queryRawUnsafe(
          `UPDATE "AdminCourse"
           SET "seatsAvailable" = GREATEST(0, "seatsAvailable" - 1), "updatedAt" = NOW()
           WHERE name = $1 AND "seatsAvailable" > 0`,
          app.courseApplied
        );
      }

      // Check if student already has an account
      const existingUser = await prisma.$queryRawUnsafe<{ id: string }[]>(
        `SELECT id FROM "User" WHERE LOWER(email) = LOWER($1) LIMIT 1`,
        app.email
      );
      const hasAccount = existingUser.length > 0;

      // Send approval email
      if (app.email) {
        await resend.emails.send({
          from:    FROM,
          to:      [app.email],
          subject: '🎉 Your RiseWithData Application Has Been Approved!',
          html:    approvalEmailHtml({
            firstName:     app.firstName,
            lastName:      app.lastName,
            email:         app.email,
            courseApplied: app.courseApplied,
            siteUrl:       SITE_URL,
            hasAccount,
          }),
        }).catch((e) => console.error('Approval email failed:', e));
      }

    } else {
      // REJECTED
      const rejectionReason: string = (body.rejectionReason ?? '').trim();
      if (!rejectionReason) {
        return NextResponse.json({ error: 'Rejection reason is required.' }, { status: 400 });
      }

      await prisma.$queryRawUnsafe(
        `UPDATE "StudentApplication"
         SET status = 'REJECTED'::"ApplicationStatus",
             "rejectionReason" = $1,
             "updatedAt" = NOW()
         WHERE id = $2`,
        rejectionReason, id
      );

      // Send rejection email
      if (app.email) {
        await resend.emails.send({
          from:    FROM,
          to:      [app.email],
          subject: 'Update on Your RiseWithData Application',
          html:    rejectionEmailHtml({
            firstName:       app.firstName,
            courseApplied:   app.courseApplied,
            rejectionReason: rejectionReason,
            siteUrl:         SITE_URL,
          }),
        }).catch((e) => console.error('Rejection email failed:', e));
      }
    }

    return NextResponse.json({ ok: true, status });
  } catch (err) {
    console.error('[applications/[id]] PATCH:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Server error' }, { status: 500 });
  }
}

// ── Email Templates ────────────────────────────────────────────────────────

function approvalEmailHtml({ firstName, lastName, email, courseApplied, siteUrl, hasAccount }: {
  firstName: string; lastName: string; email: string; courseApplied: string | null; siteUrl: string; hasAccount: boolean;
}) {
  const registerUrl = `${siteUrl}/register?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`;

  const ctaBlock = hasAccount
    ? `<div style="text-align:center;margin:28px 0;">
        <a href="${siteUrl}/login" style="background:#059669;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;display:inline-block;">
          Go to Dashboard →
        </a>
      </div>
      <p style="margin:8px 0 0;color:#94a3b8;font-size:13px;text-align:center;">
        Log in with your existing account to access your course.
      </p>`
    : `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin:24px 0;">
        <h3 style="margin:0 0 8px;color:#065f46;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">Your Next Step</h3>
        <p style="margin:0 0 12px;color:#047857;font-size:14px;line-height:1.6;">
          Create your student account to access your course materials, schedule, and community.
        </p>
        <div style="text-align:center;">
          <a href="${registerUrl}" style="background:#059669;color:#fff;text-decoration:none;padding:13px 28px;border-radius:10px;font-weight:700;font-size:14px;display:inline-block;">
            Create My Account →
          </a>
        </div>
      </div>
      <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;text-align:center;">
        Button not working? Copy and paste this link into your browser:
      </p>
      <p style="margin:0 0 20px;color:#64748b;font-size:12px;text-align:center;word-break:break-all;">
        ${registerUrl}
      </p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

  <tr><td style="background:linear-gradient(135deg,#065f46 0%,#059669 100%);padding:32px 36px;text-align:center;">
    <div style="font-size:40px;margin-bottom:8px;">🎉</div>
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Congratulations, ${firstName}!</h1>
    <p style="margin:8px 0 0;color:#a7f3d0;font-size:14px;">Your application has been approved</p>
  </td></tr>

  <tr><td style="padding:32px 36px;">
    <p style="margin:0 0 16px;color:#0f172a;font-size:15px;line-height:1.6;">
      We are thrilled to inform you that your application to <strong>RiseWithData</strong>
      ${courseApplied ? `for the <strong>${courseApplied}</strong> program` : ''} has been
      <strong style="color:#059669;">approved</strong>!
    </p>

    ${ctaBlock}

    <div style="border-top:1px solid #e2e8f0;margin:24px 0 20px;"></div>

    <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
      Once your account is set up, you'll be able to view your course schedule, access materials,
      and connect with your trainer and fellow students.
    </p>

    <p style="margin:16px 0 0;color:#94a3b8;font-size:13px;text-align:center;">
      Welcome to the RiseWithData family! We can't wait to see you grow. 🚀
    </p>
  </td></tr>

  <tr><td style="background:#f1f5f9;padding:16px 36px;text-align:center;">
    <p style="margin:0;color:#94a3b8;font-size:12px;">
      Questions? Contact us at
      <a href="mailto:risewithdatausa@gmail.com" style="color:#64748b;">risewithdatausa@gmail.com</a>
      &nbsp;·&nbsp;
      <a href="${siteUrl}" style="color:#94a3b8;">risewithdata.com</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function rejectionEmailHtml({ firstName, courseApplied, rejectionReason, siteUrl }: {
  firstName: string; courseApplied: string | null; rejectionReason: string; siteUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

  <tr><td style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:32px 36px;text-align:center;">
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">RiseWithData</h1>
    <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">Update on Your Application</p>
  </td></tr>

  <tr><td style="padding:32px 36px;">
    <p style="margin:0 0 16px;color:#0f172a;font-size:15px;">Dear <strong>${firstName}</strong>,</p>
    <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.7;">
      Thank you for taking the time to apply to <strong>RiseWithData</strong>
      ${courseApplied ? `for the <strong>${courseApplied}</strong> program` : ''}.
      After careful review, we are unable to move forward with your application at this time.
    </p>

    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px 24px;margin:24px 0;">
      <h3 style="margin:0 0 8px;color:#991b1b;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">Reason for Decision</h3>
      <p style="margin:0;color:#7f1d1d;font-size:14px;line-height:1.6;">${rejectionReason}</p>
    </div>

    <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.7;">
      We encourage you to address the feedback above and consider re-applying for a future cohort.
      Our team is here to help you grow, and we hope to see you in an upcoming program.
    </p>

    <p style="margin:0;color:#94a3b8;font-size:13px;text-align:center;">
      If you have questions, contact us at
      <a href="mailto:risewithdatausa@gmail.com" style="color:#2563eb;">risewithdatausa@gmail.com</a>
    </p>
  </td></tr>

  <tr><td style="background:#f1f5f9;padding:16px 36px;text-align:center;">
    <p style="margin:0;color:#94a3b8;font-size:12px;">
      © ${new Date().getFullYear()} RiseWithData · <a href="${siteUrl}" style="color:#94a3b8;">risewithdata.com</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
