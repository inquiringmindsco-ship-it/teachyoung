import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('ty_session');

  if (!cookie?.value) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const decoded = JSON.parse(Buffer.from(cookie.value, 'base64url').toString('utf8'));
    const maxAge = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - decoded.iat > maxAge) {
      return NextResponse.json({ authenticated: false });
    }
    return NextResponse.json({
      authenticated: true,
      lkId: decoded.lkId,
      email: decoded.email,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
