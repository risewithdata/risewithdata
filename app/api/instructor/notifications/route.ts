import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../prisma/prisma.config';

type Notification = {
  id: string;
  type: 'welcome' | 'students' | 'announcement' | 'schedule';
  title: string;
  message: string;
  timestamp: string;
};

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const instructorName = `${session.firstName} ${session.lastName}`;

    const [users, courses, recentAnnouncements, upcomingSlots] = await Promise.all([
      prisma.$queryRawUnsafe<{ createdAt: Date | string }[]>(
        `SELECT "createdAt" FROM "User" WHERE email = $1 LIMIT 1`,
        session.email
      ),
      prisma.$queryRawUnsafe<{ id: string; name: string }[]>(
        `SELECT id, name FROM "AdminCourse" WHERE "trainerName" = $1`,
        instructorName
      ),
      prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT id, title, "courseName", "createdAt"
         FROM "CourseAnnouncement"
         WHERE "postedBy" = $1 AND "createdAt" >= NOW() - INTERVAL '7 days'
         ORDER BY "createdAt" DESC`,
        session.email
      ),
      prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT s.id, s.title, s."courseName", s."slotDate"
         FROM "CourseScheduleSlot" s
         INNER JOIN "AdminCourse" c ON c.id = s."courseId"
         WHERE c."trainerName" = $1
           AND s."slotDate" >= NOW()
           AND s."slotDate" <= NOW() + INTERVAL '7 days'
         ORDER BY s."slotDate" ASC`,
        instructorName
      ),
    ]);

    const notifications: Notification[] = [];

    // Welcome notification
    const welcomeTs =
      users[0]?.createdAt instanceof Date
        ? (users[0].createdAt as Date).toISOString()
        : String(users[0]?.createdAt ?? new Date().toISOString());
    notifications.push({
      id: 'welcome',
      type: 'welcome',
      title: 'Welcome to RiseWithData!',
      message: `Hi ${session.firstName}! Your instructor account is set up and ready. Start by exploring your courses and students.`,
      timestamp: welcomeTs,
    });

    // Student count notifications per course
    for (const course of courses) {
      const countResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) AS count FROM "StudentApplication"
         WHERE "courseApplied" = $1 AND status = 'APPROVED'::"ApplicationStatus"`,
        course.name
      );
      const count = Number(countResult[0].count);
      notifications.push({
        id: `students-${course.id}`,
        type: 'students',
        title: 'Enrolled Students',
        message: `You have ${count} enrolled student${count !== 1 ? 's' : ''} in ${course.name}.`,
        timestamp: welcomeTs,
      });
    }

    // Recent announcements
    for (const ann of recentAnnouncements) {
      const ts = ann.createdAt instanceof Date
        ? (ann.createdAt as Date).toISOString()
        : String(ann.createdAt);
      notifications.push({
        id: `ann-${ann.id}`,
        type: 'announcement',
        title: 'Announcement Posted',
        message: `You posted "${ann.title}" to ${ann.courseName}.`,
        timestamp: ts,
      });
    }

    // Upcoming schedule slots
    for (const slot of upcomingSlots) {
      const slotDate = slot.slotDate instanceof Date
        ? (slot.slotDate as Date).toISOString()
        : String(slot.slotDate);
      const formatted = new Date(slotDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      notifications.push({
        id: `slot-${slot.id}`,
        type: 'schedule',
        title: 'Upcoming Session',
        message: `"${slot.title}" in ${slot.courseName} is scheduled for ${formatted}.`,
        timestamp: slotDate,
      });
    }

    // Sort by timestamp descending
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ data: notifications });
  } catch (err) {
    console.error('[instructor/notifications] GET:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
