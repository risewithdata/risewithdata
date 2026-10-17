import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  try {
    const sessionId = new URL(req.url).searchParams.get('session_id');
    if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status:     session.payment_status,
      customerEmail: session.customer_email,
      courseName: session.metadata?.courseName,
      fullName:   session.metadata?.fullName,
      amount:     session.amount_total,
    });
  } catch (err) {
    console.error('[verify-session] error:', err);
    return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
  }
}
