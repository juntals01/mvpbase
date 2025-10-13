// apps/web/src/components/auth/ProfileDropdown.tsx
'use client';

import { signOut } from 'firebase/auth';
import { CreditCard, LogOut, Settings, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { DASHBOARD_LINKS } from '@/constants/dashboard-links';
import { getFirebaseAuth } from '@/lib/firebase';
import { useApiUser } from '@/store/useAuthStore';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ProfileDropdown() {
  const router = useRouter();
  const auth = getFirebaseAuth();
  const user = useApiUser();

  const { displayName, initial } = useMemo(() => {
    const name =
      (user as any)?.name ??
      (user as any)?.fullName ??
      (user as any)?.username ??
      (user as any)?.email?.split('@')?.[0] ??
      'User';
    const init = String(name).trim().charAt(0).toUpperCase() || 'U';
    return { displayName: name, initial: init };
  }, [user]);

  const handleLogout = async () => {
    try {
      if (auth) await signOut(auth);
    } finally {
      router.replace('/login');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className='flex items-center gap-2 focus:outline-none'
          aria-haspopup='menu'
          aria-expanded={false}
        >
          <div className='h-9 w-9 rounded-full bg-amber-100 grid place-items-center text-sm font-medium'>
            {initial}
          </div>
          <span className='text-sm font-medium select-none'>
            {displayName} ▾
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem asChild>
          <Link href={DASHBOARD_LINKS.PROFILE.path}>
            <div className='flex items-center gap-2'>
              <UserIcon size={16} />
              <span>{DASHBOARD_LINKS.PROFILE.label}</span>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={DASHBOARD_LINKS.SETTINGS.path}>
            <div className='flex items-center gap-2'>
              <Settings size={16} />
              <span>{DASHBOARD_LINKS.SETTINGS.label}</span>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={DASHBOARD_LINKS.BILLING.path}>
            <div className='flex items-center gap-2'>
              <CreditCard size={16} />
              <span>{DASHBOARD_LINKS.BILLING.label}</span>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className='text-red-600 focus:text-red-700'
        >
          <LogOut size={16} className='mr-2' />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
