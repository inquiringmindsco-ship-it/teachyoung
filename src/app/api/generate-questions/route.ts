import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are generating 3 quick curiosity questions to engage someone BEFORE they see an explanation.

These questions serve dual purpose:
1. Engage thinking before explanation
2. Light self-assessment — they think about their answer, then learn

Question types:
- predict: "What do you think happens when...?" / "What would you expect if...?"
- experience: "Have you ever noticed...?" / "Where have you seen this before?" (no wrong answer, just reflection)
- intuition: "Why do you think it works that way?" / "What's really happening inside?" (these have a correct answer to reveal)

Format as JSON with this exact structure:

{
  "questions": [
    {
      "type": "predict",
      "text": "Question text that asks them to predict an outcome",
      "hint": "Optional hint if they get stuck"
    },
    {
      "type": "experience", 
      "text": "Question about their personal experience or observations",
      "hint": null
    },
    {
      "type": "intuition",
      "text": "Question that probes their understanding of the mechanism",
      "answer": "The actual correct explanation (1 sentence, shown after they think)",
      "hint": "Optional hint"
    }
  ]
}

Rules:
- Questions should be conversational, not academic
- predict and experience questions have no wrong answer — they're for reflection
- intuition questions reveal the "aha" answer after they think
- Keep questions short (under 25 words each)
- The topic will be provided as the item name
- Make intuition questions genuinely interesting — the "aha" moment is what makes this satisfying`;

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
        max_tokens: 800,
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
