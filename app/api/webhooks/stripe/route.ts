import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { prisma } from '../../../../prisma/prisma.config';

const resend    = new Resend(process.env.RESEND_API_KEY);
const FROM      = 'RiseWithData <noreply@risewithdata.com>';
const ADMIN_TO  = process.env.CONTACT_EMAIL_TO ?? 'risewithdatausa@gmail.com';
const SITE_URL  = process.env.APP_URL ?? 'https://www.risewithdata.com';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body      = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';
  const secret    = process.env.STRIPE_WEBHOOK_SECRET ?? '';

  let event: Stripe.Event;

  try {
    event = secret
      ? stripe.webhooks.constructEvent(body, signature, secret)
      : JSON.parse(body);
  } catch (err) {
    console.error('[stripe-webhook] signature error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const enrollmentId = session.metadata?.enrollmentId;
      if (!enrollmentId) return NextResponse.json({ ok: true });

      if (session.payment_status === 'paid') {
        // Idempotency: skip if already processed (duplicate webhook delivery)
        const already = await prisma.$queryRawUnsafe<{ status: string }[]>(
          `SELECT status FROM "Enrollment" WHERE id = $1`,
          enrollmentId
        );
        if (already[0]?.status === 'PAID') {
          return NextResponse.json({ ok: true });
        }

        await prisma.$queryRawUnsafe(
          `UPDATE "Enrollment"
           SET status = 'PAID'::"EnrollmentStatus",
               "stripePaymentIntentId" = $1,
               "paidAt" = NOW(),
               "updatedAt" = NOW()
           WHERE id = $2`,
          session.payment_intent as string,
          enrollmentId
        );

        // Auto-enroll: look up the latest ACTIVE AdminCourse and create
        // an APPROVED StudentApplication so the student's dashboard shows the course.
        const fullName  = session.metadata?.fullName ?? '';
        const email     = session.customer_email ?? '';
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0] ?? '';
        const lastName  = nameParts.slice(1).join(' ') || firstName;

        const courses = await prisma.$queryRawUnsafe<{ id: string; name: string }[]>(
          `SELECT id, name FROM "AdminCourse"
           WHERE status = 'ACTIVE'::"CourseStatus"
           ORDER BY "createdAt" DESC
           LIMIT 1`
        );

        if (courses.length > 0 && email) {
          const course     = courses[0];
          const appId      = 'c' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
          const existingRows = await prisma.$queryRawUnsafe<{ id: string }[]>(
            `SELECT id FROM "StudentApplication"
             WHERE LOWER(email) = LOWER($1) AND "courseApplied" = $2
             LIMIT 1`,
            email, course.name
          );

          if (existingRows.length === 0) {
            await prisma.$queryRawUnsafe(
              `INSERT INTO "StudentApplication"
                 (id, "firstName", "lastName", email, zipcode, "linkedinName", "courseApplied",
                  "resumeFileName", "resumeFileType", "resumeFileSizeBytes", status, "createdAt", "updatedAt")
               VALUES ($1,$2,$3,$4,'','',$5,'','',0,'APPROVED'::"ApplicationStatus",NOW(),NOW())`,
              appId, firstName, lastName, email, course.name
            );
          } else {
            await prisma.$queryRawUnsafe(
              `UPDATE "StudentApplication"
               SET status = 'APPROVED'::"ApplicationStatus", "updatedAt" = NOW()
               WHERE id = $1`,
              existingRows[0].id
            );
          }
        }

        // Fetch enrollment details for emails (phone, zipcode, amount)
        const enrollmentRows = await prisma.$queryRawUnsafe<{
          phone: string; zipcode: string; courseName: string; amount: number;
        }[]>(
          `SELECT phone, zipcode, "courseName", amount FROM "Enrollment" WHERE id = $1`,
          enrollmentId
        );
        const enrollment   = enrollmentRows[0];
        const assignedCourse = courses[0]?.name ?? enrollment?.courseName ?? '';
        const amountDollars  = enrollment ? (enrollment.amount / 100).toFixed(2) : '0.00';
        const registerUrl    = `${SITE_URL}/register?${new URLSearchParams({ email, firstName, lastName }).toString()}`;

        // Email 1 — Student confirmation
        if (email) {
          await resend.emails.send({
            from:    FROM,
            to:      [email],
            subject: 'Payment Confirmed — Welcome to RiseWithData',
            html:    studentConfirmationHtml({
              firstName, fullName, email,
              courseName:      enrollment?.courseName ?? '',
              assignedCourse,
              amountDollars,
              registerUrl,
            }),
          }).catch((e) => console.error('[webhook] student email failed:', e));
        }

        // Email 2 — Admin notification
        await resend.emails.send({
          from:    FROM,
          to:      [ADMIN_TO],
          subject: `New Payment — ${fullName} · ${enrollment?.courseName ?? ''} · $${amountDollars}`,
          html:    adminNotificationHtml({
            fullName, email,
            phone:         enrollment?.phone   ?? '',
            zipcode:       enrollment?.zipcode ?? '',
            courseName:    enrollment?.courseName ?? '',
            assignedCourse,
            amountDollars,
            adminUrl:      `${SITE_URL}/dashboard/admin/payments`,
          }),
        }).catch((e) => console.error('[webhook] admin email failed:', e));
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const enrollmentId = session.metadata?.enrollmentId;
      if (enrollmentId) {
        await prisma.$queryRawUnsafe(
          `UPDATE "Enrollment" SET status = 'CANCELLED'::"EnrollmentStatus", "updatedAt" = NOW() WHERE id = $1`,
          enrollmentId
        );
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object as Stripe.PaymentIntent;
      await prisma.$queryRawUnsafe(
        `UPDATE "Enrollment"
         SET status = 'FAILED'::"EnrollmentStatus", "updatedAt" = NOW()
         WHERE "stripePaymentIntentId" = $1 OR "stripeSessionId" IN (
           SELECT id FROM "Enrollment" WHERE "stripePaymentIntentId" = $1 LIMIT 1
         )`,
        pi.id
      );
    }
  } catch (err) {
    console.error('[stripe-webhook] handler error:', err);
  }

  return NextResponse.json({ ok: true });
}

