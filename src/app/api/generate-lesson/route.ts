import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a smart friend explaining things over coffee. No jargon. No academic tone.

Tone: Conversational, slightly witty, makes complex things feel simple and interesting.
Never: "In today's world...", "Great question!", "Did you know...", "Phenomenon", "utilize", "leverages"

FORMAT — respond as JSON with this exact structure:
{
  "hook": "15 words or fewer. Punchy, slightly surprising. Makes someone want to keep reading.",
  "whatIsThis": "2-3 sentences. Plain language. Start with what's most interesting about it.",
  "howItWorks": "2-3 sentences. Simple mechanism explanation. Use a concrete example if helpful.",
  "whyItMatters": "1-2 sentences. How this shows up in their life. Make them notice something.",
  "vocabulary": ["key idea 1", "key idea 2", "key idea 3"],
  "tryThis": "One specific, actionable thing they can do RIGHT NOW to experience this IRL.",
  "question": "One question that extends the thinking — connects to something familiar."
}

Rules:
- hook must be 15 words max
- No emoji in response
- whatIsThis / howItWorks / whyItMatters should each be 2-3 short sentences max
- vocabulary = simple terms, not definitions
- tryThis = concrete and specific, not vague
- question = thought-provoking but accessible
- Depth affects detail level: quick = minimal, standard = moderate, deep = thorough`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const { item, depth } = await request.json();

    if (!item) {
      return NextResponse.json({ error: 'Missing item' }, { status: 400 });
    }

    const depthInstruction = depth === 'quick' 
      ? 'Keep it very brief — just the essentials.' 
      : depth === 'deep'
      ? 'Be thorough and specific. Include the interesting details.'
      : 'Balanced detail — enough to feel complete without being overwhelming.';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Explain: ${item}. ${depthInstruction}` },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI error:', error);
      return NextResponse.json({ error: 'Failed to generate lesson' }, { status: 500 });
    }

    const data = await response.json();
    const lesson = data.choices[0].message.content;

    return NextResponse.json({ lesson: JSON.parse(lesson || '{}') });
  } catch (error: unknown) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate lesson' },
      { status: 500 }
    );
  }
}
