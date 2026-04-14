import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

export interface TeachYoungSession {
  lkId: string;
  email: string | null;
  iat: number;
}

/**
 * Decode and validate TeachYoung session cookie (ty_session).
 * Returns null if missing, invalid, or expired.
 */
export async function getSession(): Promise<TeachYoungSession | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('ty_session');
    if (!cookie?.value) return null;

    const decoded = JSON.parse(Buffer.from(cookie.value, 'base64url').toString('utf8'));

    // 30-day expiry
    if (Date.now() - decoded.iat > 30 * 24 * 60 * 60 * 1000) {
      return null;
    }

    return decoded as TeachYoungSession;
  } catch {
    return null;
  }
}

/**
 * Require a valid session — throws if missing.
 */
export async function requireSession(): Promise<TeachYoungSession> {
  const session = await getSession();
  if (!session) {
    throw new Error('NOT_AUTHENTICATED');
  }
  return session;
}
