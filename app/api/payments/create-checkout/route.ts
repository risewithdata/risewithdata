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
    const { fullName, email, phone, zipcode, courseName, couponCode } = await req.json();

    if (!fullName || !email || !phone || !zipcode || !courseName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const baseAmount = PLAN_PRICES[courseName];
    if (!baseAmount) {
      return NextResponse.json({ error: 'Invalid course selected' }, { status: 400 });
    }

    // Validate coupon server-side (never trust frontend discount)
    let finalAmount = baseAmount;
    let validatedCouponCode: string | null = null;

    if (couponCode && typeof couponCode === 'string') {
      const normalized = couponCode.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({ where: { code: normalized } });

      if (
        coupon &&
        coupon.isActive &&
        (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
        (coupon.maxUses === null || coupon.usedCount < coupon.maxUses)
      ) {
        const discounted = Math.round(baseAmount * (1 - coupon.discountPercent / 100));
        finalAmount = Math.max(50, discounted); // minimum 50 cents (Stripe requirement)
        validatedCouponCode = normalized;
      }
    }

    const appUrl = process.env.APP_URL ?? 'https://www.risewithdata.com';

    // Save enrollment as PENDING before redirecting to Stripe
    const id = cuid();
    await prisma.$queryRawUnsafe(
      `INSERT INTO "Enrollment" (id, "fullName", email, phone, zipcode, "courseName", amount, "couponCode", status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING'::"EnrollmentStatus", NOW(), NOW())`,
      id, fullName, email, phone, zipcode, courseName, finalAmount, validatedCouponCode
    );

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: finalAmount,
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

    // Increment coupon usedCount (non-blocking — failure should not break checkout)
    if (validatedCouponCode) {
      prisma.coupon.update({
        where: { code: validatedCouponCode },
        data:  { usedCount: { increment: 1 } },
      }).catch((e) => console.error('[create-checkout] coupon increment failed:', e));
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[create-checkout] error:', err);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
