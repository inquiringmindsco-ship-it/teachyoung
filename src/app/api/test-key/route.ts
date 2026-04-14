import { NextResponse } from 'next/server';
export async function GET() {
  const key = process.env.OPENAI_API_KEY;
  return NextResponse.json({ 
    hasKey: !!key, 
    startsWith: key ? key.substring(0, 15) + '...' : 'MISSING',
    length: key ? key.length : 0
  });
}
