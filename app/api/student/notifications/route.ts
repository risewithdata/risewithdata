import { NextResponse } from 'next/server';
import { getSession } from '../../../../lib/auth';
import { prisma } from '../../../../prisma/prisma.config';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [users, apps] = await Promise.all([
      prisma.$queryRawUnsafe<{ createdAt: Date | string }[]>(
        `SELECT "createdAt" FROM "User" WHERE id = $1 LIMIT 1`,
        session.userId
      ),
      prisma.$queryRawUnsafe<Record<string, unknown>[]>(
        `SELECT id, "courseApplied", status, "updatedAt", "rejectionReason"
         FROM "StudentApplication"
         WHERE LOWER(email) = LOWER($1)
         ORDER BY "updatedAt" DESC`,
        session.email
      ),
    ]);

    type Notification = {
      id: string;
      type: 'welcome' | 'approved' | 'rejected' | 'pending';
      title: string;
      message: string;
      timestamp: string;
    };

    const notifications: Notification[] = [];

    // Application status notifications
    for (const app of apps) {
      const ts = app.updatedAt instanceof Date ? (app.updatedAt as Date).toISOString() : String(app.updatedAt);
      const course = (app.courseApplied as string) ?? 'a course';

      if (app.status === 'APPROVED') {
        notifications.push({
          id:        `app-approved-${app.id}`,
          type:      'approved',
          title:     'Application Approved!',
          message:   `Your application for ${course} has been approved. Welcome aboard!`,
          timestamp: ts,
        });
      } else if (app.status === 'REJECTED') {
        notifications.push({
          id:        `app-rejected-${app.id}`,
          type:      'rejected',
          title:     'Application Update',
          message:   `Your application for ${course} was not selected at this time.${app.rejectionReason ? ` Reason: ${app.rejectionReason}` : ''}`,
          timestamp: ts,
        });
      } else {
        notifications.push({
          id:        `app-pending-${app.id}`,
          type:      'pending',
          title:     'Application Under Review',
          message:   `Your application for ${course} is currently being reviewed by our team.`,
          timestamp: ts,
        });
      }
    }

    // Welcome notification (always last)
    const welcomeTs = users[0]?.createdAt instanceof Date
      ? (users[0].createdAt as Date).toISOString()
      : String(users[0]?.createdAt ?? new Date().toISOString());

    notifications.push({
      id:        'welcome',
      type:      'welcome',
      title:     'Welcome to RiseWithData!',
      message:   `Hi ${session.firstName}! Your account is set up and ready. Explore your courses and start your data journey.`,
      timestamp: welcomeTs,
    });

    return NextResponse.json({ data: notifications });
  } catch (err) {
    console.error('[student/notifications] GET:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
