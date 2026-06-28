import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const instructorName = `${session.firstName} ${session.lastName}`;

    // Get instructor's course IDs for schedule slot lookup
    const myCourses = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM "AdminCourse" WHERE "trainerName" = $1`,
      instructorName
    );
    const courseIds = myCourses.map((c) => c.id);

    const [totalCourses, totalStudents, totalAnnouncements, totalMaterials] = await Promise.all([
      prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) AS count FROM "AdminCourse" WHERE "trainerName" = $1`,
        instructorName
      ),
      prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(DISTINCT id) AS count FROM "StudentApplication" WHERE trainer = $1 AND status = 'APPROVED'::"ApplicationStatus"`,
        instructorName
      ),
      prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) AS count FROM "CourseAnnouncement" WHERE "postedBy" = $1`,
        session.email
      ),
      prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) AS count FROM "CourseMaterial" WHERE "uploadedBy" = $1`,
        session.email
      ),
    ]);

    const recentStudents = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, "firstName", "lastName", email, "courseApplied", "createdAt"
       FROM "StudentApplication"
       WHERE trainer = $1 AND status = 'APPROVED'::"ApplicationStatus"
       ORDER BY "createdAt" DESC
       LIMIT 5`,
      instructorName
    );

    let upcomingSlots: Record<string, unknown>[] = [];
    if (courseIds.length > 0) {
      const placeholders = courseIds.map((_, i) => `$${i + 1}`).join(', ');
      upcomingSlots = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT id, "courseId", "courseName", title, "slotDate", "startTime", "endTime", location, notes
         FROM "CourseScheduleSlot"
         WHERE "courseId" IN (${placeholders}) AND "slotDate" >= NOW()
         ORDER BY "slotDate" ASC
         LIMIT 3`,
        ...courseIds
      );
    }

    const recentAnnouncements = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, "courseId", "courseName", title, body, "postedBy", "createdAt"
       FROM "CourseAnnouncement"
       WHERE "postedBy" = $1
       ORDER BY "createdAt" DESC
       LIMIT 3`,
      session.email
    );

    return NextResponse.json({
      stats: {
        totalCourses: Number(totalCourses[0].count),
        totalStudents: Number(totalStudents[0].count),
        totalAnnouncements: Number(totalAnnouncements[0].count),
        totalMaterials: Number(totalMaterials[0].count),
      },
      recentStudents: recentStudents.map((s) => ({
        ...s,
        createdAt: s.createdAt instanceof Date ? (s.createdAt as Date).toISOString() : s.createdAt,
      })),
      upcomingSlots: upcomingSlots.map((sl) => ({
        ...sl,
        slotDate: sl.slotDate instanceof Date ? (sl.slotDate as Date).toISOString() : sl.slotDate,
        createdAt: sl.createdAt instanceof Date ? (sl.createdAt as Date).toISOString() : sl.createdAt,
      })),
      recentAnnouncements: recentAnnouncements.map((a) => ({
        ...a,
        createdAt: a.createdAt instanceof Date ? (a.createdAt as Date).toISOString() : a.createdAt,
      })),
    });
  } catch (err) {
    console.error('[instructor/dashboard] GET:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
