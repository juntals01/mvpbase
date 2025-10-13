// apps/web/src/components/auth/NavItem.tsx
'use client';

import Link from 'next/link';

export function NavItem({
  icon,
  label,
  open,
  href = '#',
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  href?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-indigo-50 transition-all ${
          open ? 'justify-start' : 'justify-center'
        }`}
      >
        {icon}
        {open && <span className='text-sm'>{label}</span>}
      </Link>
    </li>
  );
}
