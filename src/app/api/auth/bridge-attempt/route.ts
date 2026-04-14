import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const LIKENESS_BASE = 'https://likenessverified.com';

/**
 * POST /api/auth/bridge-attempt
 * Client-side call to silently bridge an existing likeness_session cookie
 * to a ty_session without full redirect flow.
 */
export async function POST(req: NextRequest) {
  const likenSession = req.cookies.get('likeness_session')?.value;
  if (!likenSession) {
    return NextResponse.json({ authenticated: false, reason: 'no_session' });
  }

  try {
    const res = await fetch(`${LIKENESS_BASE}/api/auth/internal/validate-session`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-api-key': process.env.LIKENESS_INTERNAL_API_KEY || 'likeness_admin_8200_secure',
        'cookie': `likeness_session=${likenSession}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ authenticated: false, reason: 'invalid' });
    }

    const data = await res.json();
    if (!data.valid) {
      return NextResponse.json({ authenticated: false, reason: 'not_valid' });
    }

    const { lkId, email } = data;

    // Upsert TeachYoung user
    const supabase = createServerClient();
    if (supabase) {
      await supabase.from('teachyoung_users').upsert({
        lk_id: lkId,
        email: email || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'lk_id' });
    }

    // Set ty_session
    const sessionToken = Buffer.from(JSON.stringify({
      lkId,
      email: email || null,
      iat: Date.now(),
    })).toString('base64url');

    const response = NextResponse.json({ authenticated: true, lkId, email });
    response.cookies.set('ty_session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (e) {
    console.error('[bridge-attempt] error:', e);
    return NextResponse.json({ authenticated: false, reason: 'error' });
  }
}
