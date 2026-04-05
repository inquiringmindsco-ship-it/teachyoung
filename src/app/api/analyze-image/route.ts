import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Look at this image carefully. Identify EXACTLY what is shown — the specific object, thing, or subject. Be precise and concrete. Return ONLY the name or subject of what is in the image, in 3-7 words maximum. No description, no explanation, just the subject.',
              },
              {
                type: 'image_url',
                image_url: {
                  url: image,
                  detail: 'low',
                },
              },
            ],
          },
        ],
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI vision error:', error);
      return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
    }

    const data = await response.json();
    const subject = data.choices[0].message.content?.trim() || 'Unknown subject';

    return NextResponse.json({ subject });
  } catch (error: unknown) {
    console.error('Image analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
