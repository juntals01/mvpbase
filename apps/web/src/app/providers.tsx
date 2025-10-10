// apps/web/app/providers.tsx
'use client';

import { Toaster } from '@/components/ui/sonner';
// If you use other client providers (ThemeProvider, QueryClientProvider, etc.) wrap them here.

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
