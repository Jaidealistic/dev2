import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { generateStudentId } from '@/lib/utils';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).optional(),
  pattern: z.array(z.number()).optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['LEARNER', 'PARENT', 'EDUCATOR', 'PARENT_EDUCATOR']),
}).refine(data => {
  if (data.role === 'LEARNER') {
    return !!data.pattern && data.pattern.length >= 4;
  }
  return !!data.password;
}, {
  message: "Password is required for parents/educators, Pattern is required for learners",
  path: ["password"]
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, pattern, firstName, lastName, role } = signupSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password or pattern
    let passwordHash = '';
    
    if (role === 'LEARNER' && pattern) {
      // For learners, we treat the pattern as the password
      // Convert pattern array to string for hashing
      const patternString = pattern.join('-');
      passwordHash = await bcrypt.hash(patternString, 10);
    } else if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash,
        firstName,
        lastName,
        role,
        learnerProfile: role === 'LEARNER' ? {
          create: {
            studentId: generateStudentId(),
            learningLanguage: 'ENGLISH', // Default
            disabilities: [],
          }
        } : undefined,
        parentProfile: ['PARENT', 'PARENT_EDUCATOR'].includes(role) ? {
          create: {
            relationship: 'Parent',
          }
        } : undefined,
        educatorProfile: role === 'EDUCATOR' ? {
          create: {
            qualifications: 'Pending',
          }
        } : undefined,
      },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
