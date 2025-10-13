// apps/web/src/components/site-header.tsx
'use client';

import { getFirebaseAuth } from '@/lib/firebase';
import { useApiUser, useAuthReady } from '@/store/useAuthStore';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function SiteHeader() {
  const router = useRouter();
  const ready = useAuthReady();
  const user = useApiUser();

  const handleLogout = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      await signOut(auth);
    }
    document.cookie = '__session=; Path=/; Max-Age=0';
    router.push('/login');
  }, [router]);

  const authed = ready ? !!user : null;

  return (
    <header className='border-b bg-background/80 backdrop-blur'>
      <div className='container mx-auto flex items-center justify-between gap-6 px-4 py-4'>
        <Link href='/' className='font-semibold tracking-tight'>
          MVP Base
        </Link>

        <nav className='flex items-center gap-6 text-sm'>
          <Link href='/' className='hover:underline underline-offset-4'>
            Home
          </Link>
          <Link href='/about' className='hover:underline underline-offset-4'>
            About
          </Link>
          <Link href='/pricing' className='hover:underline underline-offset-4'>
            Pricing
          </Link>
        </nav>

        <div className='flex items-center gap-3'>
          {authed === null ? null : authed ? (
            <>
              <Link
                href='/dashboard'
                className='rounded-md border px-3 py-1.5 text-sm hover:bg-accent'
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className='rounded-md border px-3 py-1.5 text-sm hover:bg-accent'
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href='/login'
              className='rounded-md border px-3 py-1.5 text-sm hover:bg-accent'
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
