import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, pattern, rememberMe } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        learnerProfile: true, // simplified for now
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    let isValid = false;

    if (user.role === 'LEARNER') {
      if (!pattern || !Array.isArray(pattern)) {
        return NextResponse.json({ error: 'Pattern is required for learners' }, { status: 400 });
      }
      const patternString = pattern.join('-');
      isValid = await bcrypt.compare(patternString, user.password);
    } else {
      if (!password) {
        return NextResponse.json({ error: 'Password is required' }, { status: 400 });
      }
      isValid = await bcrypt.compare(password, user.password);
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: rememberMe ? '30d' : '1d' }
    );

    // Update last login
    await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        onboardingComplete: !!((user.role === 'LEARNER' && user.learnerProfile) || user.role !== 'LEARNER'), // Simplified logic
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
