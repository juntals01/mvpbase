// apps/web/src/components/auth/SocialLoginButtons.tsx
'use client';

import api from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import { getFirebaseAuth, getGoogleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GoogleLoginButtons() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const auth = getFirebaseAuth();
      const provider = getGoogleProvider();
      if (!auth || !provider) throw new Error('Auth not available');
      const result = await signInWithPopup(auth, provider);
      await result.user.getIdToken(true);
      await api.get('/auth/me');
      router.replace('/dashboard');
    } catch (err: unknown) {
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
