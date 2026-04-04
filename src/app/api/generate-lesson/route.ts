import { NextRequest, NextResponse } from 'next/server';

const AGE_PROMPTS: Record<string, string> = {
  '3-5': 'Use very simple words. Keep it to 1-2 sentences per section. Make it playful and concrete. Focus on what they can see, touch, or experience with their senses.',
  '6-8': 'Use simple explanations. Keep each section short (2-3 sentences). Relate ideas to things kids this age know — sports, games, food, school.',
  '9-12': 'Use thoughtful explanations. Each section can be 3-4 sentences. Include real vocabulary words. Connect ideas to their everyday life.',
  '13+': 'Use sophisticated but accessible language. Each section can be 4-5 sentences. Include nuanced explanations. Challenge them to think critically.',
};

const LESSON_SYSTEM_PROMPT = `You are creating real-world lessons for a child and parent to experience together.

Create a lesson that is:
- engaging and conversational
- easy to teach immediately
- warm and human
- short but impactful
- NOT like a textbook

Use this structure EXACTLY:

1. What is this?
Give a simple, relatable explanation.

2. How it works
Explain the real-world science, logic, or purpose in age-appropriate language.

3. Why it matters
Connect it to everyday life so the child understands why it is important.

4. Vocabulary
Give 3 words with their definitions that are useful and relevant.

5. Try this together
Create ONE simple hands-on activity a parent and child can do right now.

6. Ask your child
Give 2-3 thoughtful questions that encourage curiosity and discussion.

Rules:
- Do not sound like a textbook
- Do not over-explain
- Keep it exciting and usable
- Make it feel like discovery`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
  }

  try {
    const { item, ageGroup } = await request.json();

    if (!item || !ageGroup) {
      return NextResponse.json({ error: 'Missing item or ageGroup' }, { status: 400 });
    }

    const ageInstruction = AGE_PROMPTS[ageGroup] || AGE_PROMPTS['9-12'];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `${LESSON_SYSTEM_PROMPT}\n\nAge group context: ${ageInstruction}` },
          { role: 'user', content: `Create a lesson about: ${item}` },
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
    console.error('Lesson generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate lesson' },
      { status: 500 }
    );
  }
}
