import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/prisma.config';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!['ACTIVE', 'REVOKED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    await prisma.$queryRawUnsafe(
      `UPDATE "Certificate" SET status = $1::"CertificateStatus", "updatedAt" = NOW() WHERE id = $2`,
      status, id
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/certificates] PATCH error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    await prisma.$queryRawUnsafe(`DELETE FROM "Certificate" WHERE id = $1`, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[admin/certificates] DELETE error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
