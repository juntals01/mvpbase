// apps/web/src/components/auth/RightSide.tsx
'use client';

import { getFirebaseAuth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { Bell, LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function RightSide() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const auth = getFirebaseAuth(); // ✅ use helper (may be null during SSR/early mount)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } finally {
      router.replace('/login'); // smoother than window.location
    }
  };

  return (
    <div className='relative flex items-center gap-6' ref={dropdownRef}>
      <button
        type='button'
        className='relative'
        aria-label='Notifications'
        onClick={() => setOpen(false)}
      >
        <Bell size={20} className='text-gray-600' />
        <span className='absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full' />
      </button>

      <div className='relative'>
        <button
          type='button'
          onClick={() => setOpen((v) => !v)}
          className='flex items-center gap-2 focus:outline-none'
          aria-haspopup='menu'
          aria-expanded={open}
        >
          <div className='h-9 w-9 rounded-full bg-amber-100 grid place-items-center text-lg'>
            🍔
          </div>
          <span className='text-sm font-medium select-none'>
            Delicious Burger ▾
          </span>
        </button>

        {open && (
          <div
            role='menu'
            aria-label='Account menu'
            className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50'
          >
            <a
              href='/account/profile'
              role='menuitem'
              className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
              onClick={() => setOpen(false)}
            >
              <User size={16} />
              Account Profile
            </a>
            <a
              href='/account/settings'
              role='menuitem'
              className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
              onClick={() => setOpen(false)}
            >
              <Settings size={16} />
              Account Settings
            </a>

            <div className='my-1 border-t border-gray-200' />

            <button
              type='button'
              role='menuitem'
              onClick={handleLogout}
              className='w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50'
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
