import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET(req: NextRequest) {
  try {
    const number = new URL(req.url).searchParams.get('number')?.trim().toUpperCase();
    if (!number) return NextResponse.json({ error: 'Certificate number is required' }, { status: 400 });

    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT "certificateNumber", "studentName", "studentEmail", "courseName",
              "trainerName", "issuedDate", status
       FROM "Certificate"
       WHERE UPPER("certificateNumber") = $1
       LIMIT 1`,
      number
    );

    if (!rows.length) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    const cert = rows[0];

    if (cert.status === 'REVOKED') {
      return NextResponse.json({ error: 'This certificate has been revoked' }, { status: 410 });
    }

    // Mask email: s***@gmail.com
    const email = String(cert.studentEmail);
    const [local, domain] = email.split('@');
    const maskedEmail = `${local[0]}***@${domain}`;

    return NextResponse.json({
      data: {
        certificateNumber: cert.certificateNumber,
        studentName:       cert.studentName,
        studentEmail:      maskedEmail,
        courseName:        cert.courseName,
        trainerName:       cert.trainerName,
        issuedDate:        cert.issuedDate instanceof Date
                             ? (cert.issuedDate as Date).toISOString()
                             : cert.issuedDate,
        status:            cert.status,
      },
    });
  } catch (err) {
    console.error('[certificates/verify] GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
