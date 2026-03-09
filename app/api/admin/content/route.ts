import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lesson from '@/lib/models/Lesson';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-it';

export async function GET() {
  try {
    await dbConnect();
    const lessons = await Lesson.find({}).sort({ createdAt: -1 });
    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Fetch lessons error:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Auth Check (Admin only)
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

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // 2. Parse and Validate
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    await dbConnect();

    // 3. Save to MongoDB
    // If it's an array, handle bulk insert (optional, let's stick to single for now based on UI)
    const lessonData = Array.isArray(body) ? body[0] : body;

    // Simple validation for required fields before deep mongoose validation
    if (!lessonData.lessonId || !lessonData.title) {
      return NextResponse.json({ error: 'Missing required fields: lessonId and title' }, { status: 400 });
    }

    // Use findOneAndUpdate with upsert to allow overwriting/updating existing lessons by lessonId
    const updatedLesson = await Lesson.findOneAndUpdate(
      { lessonId: lessonData.lessonId },
      { ...lessonData, createdBy: decoded.userId },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Lesson uploaded successfully',
      lesson: updatedLesson
    });

  } catch (error: any) {
    console.error('Lesson upload error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        error: 'Validation failed',
        details: Object.values(error.errors).map((e: any) => e.message)
      }, { status: 400 });
    }

    return NextResponse.json({
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
