// apps/web/src/components/auth/NotificationDropdown.tsx
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DASHBOARD_LINKS } from '@/constants/dashboard-links';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export function NotificationDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          aria-label='Notifications'
          className='relative grid h-9 w-9 place-items-center rounded-md hover:bg-gray-100 transition-colors'
        >
          <Bell size={20} className='text-gray-600' />
          <span className='absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full' />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-64'>
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Example empty state */}
        <DropdownMenuItem className='text-sm text-muted-foreground'>
          You're all caught up! 🎉
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={DASHBOARD_LINKS.NOTIFICATION.path} className='text-sm'>
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
