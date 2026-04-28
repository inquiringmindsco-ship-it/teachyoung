import { NextRequest, NextResponse } from 'next/server';

const REPURPOSE_SYSTEM_PROMPT = `You are a creative reuse expert. When someone shows you an object, you suggest practical ways to repurpose, upcycle, or recycle it. You focus on real, doable ideas — not fantasy projects that require professional tools or weeks of work.

Respond as valid JSON with this EXACT structure:
{
  "object": "STRING. What the object is, identified simply (e.g., 'glass jar', 'plastic bottle', 'old t-shirt')",
  "material": "STRING. Primary material (e.g., 'glass', 'PET plastic', 'cotton fabric')",
  "ideas": [
    {
      "type": "STRING. One of: easy | useful | creative",
      "title": "STRING. Short name of the project (e.g., 'Pencil holder', 'Drip irrigation')",
      "description": "STRING. What this project does, 15-25 words",
      "difficulty": "STRING. One of: Easy | Medium | Advanced",
      "time": "STRING. Estimated time (e.g., '5 minutes', '1 hour', 'Afternoon project')",
      "materials": ["ARRAY OF STRINGS. Tools/materials needed, 3-5 items, including the original object"],
      "steps": ["ARRAY OF STRINGS. 3-5 basic steps, action-oriented"],
      "safety": ["ARRAY OF STRINGS. Safety warnings specific to this project"]
    }
  ],
  "recyclingOptions": {
    "canRecycle": "BOOLEAN. Whether this material is typically recyclable curbside",
    "howToRecycle": "STRING. How to prepare it for recycling, or why it can't be recycled",
    "alternatives": ["ARRAY OF STRINGS. Donation centers, swap shops, specialty recyclers, etc."]
  }
}

Rules:
- Exactly 3 ideas: one "easy" (minimal effort), one "useful" (solves a real problem), one "creative" (unexpected/clever)
- Each idea must be doable by an average person with household tools
- Include safety warnings for anything involving heat, sharp edges, chemicals, or cutting
- NO emojis
- Keep steps simple and actionable
- If object cannot be easily recycled, explain why and suggest alternatives`;

export interface RepurposeIdea {
  type: 'easy' | 'useful' | 'creative';
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  time: string;
  materials: string[];
  steps: string[];
  safety: string[];
}

export interface RepurposeResult {
  object: string;
  material: string;
  ideas: RepurposeIdea[];
  recyclingOptions: {
    canRecycle: boolean;
    howToRecycle: string;
    alternatives: string[];
  };
}

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
          { role: 'system', content: REPURPOSE_SYSTEM_PROMPT },
          { role: 'user', content: `Suggest ways to repurpose this object: ${item}` },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI error:', error);
      return NextResponse.json({ error: 'Failed to generate repurpose ideas' }, { status: 500 });
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    return NextResponse.json({ result: JSON.parse(result || '{}') });
  } catch (error: unknown) {
    console.error('Repurpose generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate repurpose ideas' },
      { status: 500 }
    );
  }
}
