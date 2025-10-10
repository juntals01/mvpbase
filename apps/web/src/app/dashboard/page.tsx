// apps/web/app/dashboard/page.tsx
'use client';

import { api } from '@/lib/api';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type Profile = {
  id: string;
  firebaseUid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  role: 'user' | 'admin';
  isOnboarded: boolean;
  createdAt: string; // coming back as ISO string from API
  updatedAt: string;
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null); // null = checking

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;

      if (!user) {
        setAuthed(false);
        setProfile(null);
        setErr('You must be signed in to view this page.');
        setLoading(false);
        return;
      }

      setAuthed(true);
      setErr(null);
      setLoading(true);

      try {
        const { data } = await api.get<Profile>('/profiles/me', {
          signal: controller.signal as any, // Axios supports AbortController
        });
        if (!isMounted) return;
        setProfile(data);
      } catch (e: any) {
        if (!isMounted) return;
        if (e?.name === 'CanceledError') return; // request was canceled
        const message =
          e?.response?.data?.message ||
          (e?.response?.status === 401
            ? 'Session expired. Please sign in again.'
            : 'Failed to load profile');
        setErr(message);
        setProfile(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      controller.abort();
      unsub();
    };
  }, []);

  const joined = useMemo(() => {
    if (!profile?.createdAt) return null;
    try {
      return new Date(profile.createdAt).toLocaleString();
    } catch {
      return profile.createdAt;
    }
  }, [profile?.createdAt]);

  return (
    <section className='space-y-4'>
      <header>
        <h1 className='text-2xl font-semibold'>Dashboard</h1>
        <p className='text-muted-foreground'>You’re authenticated 🎉</p>
      </header>

      {authed === null && <p>Checking authentication…</p>}
      {authed === false && <p className='text-destructive'>{err}</p>}

      {authed && loading && <p>Loading profile…</p>}
      {authed && !loading && err && <p className='text-destructive'>{err}</p>}

      {authed && !loading && profile && (
        <div className='rounded-lg border p-4 flex items-start gap-4'>
          {profile.photoURL ? (
            <Image
              src={profile.photoURL}
              alt={profile.displayName ?? 'Profile photo'}
              width={56}
              height={56}
              className='rounded-full'
            />
          ) : (
            <div className='h-14 w-14 rounded-full bg-muted' />
          )}

          <div className='space-y-1'>
            <div className='font-medium'>
              {profile.displayName ?? 'No name yet'}
            </div>
            <div className='text-sm text-muted-foreground'>
              {profile.email ?? 'No email'}
            </div>
            <div className='text-sm'>Role: {profile.role}</div>
            <div className='text-sm'>
              Onboarded: {profile.isOnboarded ? 'Yes' : 'No'}
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
