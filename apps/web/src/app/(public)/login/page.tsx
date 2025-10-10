// apps/web/app/login/page.tsx
'use client';

import { auth, googleProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      document.cookie = `__session=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      document.cookie = `__session=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='mx-auto max-w-sm py-16 space-y-6'>
      <h1 className='text-2xl font-bold'>Sign In</h1>

      {/* Email/Password Login */}
      <form onSubmit={handleEmailLogin} className='space-y-4'>
        <div>
          <label className='block text-sm mb-1'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='w-full rounded-md border px-3 py-2 text-sm'
          />
        </div>
        <div>
          <label className='block text-sm mb-1'>Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='w-full rounded-md border px-3 py-2 text-sm'
          />
        </div>
        <button
          type='submit'
          disabled={loading}
          className='w-full rounded-md border px-4 py-2 text-sm hover:bg-accent disabled:opacity-50'
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <div className='relative flex items-center justify-center'>
        <span className='absolute bg-background px-2 text-xs text-muted-foreground'>
          OR
        </span>
        <hr className='w-full border-muted-foreground/30' />
      </div>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className='w-full rounded-md border px-4 py-2 text-sm hover:bg-accent disabled:opacity-50'
      >
        {loading ? 'Signing in...' : 'Continue with Google'}
      </button>
    </section>
  );
}
