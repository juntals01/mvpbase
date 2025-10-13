'use client';

import {
  useApiUser,
  useAuthError,
  useAuthLoading,
  useAuthReady,
} from '@/store/useAuthStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

function FullScreenSpinner() {
  return (
    <div className='grid min-h-screen place-items-center'>
      <div className='h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black' />
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const ready = useAuthReady();
  const user = useApiUser();
  const loading = useAuthLoading();
  const err = useAuthError();

  // redirect when we know we're unauthenticated
  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace('/login');
  }, [ready, user, router]);

  const joined = useMemo(() => {
    if (!user?.createdAt) return null;
    try {
      return new Date(user.createdAt).toLocaleString();
    } catch {
      return user.createdAt;
    }
  }, [user?.createdAt]);

  if (!ready) return <FullScreenSpinner />;
  if (!user) return null;

  return (
    <section className='space-y-4'>
      <header>
        <h1 className='text-2xl font-semibold'>Dashboard</h1>
        <p className='text-muted-foreground'>You’re authenticated 🎉</p>
      </header>

      {loading && <p>Loading user data…</p>}
      {!loading && err && <p className='text-destructive'>{err}</p>}

      {!loading && user && (
        <div className='rounded-lg border p-4 flex items-start gap-4'>
          {user.picture ? (
            <Image
              src={user.picture}
              alt={user.name ?? 'Profile photo'}
              width={56}
              height={56}
              className='rounded-full'
            />
          ) : (
            <div className='h-14 w-14 rounded-full bg-muted' />
          )}

          <div className='space-y-1'>
            <div className='font-medium'>{user.name ?? 'No name yet'}</div>
            <div className='text-sm text-muted-foreground'>
              {user.email ?? 'No email'}
            </div>
            <div className='text-sm'>
              Phone: {user.phoneNumber ?? 'No number'}
            </div>
            {joined && (
              <div className='text-xs text-muted-foreground'>
                Joined: {joined}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
