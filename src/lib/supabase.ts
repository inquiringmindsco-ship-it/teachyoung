import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_TEACHYOUNG_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_TEACHYOUNG_SUPABASE_ANON_KEY || '';

// Browser client (RLS applied via session)
export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[teachyoung] Supabase env vars not configured');
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true },
  });
}

// Server client for API routes (uses service role)
export function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Validate Likeness™ session and return user identity
export async function validateLikenessSession(cookieValue: string): Promise<{
  valid: boolean;
  lkId?: string;
  email?: string;
  name?: string;
} | null> {
  const baseUrl = process.env.LIKENESS_VERIFIED_URL || 'https://likenessverified.com';
  const res = await fetch(`${baseUrl}/api/auth/internal/validate-session`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-api-key': process.env.LIKENESS_INTERNAL_API_KEY || 'likeness_admin_8200_secure',
      'cookie': `likeness_session=${cookieValue}`,
    },
  });
  if (!res.ok) return null;
  return res.json();
}
