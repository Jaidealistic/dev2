import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { generateStudentId } from '@/lib/utils';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
        decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const { userId } = decoded;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { learnerProfile: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if learner profile needs to be created or updated (self-healing)
    if (user.role === 'LEARNER') {
        let profile = user.learnerProfile;
        let needsUpdate = false;
        let updateData: any = {};

        if (!profile) {
             profile = await prisma.learnerProfile.create({
                 data: {
                     userId: user.id,
                     studentId: generateStudentId()
                 }
             });
             // No further update needed for new profile (unless we want to return it immediately)
             return NextResponse.json({ ...user, learnerProfile: profile });
        } else {
             // Profile exists, but check if studentId is missing
             if (!profile.studentId) {
                 updateData.studentId = generateStudentId();
                 needsUpdate = true;
             }

             if (needsUpdate) {
                 profile = await prisma.learnerProfile.update({
                     where: { id: profile.id },
                     data: updateData
                 });
             }
             
             return NextResponse.json({ ...user, learnerProfile: profile });
        }
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
