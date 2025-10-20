'use client';

import { ADMIN_LINKS } from '@/constants/admin-links';
import Link from 'next/link';

export function AdminSidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-0 md:w-16'
      } flex flex-col overflow-hidden border-r bg-white transition-all duration-300`}
    >
      <div className='flex h-16 items-center justify-center border-b font-bold text-lg'>
        Admin
      </div>
      <nav className='flex-1 space-y-1 p-4 text-sm'>
        {ADMIN_LINKS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className='flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100'
          >
            <Icon size={18} />
            <span className='hidden md:inline'>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
