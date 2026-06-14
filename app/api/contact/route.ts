import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '../../../prisma/prisma.config';
import { ContactSchema } from '@features/contact/schemas/contact.schema';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL_TO ?? 'risewithdatausa@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const { firstName, lastName, email, message } = parsed.data;

    // 1. Save to database
    await prisma.contactSubmission.create({
      data: { firstName, lastName, email, message },
    });

    // 2. Send email via Resend
    await resend.emails.send({
      from:    'RiseWithData Contact <onboarding@resend.dev>',
      to:      [TO_EMAIL],
      replyTo: email,
      subject: `New Message from ${firstName} ${lastName}`,
      html:    buildEmailHtml({ firstName, lastName, email, message }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact/route] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function buildEmailHtml(data: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"/></head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
        <tr><td align="center">
          <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

            <tr>
              <td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:28px 36px;">
                <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">RiseWithData</h1>
                <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">New Contact Form Message</p>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 36px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${row('Name',    `${data.firstName} ${data.lastName}`)}
                  ${row('Email',  `<a href="mailto:${data.email}" style="color:#3b82f6;">${data.email}</a>`)}
                  ${row('Date',   new Date().toUTCString())}
                </table>

                <div style="margin-top:24px;border-top:1px solid #f1f5f9;padding-top:24px;">
                  <p style="margin:0 0 10px;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;">Message</p>
                  <p style="margin:0;color:#0f172a;font-size:14px;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
                </div>

                <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;">
                  Reply directly to this email to reach ${data.firstName}.
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f1f5f9;padding:16px 36px;text-align:center;">
                <p style="margin:0;color:#94a3b8;font-size:12px;">
                  © ${new Date().getFullYear()} RiseWithData · Automated notification
                </p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:12px;font-weight:600;width:100px;vertical-align:top;text-transform:uppercase;letter-spacing:.04em;">
        ${label}
      </td>
      <td style="padding:9px 0;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:14px;">
        ${value}
      </td>
    </tr>
  `;
}
