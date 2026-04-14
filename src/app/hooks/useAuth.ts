'use client';

import { useState, useEffect } from 'react';

export interface AuthUser {
  lkId: string;
  email: string | null;
}

/**
 * Returns the current Likeness™ auth state.
 * - checking: true while we validate the session
 * - authenticated: true if ty_session cookie is valid
 * - user: the user identity if authenticated
 * 
 * Usage:
 *   const { checking, authenticated, user, signIn } = useAuth();
 * 
 * signIn() redirects to the LikenessVerified bridge flow.
 */
export function useAuth() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  // On mount: validate existing session
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setUser({ lkId: data.lkId, email: data.email });
            setAuthenticated(true);
          }
        }
      } catch {}
      setChecking(false);
    }
    checkSession();
  }, []);

  // Attempt silent bridge using existing likeness_session cookie
  const trySilentBridge = async () => {
    try {
      const res = await fetch('/api/auth/bridge-attempt', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser({ lkId: data.lkId, email: data.email });
          setAuthenticated(true);
          return true;
        }
      }
    } catch {}
    return false;
  };

  // Full sign-in: redirect to LikenessVerified
  const signIn = () => {
    const returnUrl = encodeURIComponent(window.location.origin + '/api/auth/bridge');
    window.location.href = `https://likenessverified.com/login?return=${returnUrl}`;
  };

  // Sign out: clear cookie + redirect to home
  const signOut = () => {
    document.cookie = 'ty_session=; Max-Age=0; path=/';
    setAuthenticated(false);
    setUser(null);
    window.location.href = '/';
  };

  return { checking, authenticated, user, trySilentBridge, signIn, signOut };
}
