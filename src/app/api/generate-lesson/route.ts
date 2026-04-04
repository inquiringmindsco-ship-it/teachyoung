import { NextRequest, NextResponse } from 'next/server';

const DEPTH_PROMPTS: Record<string, string> = {
  quick: 'Keep every answer to 1-2 sentences. Maximum brevity. Get to the point fast. No filler.',
  standard: 'Be clear and thoughtful. Relate ideas to everyday life. Include useful vocabulary.',
  deep: 'Go deeper with nuances, examples, and real-world applications. Challenge assumptions.',
};

const SYSTEM_PROMPT = `You are a clear, direct guide who explains things the way a smart friend would over coffee.

Your explanations should feel like:
- a natural conversation, not a lecture
- full of real examples, not abstract theory
- just slightly surprising — lead with what most people don't realize
- honest about complexity, but never academic about it

Every response should have a "hook" — one line that makes someone pause and want to read more. This comes from what is counterintuitive, unexpected, or quietly fascinating about the topic.

Format your response as JSON with these fields:

{
  "hook": "One short sentence that creates intrigue or challenges assumptions. Make it feel like the beginning of a conversation, not a textbook definition.",
  "whatIsThis": "Clear, direct explanation. Cut to the essence in 1-3 sentences. No preamble.",
  "howItWorks": "Plain-language explanation of the mechanism. Use a concrete analogy if it helps. 2-4 sentences.",
  "whyItMatters": "Why this matters in everyday life. One sentence that connects it to something familiar.",
  "vocabulary": ["key term 1", "key term 2", "key term 3"],
  "tryThis": "One specific thing the person could do or look for right now to make this real. Keep it simple and actionable.",
  "question": "One thought-provoking question that extends curiosity beyond this explanation."
}

Rules:
- Never start with "In today's world..." or "Did you know..." or "Great question..."
- Never use the word "phenomenon" or "utilize" or "leverages"
- If the topic has a surprising angle, lead with it
- Keep the hook as short as possible — aim for 15 words or fewer
- The "what is this" should feel like the second sentence of a conversation, not the first
- Sound like a human, not a reference card`;

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
        max_tokens: depth === 'quick' ? 600 : depth === 'deep' ? 1800 : 900,
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
