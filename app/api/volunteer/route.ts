import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '../../../prisma/prisma.config';

const resend  = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL_TO ?? 'risewithdatausa@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const firstName    = String(formData.get('firstName')    ?? '').trim();
    const lastName     = String(formData.get('lastName')     ?? '').trim();
    const address      = String(formData.get('address')      ?? '').trim();
    const zipcode      = String(formData.get('zipcode')      ?? '').trim();
    const linkedinName = String(formData.get('linkedinName') ?? '').trim();
    const file         = formData.get('resume') as File | null;

    if (!firstName || !lastName || !address || !zipcode || !linkedinName || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Save to database
    await prisma.volunteerApplication.create({
      data: {
        firstName,
        lastName,
        address,
        zipcode,
        linkedinName,
        resumeFileName:      file.name,
        resumeFileType:      file.type,
        resumeFileSizeBytes: file.size,
      },
    });

    // 2. Send notification email with resume attached
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await resend.emails.send({
      from:    'RiseWithData <onboarding@resend.dev>',
      to:      [TO_EMAIL],
      replyTo: undefined,
      subject: `New Instructor/Volunteer Application — ${firstName} ${lastName}`,
      html:    buildEmailHtml({ firstName, lastName, address, zipcode, linkedinName, fileName: file.name, fileSize: file.size }),
      attachments: [{ filename: file.name, content: fileBuffer }],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[volunteer/route] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function buildEmailHtml(d: {
  firstName: string; lastName: string; address: string;
  zipcode: string; linkedinName: string; fileName: string; fileSize: number;
}) {
  const sizeMb = (d.fileSize / 1024 / 1024).toFixed(2);
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"/></head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
        <tr><td align="center">
          <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

            <tr>
              <td style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:28px 36px;">
                <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">RiseWithData</h1>
                <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;">New Instructor / Volunteer Application</p>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 36px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${row('Name',      `${d.firstName} ${d.lastName}`)}
                  ${row('Address',   d.address)}
                  ${row('Zipcode',   d.zipcode)}
                  ${row('LinkedIn',  `<a href="https://linkedin.com/in/${d.linkedinName}" style="color:#2563eb;">linkedin.com/in/${d.linkedinName}</a>`)}
                  ${row('Resume',    `${d.fileName} <span style="color:#64748b;font-size:12px;">(${sizeMb} MB — attached)</span>`)}
                  ${row('Submitted', new Date().toUTCString())}
                </table>

                <p style="margin:24px 0 0;color:#64748b;font-size:13px;">
                  The resume is attached. Review and reply to this email to follow up with the applicant.
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
      <td style="padding:9px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:12px;font-weight:600;width:110px;vertical-align:top;text-transform:uppercase;letter-spacing:.04em;">
        ${label}
      </td>
      <td style="padding:9px 0;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:14px;">
        ${value}
      </td>
    </tr>
  `;
}
