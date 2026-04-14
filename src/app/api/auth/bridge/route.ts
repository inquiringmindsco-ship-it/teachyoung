import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createHash } from 'crypto';

/**
 * GET /api/auth/bridge
 * Bridges Likeness™ session to TeachYoung.
 * 
 * Flow:
 * 1. Magic link return from LikenessVerified → GET with bridge token
 * 2. Existing likeness_session cookie → try to validate + upsert
 * 3. No session → redirect to LikenessVerified login with return URL
 */

const LIKENESS_BASE = 'https://likenessverified.com';
const TOKEN_TTL_MS = 10 * 60 * 1000;

function verifyBridgeToken(token: string, secret: string): { email: string; lkId: string } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const parts = decoded.split('|');
    if (parts.length !== 4) return null;
    const [email, lkId, expiresAtStr, sig] = parts;
    if (Date.now() > parseInt(expiresAtStr)) return null;
    const payload = `${email}|${lkId}|${expiresAtStr}`;
    const expected = createHash('sha256').update(payload + secret).digest('base64url');
    if (sig !== expected) return null;
    return { email, lkId };
  } catch { return null; }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/', req.nextUrl.origin));
  }

  let lkId: string | null = null;
  let email: string | null = null;

  // Try bridge token first (from magic link return URL)
  if (token) {
    const secret = process.env.LIKENESS_AUTH_SECRET || process.env.MAGIC_LINK_SECRET;
    if (secret) {
      const identity = verifyBridgeToken(token, secret);
      if (identity) { lkId = identity.lkId; email = identity.email; }
    }
  }

  // Try existing likeness_session cookie
  if (!lkId) {
    const likenSession = req.cookies.get('likeness_session')?.value;
    if (likenSession) {
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
        if (res.ok) {
          const data = await res.json();
          if (data.valid) { lkId = data.lkId; email = data.email; }
        }
      } catch {}
    }
  }

  // No session → redirect to LikenessVerified login
  if (!lkId) {
    const returnUrl = encodeURIComponent(req.nextUrl.origin + '/api/auth/bridge');
    return NextResponse.redirect(`${LIKENESS_BASE}/login?return=${returnUrl}`);
  }

  // Upsert TeachYoung user
  const supabase = createServerClient();
  if (supabase) {
    await supabase.from('teachyoung_users').upsert({
      lk_id: lkId,
      email: email || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'lk_id' });
  }

  // Set TeachYoung session cookie (signed, 30-day)
  const sessionToken = Buffer.from(JSON.stringify({
    lkId,
    email: email || null,
    iat: Date.now(),
  })).toString('base64url');

  const response = NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
  response.cookies.set('ty_session', sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  return response;
}
