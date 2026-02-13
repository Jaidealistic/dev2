import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const MOCK_COOPS = [
  {
    id: '1',
    name: 'Chennai Homeschoolers Network',
    location: 'Adyar, Chennai',
    description: 'A community of families focusing on nature-based learning and group outings.',
    schedule: 'Fridays, 10 AM - 2 PM',
    membersCount: 15,
    isOpen: true,
    tags: ['Nature Study', 'Field Trips', 'All Ages'],
  },
  {
    id: '2',
    name: 'Young Scientists Club',
    location: 'Anna Nagar, Chennai',
    description: 'Weekly science experiments and STEM challenges for ages 8-14.',
    schedule: 'Wednesdays, 4 PM - 6 PM',
    membersCount: 8,
    isOpen: true,
    tags: ['Science', 'STEM', 'Ages 8-14'],
  },
  {
    id: '3',
    name: 'Tiny Tots Playgroup',
    location: 'Velachery, Chennai',
    description: 'Play-based learning and social interaction for preschoolers.',
    schedule: 'Tuesdays & Thursdays, 9 AM - 11 AM',
    membersCount: 12,
    isOpen: false,
    tags: ['Preschool', 'Play', 'Social Skills'],
  },
];

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // In a real app, logic to fetch co-ops based on location/search
  // const { searchParams } = new URL(request.url);

  return NextResponse.json({ coops: MOCK_COOPS });
}
