import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '../../../prisma/prisma.config';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL_TO ?? 'risewithdatausa@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const firstName = String(formData.get('firstName') ?? '').trim();
    const lastName  = String(formData.get('lastName')  ?? '').trim();
    const email     = String(formData.get('email')      ?? '').trim();
    const terms     = formData.get('terms') === 'true';
    const file      = formData.get('resume') as File | null;

    // Basic server-side guard (Zod validates on the client; this is a safety net)
    if (!firstName || !lastName || !email || !terms || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // --- 1. Save to database ---
    await prisma.contactSubmission.create({
      data: {
        firstName,
        lastName,
        email,
        resumeFileName:      file.name,
        resumeFileType:      file.type,
        resumeFileSizeBytes: file.size,
        termsAccepted:       terms,
      },
    });

    // --- 2. Send email via Resend ---
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await resend.emails.send({
      from: 'RiseWithData Contact <onboarding@resend.dev>',
      to:   [TO_EMAIL],
      replyTo: email,
      subject: `Contact Form Submission — ${firstName} ${lastName}`,
      html: buildEmailHtml({ firstName, lastName, email, fileName: file.name, fileSize: file.size }),
      attachments: [
        {
          filename: file.name,
          content:  fileBuffer,
        },
      ],
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
  fileName: string;
  fileSize: number;
}) {
  const sizeMb = (data.fileSize / 1024 / 1024).toFixed(2);
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
        <tr><td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:32px 40px;text-align:center;">
                <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-.5px;">RiseWithData</h1>
                <p style="margin:8px 0 0;color:#94a3b8;font-size:13px;">New Contact Form Submission</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 40px;">
                <p style="margin:0 0 24px;color:#334155;font-size:15px;">
                  You have a new submission from the Contact Us page. Details below:
                </p>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${row('First Name',  data.firstName)}
                  ${row('Last Name',   data.lastName)}
                  ${row('Email',       `<a href="mailto:${data.email}" style="color:#3b82f6;">${data.email}</a>`)}
                  ${row('Resume',      `${data.fileName} <span style="color:#64748b;font-size:12px;">(${sizeMb} MB)</span>`)}
                  ${row('Terms',       '<span style="color:#16a34a;font-weight:600;">Accepted ✓</span>')}
                  ${row('Submitted',   new Date().toUTCString())}
                </table>

                <p style="margin:28px 0 0;color:#64748b;font-size:13px;">
                  The resume is attached to this email. Reply directly to this email to reach the applicant.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f1f5f9;padding:20px 40px;text-align:center;">
                <p style="margin:0;color:#94a3b8;font-size:12px;">
                  © ${new Date().getFullYear()} RiseWithData · This is an automated message.
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
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:13px;font-weight:600;width:140px;vertical-align:top;">
        ${label}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:14px;">
        ${value}
      </td>
    </tr>
  `;
}
