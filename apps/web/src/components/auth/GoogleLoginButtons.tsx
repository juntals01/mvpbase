// apps/web/src/components/auth/GoogleLoginButtons.tsx
'use client';

import type { User } from '@/interfaces/response';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { getFirebaseAuth, getGoogleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GoogleLoginButtons() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setUser, setReady, setError } = useAuthStore();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const auth = getFirebaseAuth();
      const provider = getGoogleProvider();
      if (!auth || !provider) throw new Error('Auth not available');

      // Sign in via Firebase and ensure we have a fresh ID token
      const result = await signInWithPopup(auth, provider);
      await result.user.getIdToken(true);

      // Get full user (with role) from API
      const { data } = await api.get<User>('/auth/me');

      // ✅ keep store in sync
      setUser(data);
      setReady(true);

      // Redirect by role
      router.replace(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Login failed'));
      alert(getErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className='w-full rounded-md border px-4 py-2 text-sm hover:bg-accent disabled:opacity-50'
    >
      {loading ? 'Signing in...' : 'Continue with Google'}
    </button>
  );
}
