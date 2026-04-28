import { NextRequest, NextResponse } from 'next/server';

const MOCK_ENABLED = process.env.OVERSTOOD_MOCK_AI === 'true';

const MOCK_REPURPOSE = {
  object: "plastic bottle",
  material: "PET plastic (polyethylene terephthalate)",
  ideas: [
    {
      type: "easy",
      title: "Self-watering planter",
      description: "Cut the bottle in half, flip the top upside down into the base, and fill with water. The soil wicks moisture up through the neck.",
      difficulty: "Easy",
      time: "5 minutes",
      materials: ["Plastic bottle", "Scissors", "Potting soil", "Small plant"],
      steps: [
        "Cut bottle in half around the middle",
        "Poke a small hole in the cap",
        "Flip top half upside down into bottom half",
        "Fill neck with soil and plant",
        "Add water to base reservoir"
      ],
      safety: ["Wear eye protection when cutting", "Adult supervision recommended for children"]
    },
    {
      type: "useful",
      title: "Drip irrigation for garden",
      description: "Poke tiny holes in bottle, bury it near plant roots, and fill with water. Creates slow-release watering system for dry spells.",
      difficulty: "Easy",
      time: "10 minutes",
      materials: ["Large plastic bottle", "Small nail or drill", "Duct tape (optional)"],
      steps: [
        "Poke 2-3 tiny holes in bottle sides near bottom",
        "Dig hole next to plant roots",
        "Bury bottle with cap removed, neck up",
        "Fill with water and check flow rate",
        "Refill as needed"
      ],
      safety: ["Wash hands after handling soil", "Keep cap away from small children"]
    },
    {
      type: "creative",
      title: "Vertical herb garden wall",
      description: "Cut bottles horizontally, mount to fence or wall, and create cascading herb planters. Labels can be written on bottles with marker.",
      difficulty: "Medium",
      time: "1 hour",
      materials: ["6-10 plastic bottles", "Heavy duty scissors", "Screws and washers", "Drill", "Potting soil", "Herb seedlings"],
      steps: [
        "Remove labels and clean bottles thoroughly",
        "Cut rectangular openings on one side",
        "Drill drainage holes in bottom",
        "Mount bottles staggered on fence with screws",
        "Fill with soil and plant herbs",
        "Water top bottles and let drain to lower ones"
      ],
      safety: ["Wear gloves when handling drill", "Ensure wall mount can hold weight of wet soil", "Check for sharp edges after cutting"]
    }
  ],
  recyclingOptions: {
    canRecycle: true,
    howToRecycle: "Rinse bottle, remove cap (recycle separately), and flatten to save space. Check local rules — some areas require caps on, others off.",
    alternatives: [
      "Drop off at grocery store collection bins",
      "Terracycle for hard-to-recycle plastics",
      "Local maker spaces for craft material donations"
    ]
  }
};

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

  // MOCK MODE: Return mock response without hitting OpenAI
  if (MOCK_ENABLED) {
    console.log('OVERSTOOD_MOCK_AI enabled — returning mock response for /api/generate-repurpose');
    return NextResponse.json({ result: MOCK_REPURPOSE });
  }

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
