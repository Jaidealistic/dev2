import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { answers } = body;

    // Simple logic to determine placement level based on answers
    // q1 is confidence level: o1 (Beginner), o2 (Basic), o3 (Intermediate), o4 (Advanced)
    let placementLevel = 'Beginner';
    
    if (answers?.q1 === 'o2') placementLevel = 'Basic';
    else if (answers?.q1 === 'o3') placementLevel = 'Intermediate';
    else if (answers?.q1 === 'o4') placementLevel = 'Advanced';

    // Mock response
    return NextResponse.json({
      assessment: {
        id: 'mock-assessment-id',
        score: 0, // Placeholder
        placementLevel,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Assessment submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
