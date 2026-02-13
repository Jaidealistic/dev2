import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const MOCK_ITEMS = [
  {
    id: '1',
    title: 'Science Project: Solar System',
    description: 'A model of the solar system created using recycled materials.',
    type: 'image',
    tags: ['Science', 'Creativity'],
    createdAt: new Date().toISOString(),
    childName: 'Aarav',
  },
  {
    id: '2',
    title: 'English Poem Recitation',
    description: 'Reciting "The Road Not Taken" by Robert Frost.',
    type: 'video',
    tags: ['English', 'Oral Skills'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    childName: 'Meera',
  },
  {
    id: '3',
    title: 'Math Worksheet: Fractions',
    description: 'Completed worksheet on adding and subtracting fractions.',
    type: 'document',
    tags: ['Math', 'Critical Thinking'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    childName: 'Aarav',
  },
];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // In a real app, we would fetch from DB filtering by parent's children
  // const { searchParams } = new URL(req.url);
  // const childId = searchParams.get('childId');

  return NextResponse.json({ items: MOCK_ITEMS });
}
