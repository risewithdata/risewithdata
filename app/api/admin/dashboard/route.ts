import { NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET() {
  try {
    // Application counts by status
    const [totalApps, pendingApps, approvedApps, rejectedApps] = await Promise.all([
      prisma.$queryRawUnsafe<[{ count: bigint }]>(`SELECT COUNT(*) AS count FROM "StudentApplication"`),
      prisma.$queryRawUnsafe<[{ count: bigint }]>(`SELECT COUNT(*) AS count FROM "StudentApplication" WHERE status = 'PENDING'::"ApplicationStatus"`),
      prisma.$queryRawUnsafe<[{ count: bigint }]>(`SELECT COUNT(*) AS count FROM "StudentApplication" WHERE status = 'APPROVED'::"ApplicationStatus"`),
      prisma.$queryRawUnsafe<[{ count: bigint }]>(`SELECT COUNT(*) AS count FROM "StudentApplication" WHERE status = 'REJECTED'::"ApplicationStatus"`),
    ]);

    // Applications in last 30 days vs previous 30 days (for trend)
    const [recentApps, prevApps] = await Promise.all([
      prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) AS count FROM "StudentApplication" WHERE "createdAt" >= NOW() - INTERVAL '30 days'`
      ),
      prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) AS count FROM "StudentApplication" WHERE "createdAt" >= NOW() - INTERVAL '60 days' AND "createdAt" < NOW() - INTERVAL '30 days'`
      ),
    ]);

    // Course stats
    const [totalCourses, activeCourses, totalSeats] = await Promise.all([
      prisma.$queryRawUnsafe<[{ count: bigint }]>(`SELECT COUNT(*) AS count FROM "AdminCourse"`),
      prisma.$queryRawUnsafe<[{ count: bigint }]>(`SELECT COUNT(*) AS count FROM "AdminCourse" WHERE status = 'ACTIVE'::"CourseStatus"`),
      prisma.$queryRawUnsafe<[{ total: bigint }]>(`SELECT COALESCE(SUM("seatsAvailable"), 0) AS total FROM "AdminCourse" WHERE status = 'ACTIVE'::"CourseStatus"`),
    ]);

    // Recent 8 applications
    const recentApplications = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, "firstName", "lastName", email, "courseApplied", status, "createdAt"
       FROM "StudentApplication"
       ORDER BY "createdAt" DESC
       LIMIT 8`
    );

    // All courses with seat info
    const courses = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT id, name, "trainerName", "seatsAvailable", "applicationsReceived", status, "startDate", "endDate"
       FROM "AdminCourse"
       ORDER BY "createdAt" DESC`
    );

    // Applications per course (for bar chart data)
    const appsByCourse = await prisma.$queryRawUnsafe<{ course: string; count: bigint }[]>(
      `SELECT "courseApplied" AS course, COUNT(*) AS count
       FROM "StudentApplication"
       WHERE "courseApplied" IS NOT NULL
       GROUP BY "courseApplied"
       ORDER BY count DESC`
    );

    // Applications per day (last 7 days)
    const appsTrend = await prisma.$queryRawUnsafe<{ day: string; count: bigint }[]>(
      `SELECT TO_CHAR("createdAt"::date, 'Mon DD') AS day, COUNT(*) AS count
       FROM "StudentApplication"
       WHERE "createdAt" >= NOW() - INTERVAL '7 days'
       GROUP BY "createdAt"::date
       ORDER BY "createdAt"::date`
    );

    return NextResponse.json({
      stats: {
        totalApplications:  Number(totalApps[0].count),
        pendingApplications: Number(pendingApps[0].count),
        approvedApplications: Number(approvedApps[0].count),
        rejectedApplications: Number(rejectedApps[0].count),
        totalCourses:  Number(totalCourses[0].count),
        activeCourses: Number(activeCourses[0].count),
        totalSeatsAvailable: Number(totalSeats[0].total),
        recentAppsCount: Number(recentApps[0].count),
        prevAppsCount:   Number(prevApps[0].count),
      },
      recentApplications: recentApplications.map((a) => ({
        ...a,
        createdAt: a.createdAt instanceof Date ? (a.createdAt as Date).toISOString() : a.createdAt,
      })),
      courses: courses.map((c) => ({
        ...c,
        seatsAvailable:       Number(c.seatsAvailable),
        applicationsReceived: Number(c.applicationsReceived),
        startDate: c.startDate instanceof Date ? (c.startDate as Date).toISOString() : c.startDate,
        endDate:   c.endDate   instanceof Date ? (c.endDate   as Date).toISOString() : c.endDate,
      })),
      appsByCourse: appsByCourse.map((r) => ({
        course: r.course,
        count:  Number(r.count),
      })),
      appsTrend: appsTrend.map((r) => ({
        day:   r.day,
        count: Number(r.count),
      })),
    });
  } catch (err) {
    console.error('[dashboard] GET:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}
