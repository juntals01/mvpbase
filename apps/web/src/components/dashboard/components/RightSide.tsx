'use client';

import { app } from '@/lib/firebase'; // adjust import if your firebase is elsewhere
import { getAuth, signOut } from 'firebase/auth';
import { Bell, LogOut, Settings, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function RightSide() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const auth = getAuth(app);

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/login'; // redirect to login page
  };

  return (
    <div className='relative flex items-center gap-6' ref={dropdownRef}>
      <button className='relative'>
        <Bell size={20} className='text-gray-600' />
        <span className='absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full'></span>
      </button>

      <div className='relative'>
        <button
          onClick={() => setOpen(!open)}
          className='flex items-center gap-2 focus:outline-none'
        >
          <div className='h-9 w-9 rounded-full bg-amber-100 grid place-items-center text-lg'>
            🍔
          </div>
          <span className='text-sm font-medium select-none'>
            Delicious Burger ▾
          </span>
        </button>

        {open && (
          <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50'>
            <a
              href='/account/profile'
              className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
            >
              <User size={16} />
              Account Profile
            </a>
            <a
              href='/account/settings'
              className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
            >
              <Settings size={16} />
              Account Settings
            </a>

            <div className='my-1 border-t border-gray-200' />

            <button
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
