// apps/web/src/components/auth/AuthListener.tsx
'use client';

import { getFirebaseAuth } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export default function AuthListener() {
  const refresh = useAuthStore((s) => s.refresh);
  const clear = useAuthStore((s) => s.clear);
  const setReady = useAuthStore((s) => s.setReady);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      // Running on server or missing client env vars
      setReady(true);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        clear();
        return;
      }
      try {
        await u.getIdToken(true);
        await refresh(); // hits /auth/me
      } finally {
        setReady(true);
      }
    });

    return () => unsub();
  }, [refresh, clear, setReady]);

  return null;
}
