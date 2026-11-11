import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '../../../prisma/prisma.config';

const resend   = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = process.env.CONTACT_EMAIL_TO ?? 'risewithdatausa@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const firstName               = String(formData.get('firstName')               ?? '').trim();
    const lastName                = String(formData.get('lastName')                ?? '').trim();
    const email                   = String(formData.get('email')                   ?? '').trim();
    const zipcode                 = String(formData.get('zipcode')                 ?? '').trim();
    const linkedinName            = String(formData.get('linkedinName')            ?? '').trim();
    const courseApplied           = String(formData.get('courseApplied')           ?? '').trim() || null;
    const planningToJoinWorkforce = String(formData.get('planningToJoinWorkforce') ?? '').trim() || null;
    const file                    = formData.get('resume') as File | null;

    if (!firstName || !lastName || !email || !zipcode || !linkedinName || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Save to database (including file bytes for admin download)
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await prisma.studentApplication.create({
      data: {
        firstName,
        lastName,
        email,
        zipcode,
        linkedinName,
        courseApplied,
        planningToJoinWorkforce,
        resumeFileName:      file.name,
        resumeFileType:      file.type,
        resumeFileSizeBytes: file.size,
        resumeFileData:      fileBuffer,
      },
    });

    // 2. Send admin notification with resume attached
    await resend.emails.send({
      from:    'RiseWithData <noreply@risewithdata.com>',
      to:      [TO_EMAIL],
      subject: `New Student Application — ${firstName} ${lastName}`,
      html:    buildEmailHtml({ firstName, lastName, zipcode, linkedinName, fileName: file.name, fileSize: file.size }),
      attachments: [{ filename: file.name, content: fileBuffer }],
    }).catch((e) => console.error('[apply/route] admin email failed:', e));

    // 3. Send acknowledgement email to student
    await resend.emails.send({
      from:    'RiseWithData <noreply@risewithdata.com>',
      to:      [email],
      subject: `We received your application, ${firstName} — talk soon!`,
      html:    buildStudentAckHtml({ firstName, lastName, courseApplied }),
    }).catch((e) => console.error('[apply/route] student ack email failed:', e));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[apply/route] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function buildEmailHtml(d: {
  firstName: string; lastName: string;
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
              <td style="background:linear-gradient(135deg,#1C0F08 0%,#8B5010 100%);padding:28px 36px;">
                <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">RiseWithData</h1>
                <p style="margin:6px 0 0;color:#F5C040;font-size:13px;">New Student Application</p>
              </td>
            </tr>

            <tr>
              <td style="padding:32px 36px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${row('Name',      `${d.firstName} ${d.lastName}`)}
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

function buildStudentAckHtml(d: {
  firstName: string; lastName: string; courseApplied: string | null;
}) {
  const program  = d.courseApplied || 'Data Analyst Fellowship';
  const dateFmt  = new Date().toLocaleString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short',
  });
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

  <!-- Header -->
  <tr><td style="background:linear-gradient(135deg,#1C0F08 0%,#C88010 100%);padding:36px 40px;text-align:center;">
    <div style="width:64px;height:64px;background:rgba(255,255,255,.15);border-radius:50%;border:2px solid rgba(255,255,255,.25);margin:0 auto 16px;text-align:center;line-height:64px;font-size:28px;">✅</div>
    <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-.3px;">Application Received!</h1>
    <p style="margin:6px 0 0;color:#F5C040;font-size:14px;">Thanks for applying, ${d.firstName} — we've got everything we need.</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:36px 40px;background:#ffffff;">
    <p style="margin:0 0 24px;color:#0f172a;font-size:15px;line-height:1.65;">
      Hi ${d.firstName},<br><br>
      We received your application for the <strong>${program}</strong> and we're excited you're here.
      Our team personally reviews every application — you'll hear from us within 2 weeks.
    </p>

    <!-- Receipt table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:32px;">
      <tr style="background:#f8fafc;">
        <td style="padding:11px 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#64748b;width:120px;">Name</td>
        <td style="padding:11px 16px;font-size:14px;color:#0f172a;">${d.firstName} ${d.lastName}</td>
      </tr>
      <tr>
        <td style="padding:11px 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#64748b;border-top:1px solid #f1f5f9;">Program</td>
        <td style="padding:11px 16px;font-size:14px;color:#0f172a;border-top:1px solid #f1f5f9;">
          <span style="background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:20px;padding:2px 10px;font-size:12px;font-weight:600;">${program}</span>
        </td>
      </tr>
      <tr style="background:#f8fafc;">
        <td style="padding:11px 16px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#64748b;border-top:1px solid #f1f5f9;">Submitted</td>
        <td style="padding:11px 16px;font-size:14px;color:#0f172a;border-top:1px solid #f1f5f9;">${dateFmt}</td>
      </tr>
    </table>

  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
    <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.7;">
      Questions? Reply to this email or write to
      <a href="mailto:risewithdatausa@gmail.com" style="color:#64748b;">risewithdatausa@gmail.com</a><br>
      © ${new Date().getFullYear()} RiseWithData &nbsp;·&nbsp;
      You're receiving this because you submitted an application at risewithdata.com
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
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
