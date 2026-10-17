import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '../../../../prisma/prisma.config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function cuid() {
  return 'c' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
}

const PLAN_PRICES: Record<string, number> = {
  Core:     8900,
  Advanced: 13900,
  Elite:    25000,
};

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, city, courseName } = await req.json();

    if (!fullName || !email || !phone || !city || !courseName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const amount = PLAN_PRICES[courseName];
    if (!amount) {
      return NextResponse.json({ error: 'Invalid course selected' }, { status: 400 });
    }

    const appUrl = process.env.APP_URL ?? 'https://www.risewithdata.com';

    // Save enrollment as PENDING before redirecting to Stripe
    const id = cuid();
    await prisma.$queryRawUnsafe(
      `INSERT INTO "Enrollment" (id, "fullName", email, phone, city, "courseName", amount, status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING'::"EnrollmentStatus", NOW(), NOW())`,
      id, fullName, email, phone, city, courseName, amount
    );

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amount,
            product_data: {
              name: `RiseWithData — ${courseName} Plan`,
              description: `Enrollment for ${fullName}`,
            },
          },
        },
      ],
      customer_email: email,
      metadata: { enrollmentId: id, courseName, fullName },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/checkout/cancel?enrollment_id=${id}`,
    });

    // Save stripeSessionId
    await prisma.$queryRawUnsafe(
      `UPDATE "Enrollment" SET "stripeSessionId" = $1, "updatedAt" = NOW() WHERE id = $2`,
      session.id, id
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[create-checkout] error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
