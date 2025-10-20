// apps/web/src/components/auth/EmailLoginForm.tsx
'use client';

import type { User } from '@/interfaces/response';
import { api } from '@/lib/api';

import { getErrorMessage } from '@/lib/errors';
import { getFirebaseAuth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EmailLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const auth = getFirebaseAuth();
      if (!auth) throw new Error('Auth not available in this environment');

      // Firebase sign in
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await userCred.user.getIdToken(true);

      // Fetch user profile from API (includes role)
      const { data } = await api.get<User>('/auth/me');

      // Redirect based on role
      if (data.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace('/dashboard');
      }
    } catch (err: unknown) {
      alert(getErrorMessage(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailLogin} className='space-y-4'>
      <div>
        <label className='block text-sm mb-1'>Email</label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='w-full rounded-md border px-3 py-2 text-sm'
          autoComplete='email'
          disabled={loading}
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
          autoComplete='current-password'
          disabled={loading}
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
  );
}