// ── Email templates ────────────────────────────────────────────────────────

function studentConfirmationHtml(d: {
  firstName: string; fullName: string; email: string;
  courseName: string; assignedCourse: string;
  amountDollars: string; registerUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

  <tr><td style="background:linear-gradient(135deg,#1C0F08 0%,#C88010 100%);padding:32px 36px;text-align:center;">
    <div style="font-size:40px;margin-bottom:8px;">✅</div>
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Payment Confirmed!</h1>
    <p style="margin:8px 0 0;color:#F5C040;font-size:14px;">Welcome to RiseWithData, ${d.firstName}</p>
  </td></tr>

  <tr><td style="padding:32px 36px;">
    <p style="margin:0 0 20px;color:#0f172a;font-size:15px;line-height:1.6;">
      Your enrollment is confirmed. Here's a summary of your payment:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
      <tr style="background:#f8fafc;">
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.04em;width:130px;">Name</td>
        <td style="padding:10px 16px;font-size:14px;color:#0f172a;">${d.fullName}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.04em;border-top:1px solid #e2e8f0;">Email</td>
        <td style="padding:10px 16px;font-size:14px;color:#0f172a;border-top:1px solid #e2e8f0;">${d.email}</td>
      </tr>
      <tr style="background:#f8fafc;">
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.04em;border-top:1px solid #e2e8f0;">Plan</td>
        <td style="padding:10px 16px;font-size:14px;color:#0f172a;border-top:1px solid #e2e8f0;">${d.courseName} Plan</td>
      </tr>
      ${d.assignedCourse ? `<tr>
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.04em;border-top:1px solid #e2e8f0;">Course</td>
        <td style="padding:10px 16px;font-size:14px;color:#0f172a;border-top:1px solid #e2e8f0;">${d.assignedCourse}</td>
      </tr>` : ''}
      <tr style="background:#f0fdf4;">
        <td style="padding:12px 16px;font-size:12px;font-weight:700;color:#065f46;text-transform:uppercase;letter-spacing:.04em;border-top:1px solid #e2e8f0;">Amount Paid</td>
        <td style="padding:12px 16px;font-size:16px;font-weight:700;color:#065f46;border-top:1px solid #e2e8f0;">$${d.amountDollars}</td>
      </tr>
    </table>

    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
      <h3 style="margin:0 0 10px;color:#1e40af;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">What Happens Next</h3>
      <ul style="margin:0;padding:0 0 0 18px;color:#1d4ed8;font-size:14px;line-height:1.8;">
        <li>Create your student account using the button below</li>
        <li>Your course will appear in your dashboard immediately after login</li>
        <li>Our team will follow up with session details and schedule</li>
      </ul>
    </div>

    <div style="text-align:center;margin:28px 0 8px;">
      <a href="${d.registerUrl}" style="background:#2563eb;color:#fff;text-decoration:none;padding:14px 36px;border-radius:10px;font-weight:700;font-size:15px;display:inline-block;">
        Create Your Account →
      </a>
    </div>
    <p style="margin:8px 0 0;color:#94a3b8;font-size:12px;text-align:center;">
      Button not working? Copy this link: <span style="color:#64748b;word-break:break-all;">${d.registerUrl}</span>
    </p>
  </td></tr>

  <tr><td style="background:#f1f5f9;padding:16px 36px;text-align:center;">
    <p style="margin:0;color:#94a3b8;font-size:12px;">
      Questions? <a href="mailto:risewithdatausa@gmail.com" style="color:#64748b;">risewithdatausa@gmail.com</a>
      &nbsp;·&nbsp; © ${new Date().getFullYear()} RiseWithData
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function adminNotificationHtml(d: {
  fullName: string; email: string; phone: string; zipcode: string;
  courseName: string; assignedCourse: string;
  amountDollars: string; adminUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

  <tr><td style="background:linear-gradient(135deg,#1C0F08 0%,#8B5010 100%);padding:28px 36px;">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">RiseWithData</h1>
    <p style="margin:6px 0 0;color:#F5C040;font-size:13px;">💰 New Payment Received</p>
  </td></tr>

  <tr><td style="padding:32px 36px;">
    <p style="margin:0 0 20px;color:#0f172a;font-size:15px;font-weight:600;">
      A new student has enrolled and completed payment.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${adminRow('Name',    d.fullName)}
      ${adminRow('Email',   `<a href="mailto:${d.email}" style="color:#2563eb;">${d.email}</a>`)}
      ${adminRow('Phone',   d.phone || '—')}
      ${adminRow('Zipcode', d.zipcode || '—')}
      ${adminRow('Plan',    d.courseName + ' Plan')}
      ${d.assignedCourse ? adminRow('Assigned Course', `<strong>${d.assignedCourse}</strong>`) : ''}
      ${adminRow('Amount',  `<strong style="color:#059669;">$${d.amountDollars}</strong>`)}
      ${adminRow('Time',    new Date().toUTCString())}
    </table>

    <div style="text-align:center;margin:28px 0 8px;">
      <a href="${d.adminUrl}" style="background:#1e293b;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:700;font-size:14px;display:inline-block;">
        View in Admin Dashboard →
      </a>
    </div>
  </td></tr>

  <tr><td style="background:#f1f5f9;padding:16px 36px;text-align:center;">
    <p style="margin:0;color:#94a3b8;font-size:12px;">
      © ${new Date().getFullYear()} RiseWithData · Automated payment notification
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

function adminRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:12px;font-weight:600;width:130px;vertical-align:top;text-transform:uppercase;letter-spacing:.04em;">
        ${label}
      </td>
      <td style="padding:9px 0;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:14px;">
        ${value}
      </td>
    </tr>
  `;
}

