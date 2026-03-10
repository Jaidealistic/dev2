import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { ink, language } = body;

        const response = await fetch('https://inputtools.google.com/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                options: 'enable_pre_space',
                requests: [{
                    writing_guide: { writing_area_width: 500, writing_area_height: 200 },
                    ink: ink,
                    language: language === 'ta' ? 'ta-t-i0-handwrit' : 'en'
                }]
            })
        });

        console.log('Google API Request Language:', language);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google API Error Response:', errorText);
            throw new Error(`Google API responded with ${response.status}`);
        }

        const data = await response.json();
        console.log('Google API Success Response:', JSON.stringify(data).substring(0, 100) + '...');
        return NextResponse.json(data);
    } catch (error) {
        console.error('Handwriting proxy error:', error);
        return NextResponse.json({ error: 'Failed to recognize handwriting' }, { status: 500 });
    }
}
