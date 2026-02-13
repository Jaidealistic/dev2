import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const checkMethodSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = checkMethodSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        role: true,
        firstName: true,
        password: true, // we check if this looks like a pattern hash or password hash, ideally we'd have a separate field
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Determine auth method based on role
    // LEARNER uses pattern, others use password
    const authMethod = user.role === 'LEARNER' ? 'pattern' : 'password';

    return NextResponse.json({
      role: user.role,
      authMethod,
      firstName: user.firstName,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    console.error('Check auth method error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
