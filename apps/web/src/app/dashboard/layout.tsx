// apps/web/app/dashboard/layout.tsx
'use client';

import { auth } from '@/lib/firebase';
import { onAuthStateChanged, onIdTokenChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

function FullScreenSpinner() {
  return (
    <div className='grid min-h-screen place-items-center'>
      <div className='h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black' />
    </div>
  );
}

function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });

    // Keep token fresh, and mirror it to a cookie for any server needs later
    const unsubToken = onIdTokenChanged(auth, async (u) => {
      if (u) {
        const token = await u.getIdToken().catch(() => null);
        if (token) {
          document.cookie = `__session=${token}; Path=/; Max-Age=${60 * 60 * 24 * 7}`;
        }
      } else {
        // Clear cookie on sign-out
        document.cookie = `__session=; Path=/; Max-Age=0`;
      }
    });

    return () => {
      unsubAuth();
      unsubToken();
    };
  }, []);

  useEffect(() => {
    if (ready && !user) router.replace('/login');
  }, [ready, user, router]);

  if (!ready) return <FullScreenSpinner />;
  if (!user) return null; // redirecting

  return <>{children}</>;
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
