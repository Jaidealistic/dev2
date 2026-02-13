import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Mock success for progress saving
  return NextResponse.json({ success: true });
}
