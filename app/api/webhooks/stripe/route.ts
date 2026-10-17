import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '../../../../prisma/prisma.config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body      = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';
  const secret    = process.env.STRIPE_WEBHOOK_SECRET ?? '';

  let event: Stripe.Event;

  try {
    event = secret
      ? stripe.webhooks.constructEvent(body, signature, secret)
      : JSON.parse(body);
  } catch (err) {
    console.error('[stripe-webhook] signature error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const enrollmentId = session.metadata?.enrollmentId;
      if (!enrollmentId) return NextResponse.json({ ok: true });

      if (session.payment_status === 'paid') {
        await prisma.$queryRawUnsafe(
          `UPDATE "Enrollment"
           SET status = 'PAID'::"EnrollmentStatus",
               "stripePaymentIntentId" = $1,
               "paidAt" = NOW(),
               "updatedAt" = NOW()
           WHERE id = $2`,
          session.payment_intent as string,
          enrollmentId
        );
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const enrollmentId = session.metadata?.enrollmentId;
      if (enrollmentId) {
        await prisma.$queryRawUnsafe(
          `UPDATE "Enrollment" SET status = 'CANCELLED'::"EnrollmentStatus", "updatedAt" = NOW() WHERE id = $1`,
          enrollmentId
        );
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object as Stripe.PaymentIntent;
      await prisma.$queryRawUnsafe(
        `UPDATE "Enrollment"
         SET status = 'FAILED'::"EnrollmentStatus", "updatedAt" = NOW()
         WHERE "stripePaymentIntentId" = $1 OR "stripeSessionId" IN (
           SELECT id FROM "Enrollment" WHERE "stripePaymentIntentId" = $1 LIMIT 1
         )`,
        pi.id
      );
    }
  } catch (err) {
    console.error('[stripe-webhook] handler error:', err);
  }

  return NextResponse.json({ ok: true });
}

