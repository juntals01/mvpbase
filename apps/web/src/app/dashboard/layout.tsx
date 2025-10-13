// apps/web/src/app/dashboard/layout.tsx
'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useApiUser, useAuthReady } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

function FullScreenSpinner() {
  return (
    <div className='grid min-h-screen place-items-center'>
      <div className='h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-black' />
    </div>
  );
}

function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const ready = useAuthReady();
  const user = useApiUser();

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace('/login');
  }, [ready, user, router]);

  if (!ready) return <FullScreenSpinner />;
  if (!user) return null;

  return <>{children}</>;
}

export default function DashboardAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
