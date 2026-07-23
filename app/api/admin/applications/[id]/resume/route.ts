import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../../../../../../lib/auth';
import { prisma } from '../../../../../../prisma/prisma.config';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT "resumeFileName", "resumeFileType", "resumeFileData"
       FROM "StudentApplication" WHERE id = $1`,
      id
    );

    if (!rows.length) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const { resumeFileName, resumeFileType, resumeFileData } = rows[0] as {
      resumeFileName: string;
      resumeFileType: string;
      resumeFileData: Buffer | null;
    };

    if (!resumeFileData) {
      return NextResponse.json(
        { error: 'Resume file not available. This application was submitted before file storage was enabled. Please check the original notification email.' },
        { status: 404 }
      );
    }

    const safeFileName = resumeFileName.replace(/[^a-zA-Z0-9._-]/g, '_');

    return new NextResponse(new Uint8Array(resumeFileData), {
      status: 200,
      headers: {
        'Content-Type':        resumeFileType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${safeFileName}"`,
        'Content-Length':      String(resumeFileData.length),
        'Cache-Control':       'no-store',
      },
    });
  } catch (err) {
    console.error('[applications/[id]/resume] GET:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
