import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma.config';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Please enter a coupon code' }, { status: 400 });
    }

    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      return NextResponse.json({ valid: false, message: 'Please enter a coupon code' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({ where: { code: normalized } });

    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid coupon code' });
    }
    if (!coupon.isActive) {
      return NextResponse.json({ valid: false, message: 'This coupon is no longer active' });
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, message: 'This coupon has expired' });
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, message: 'This coupon has reached its usage limit' });
    }

    return NextResponse.json({ valid: true, discountPercent: coupon.discountPercent, code: normalized });
  } catch (err) {
    console.error('[validate-coupon] error:', err);
    return NextResponse.json({ valid: false, message: 'Could not validate coupon' }, { status: 500 });
  }
}
