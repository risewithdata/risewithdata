import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { prisma } from '../../../../prisma/prisma.config';
import { signToken, setSessionCookie } from '@lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

  if (!user || !user.active) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  const { name, value, options } = setSessionCookie(token);
  const res = NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
  });
  res.cookies.set(name, value, options as Parameters<typeof res.cookies.set>[2]);
  return res;
}
