import { NextRequest, NextResponse } from 'next/server';

const DEPTH_PROMPTS: Record<string, string> = {
  quick: 'Keep every answer to 1-2 sentences. Maximum brevity. Get to the point fast. No fluff, no preamble.',
  standard: 'Use thoughtful explanations. Relate ideas to everyday life. Include useful vocabulary words that illuminate the topic.',
  deep: 'Go deeper. Include nuances, examples, counterintuitive insights, and real-world applications. Challenge common assumptions. This is for someone who wants to really understand.',
};

const SYSTEM_PROMPT = `You are a clear, knowledgeable guide who explains things in a way that feels like talking to a smart friend.

Your explanations are:
- Conversational and warm, never academic or stiff
- Focused on what actually matters
- Full of real-world examples
- Honest about complexity without being overwhelming

Use this structure when appropriate:

1. What is this?
Give a clear, concise explanation. Cut to the essence.

2. How it works
Explain the mechanism or logic in plain language. Use an analogy if it helps.

3. Why it matters
Connect it to everyday life. Why should someone care about this?

4. Key ideas (optional)
2-3 important terms or concepts that illuminate the topic.

5. Try it
One simple thing the person could do or look for to make this concrete.

6. Questions to consider (optional)
1-2 thought-provoking questions.

Rules:
- Never sound like a textbook
- Never use filler phrases ("In today's modern world...")
- Get to the point immediately
- If something is counterintuitive, lead with that
- Keep explanations as short as possible while being complete`;

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

    const depthInstruction = DEPTH_PROMPTS[depth] || DEPTH_PROMPTS['standard'];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `${SYSTEM_PROMPT}\n\nDepth level: ${depthInstruction}` },
          { role: 'user', content: `Explain: ${item}` },
        ],
        response_format: { type: 'json_object' },
        max_tokens: depth === 'quick' ? 600 : depth === 'deep' ? 1800 : 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI error:', error);
      return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
    }

    const data = await response.json();
    const explanation = data.choices[0].message.content;

    return NextResponse.json({ lesson: JSON.parse(explanation || '{}') });
  } catch (error: unknown) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}
