import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = 'RiseWithData <noreply@risewithdata.com>';
const TO     = 'risewithdatausa@gmail.com';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email   = String(body.email   ?? '').trim();
    const message = String(body.message ?? '').trim();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const safeMessage = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const { error: sendError } = await resend.emails.send({
      from:    FROM,
      to:      [TO],
      subject: `RiseWithData Website Contact - ${new Date().toLocaleDateString('en-US')}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
  <tr>
    <td style="background:linear-gradient(135deg,#1C0F08 0%,#8B5010 100%);padding:28px 36px;">
      <h1 style="margin:0;color:#fff;font-size:18px;font-weight:700;">RiseWithData</h1>
      <p style="margin:6px 0 0;color:#F5C040;font-size:13px;">New Website Contact</p>
    </td>
  </tr>
  <tr>
    <td style="padding:32px 36px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:12px;font-weight:600;width:100px;vertical-align:top;text-transform:uppercase;letter-spacing:.04em;">From</td>
          <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:14px;">${email}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#64748b;font-size:12px;font-weight:600;vertical-align:top;text-transform:uppercase;letter-spacing:.04em;">Message</td>
          <td style="padding:10px 0;color:#0f172a;font-size:14px;line-height:1.7;white-space:pre-wrap;">${safeMessage}</td>
        </tr>
      </table>
      <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;">
        To reply, send an email directly to: <strong>${email}</strong>
      </p>
    </td>
  </tr>
  <tr>
    <td style="background:#f1f5f9;padding:14px 36px;text-align:center;">
      <p style="margin:0;color:#94a3b8;font-size:12px;">RiseWithData · Website Contact Form</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`,
    });

    if (sendError) {
      console.error('[support/route] Resend error:', sendError);
      return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[support/route] error:', err);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}
