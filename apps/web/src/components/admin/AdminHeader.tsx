'use client';

import { getFirebaseAuth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { LogOut, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <header className='flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm'>
      <div className='flex items-center gap-3'>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className='md:hidden'
        >
          <Menu size={20} />
        </button>
        <h1 className='text-lg font-semibold'>Admin Panel</h1>
      </div>

      <button
        onClick={handleLogout}
        className='flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100'
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  );
}
