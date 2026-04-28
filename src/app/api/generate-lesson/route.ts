import { NextRequest, NextResponse } from 'next/server';

const MOCK_ENABLED = process.env.OVERSTOOD_MOCK_AI === 'true';

const MOCK_LESSON = {
  actually: "Actually, the glass bottle you're holding used to be sand on a beach — heated to 1,700°F until it turned liquid.",
  whatsGoingOn: "Glass is made from silica sand, soda ash, and limestone melted together. The molecules lock in a random pattern when cooled fast, making it strong but brittle.",
  curiosityTraps: [
    "The same sand becomes concrete, glass, or silicon chips — just add heat and patience.",
    "Ancient glass turns purple over centuries because manganese oxidizes in sunlight.",
    "If you cooled molten glass slowly enough, it would crystallize and become ceramic instead."
  ],
  activities: {
    tryIt: "Hold the bottle up to light and rotate it — notice how the thickness varies, a sign of old manufacturing.",
    buildIt: "Sketch how you'd design a bottle that uses 30% less glass but holds the same volume.",
    goSeeIt: "Visit a thrift store and compare vintage bottle thickness to modern ones."
  },
  quiz: [
    {
      q: "What is the main ingredient in glass?",
      options: ["Plastic resin", "Silica sand", "Aluminum oxide", "Carbon fiber"],
      answer: 1
    },
    {
      q: "Why does glass turn purple over time?",
      options: ["Paint fades", "Manganese oxidizes in sunlight", "UV damage", "Chemical coating wears off"],
      answer: 1
    },
    {
      q: "What temperature is needed to melt glass?",
      options: ["500°F", "1,000°F", "1,700°F", "3,000°F"],
      answer: 2
    }
  ],
  unlockMore: [
    "why is tempered glass hard to break",
    "how are wine bottles different from soda bottles",
    "what is obsidian and how is it different from glass"
  ]
};

const SYSTEM_PROMPT = `You are a curious friend who just discovered something mind-blowing and can't wait to share it — someone who explains things the way a sharp older cousin would: direct, no-nonsense, always respectful. You treat the reader as someone who deserves the REAL answer, not the simplified one. You have a quiet awareness of how systems work and who benefits, without forcing it into every explanation. You speak to curious minds — especially Black children — like they're already smart. Because they are.

Tone guide: "TITAN IN AMERICA" — understanding is power. Your job is to hand someone the keys to something they were never told how actually worked. No condescension. No "kid-friendly" language. Just clear, sharp, real explanations.

CRITICAL FORMAT — respond as valid JSON with this EXACT structure. No extra fields, no missing fields:
{
  "actually": "STRING. 15-20 words max. Punchy revelation that starts with 'Actually...' or 'Here\'s the thing...' or 'The part nobody told you...'. No definition, no explanation — just the hidden truth. Drop a truth the textbooks left out. Example: 'Actually, elevators don't always drop — they fall at exactly the speed that feels safe to your body.'",
  "whatsGoingOn": "STRING. 2-3 sentences max. The real explanation. No preamble. No 'Let me explain'. Start mid-story. Max 40 words total.",
  "curiosityTraps": "ARRAY OF 3 STRINGS. Each is 1 sentence, a genuine 'wait... why?' or 'but what about...?' that opens a rabbit hole. NOT questions — they read like observations that make you think. Example: 'Wait, so if the sky is blue because of scattering, what color would it be on Mars?'",
  "activities": "OBJECT with 3 string fields: {tryIt, buildIt, goSeeIt}. tryIt: a 15-second thing to test this right now. buildIt: something to create or draw. goSeeIt: where to find this IRL. All max 20 words each.",
  "quiz": "ARRAY OF 3 OBJECTS. Each: {q: question string, options: [A,B,C,D] strings, answer: integer 0-3}. Questions test if they actually understood the core insight. Options should be plausible but distinct.",
  "unlockMore": "ARRAY OF 3 STRINGS. Each is a real topic someone would actually want to explore next. Format: a short, specific topic someone could snap or type. Examples: 'why do cats always land on their feet', 'how do zippers work', 'what makes honey never spoil'"
}

Rules:
- NO emoji anywhere
- actually = revelation, not definition. No 'is' or 'are' at the start. Drop truth like it's a secret.
- curiosityTraps = exactly 3 items, each max 25 words, no question marks encouraged but can use them
- activities = exactly these 3 keys, all required
- quiz = exactly 3 questions, answer is the correct option index (0-3)
- unlockMore = exactly 3 topics, realistic and related
- Max 25 words per curiosityTrap string
- Depth affects length: quick = minimal, standard = moderate, deep = thorough
- NEVER: 'here\'s how', 'let me explain', 'in conclusion', 'great question', 'Fun fact:', 'Did you know'
- ALWAYS: 'actually', 'here\'s the thing', 'the secret is', 'this is where it gets wild', 'the part they don\'t show you'`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  // MOCK MODE: Return mock response without hitting OpenAI
  if (MOCK_ENABLED) {
    console.log('OVERSTOOD_MOCK_AI enabled — returning mock response for /api/generate-lesson');
    return NextResponse.json({ lesson: MOCK_LESSON });
  }

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
        max_tokens: 1200,
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
