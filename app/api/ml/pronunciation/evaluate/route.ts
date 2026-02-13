import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const expectedText = formData.get('expectedText') as string;
    const language = formData.get('language') as string;

    if (!audioFile) {
      return NextResponse.json(
        { success: false, message: 'No audio file provided' },
        { status: 400 }
      );
    }

    // In a real implementation, we would send the audio to an STT service (e.g. Google Speech, Azure, or local Whisper)
    // For now, we'll mock a successful evaluation with a random score between 70 and 100
    // to simulate "good" pronunciation so the user can proceed.
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockScore = Math.floor(Math.random() * (100 - 70 + 1)) + 70;
    const mockSpokenText = expectedText; // Assume they said it correctly for the mock

    return NextResponse.json({
      success: true,
      data: {
        overall_score: mockScore,
        spoken_text: mockSpokenText,
        expected_text: expectedText,
        feedback: "Good pronunciation! Keep it up.",
        phoneme_breakdown: [] // Optional detailed feedback
      }
    });

  } catch (error) {
    console.error('Speech evaluation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
