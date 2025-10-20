// apps/web/src/app/admin/layout.tsx
'use client';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, ready, loading, init } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 🔒 Run init() exactly once (guards Strict Mode double-effect in dev)
  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    init(); // waits for Firebase to hydrate, then refreshes /users/me if signed in
  }, [init]);

  // ✅ Redirect only when we have definitive answers
  useEffect(() => {
    if (!ready || loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [ready, loading, user, router]);

  // ⏳ Skeleton while verifying or non-admin (we'll redirect)
  const checking = useMemo(
    () => !ready || loading || !user || user.role !== 'admin',
    [ready, loading, user]
  );

  if (checking) {
    return (
      <div className='p-6'>
        <div className='h-5 w-36 animate-pulse rounded bg-gray-200' />
        <div className='mt-4 h-24 animate-pulse rounded bg-gray-100' />
      </div>
    );
  }

  // ✅ Past this point: ready && !loading && user.role === 'admin'
  return (
    <div className='flex min-h-screen bg-[#f9fafb] text-gray-800'>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className='flex flex-1 flex-col'>
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className='flex-1 rounded-tl-2xl bg-white p-6 shadow-sm'>
          {children}
        </main>
      </div>
    </div>
  );
}
