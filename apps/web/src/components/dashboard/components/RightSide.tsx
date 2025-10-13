// apps/web/src/components/auth/RightSide.tsx
'use client';

import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';

export function RightSide() {
  return (
    <div className='relative flex items-center gap-6'>
      <NotificationDropdown />
      <ProfileDropdown />
    </div>
  );
}
