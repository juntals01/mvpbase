'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { auth } from '@/lib/firebase';
import {
  onAuthStateChanged,
  onIdTokenChanged,
  signOut,
  User,
} from 'firebase/auth';
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

  // 🔹 Monitor auth state and ID token
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });

    const unsubToken = onIdTokenChanged(
      auth,
      async (u) => {
        if (u) {
          try {
            const token = await u.getIdToken();
            if (token) {
              // Mirror token to cookie (for possible SSR / API calls)
              document.cookie = `__session=${token}; Path=/; Max-Age=${
                60 * 60 * 24 * 7
              }`;
            }
          } catch (err) {
            console.warn('⚠️ Invalid or expired token, signing out...', err);
            await signOut(auth);
            router.replace('/login');
          }
        } else {
          // User signed out
          document.cookie = `__session=; Path=/; Max-Age=0`;
          setUser(null);
        }
      },
      (error) => {
        // Catch global token verification errors
        console.error('Firebase token listener error', error);
        signOut(auth).then(() => router.replace('/login'));
      }
    );

    return () => {
      unsubAuth();
      unsubToken();
    };
  }, [router]);

  // 🔹 Redirect if not logged in
  useEffect(() => {
    if (ready && !user) router.replace('/login');
  }, [ready, user, router]);

  if (!ready) return <FullScreenSpinner />;
  if (!user) return null; // Redirecting

  return <>{children}</>;
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <body className='min-h-dvh bg-background text-foreground antialiased'>
      <AuthGuard>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthGuard>
    </body>
  );
}
