'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, ready, loading, refresh } = useAuthStore();

  useEffect(() => {
    if (!ready && !loading) void refresh();
  }, [ready, loading, refresh]);

  useEffect(() => {
    if (!ready) return;
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [ready, loading, user, router]);

  if (!ready || loading) {
    return (
      <div className='grid h-screen place-items-center'>
        <div className='h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-black' />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  return <>{children}</>;
}
