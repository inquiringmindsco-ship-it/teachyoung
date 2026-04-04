import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are generating 3 quick curiosity questions to engage someone BEFORE they see an explanation.

Rules:
- These questions come BEFORE the explanation
- They should trigger thinking, not test knowledge
- Make people slightly curious to see if they were right
- Questions should be varied in type (prediction, experience, intuition)
- No right or wrong — just "think about it"
- Fast to answer (tap/click)
- Keep them feeling curious, not academic

Generate 3 questions as JSON with this exact format:

{
  "questions": [
    {
      "type": "predict",
      "text": "A prediction or "what do you think happens?" question",
      "hint": "Optional one-word hint if they get stuck"
    },
    {
      "type": "experience", 
      "text": "A question about their personal experience or where they've seen this",
      "hint": null
    },
    {
      "type": "intuition",
      "text": "A question that makes them think about the underlying mechanism or reason",
      "hint": null
    }
  ]
}

Guidelines per type:
- predict: "What do you think happens when...?" / "What would you expect if...?"
- experience: "Have you ever noticed...?" / "Where have you seen this before?"
- intuition: "Why do you think it works that way?" / "What's really happening inside?"

The topic will be provided as the item name. Keep questions conversational and short.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const { item } = await request.json();

    if (!item) {
      return NextResponse.json({ error: 'Missing item' }, { status: 400 });
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
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Generate curiosity questions about: ${item}` },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI error:', error);
      return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
    }

    const data = await response.json();
    const questions = data.choices[0].message.content;

    return NextResponse.json({ questions: JSON.parse(questions || '{}') });
  } catch (error: unknown) {
    console.error('Question generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
