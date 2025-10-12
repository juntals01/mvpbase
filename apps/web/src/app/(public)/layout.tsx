// apps/web/app/layout.tsx
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import type { Metadata } from 'next';
import { Providers } from '../providers';

export const metadata: Metadata = {
  title: 'MVP Base',
  description: 'Next.js + Tailwind starter',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className='min-h-dvh bg-background text-foreground antialiased'>
      <Providers>
        <SiteHeader />
        <main className='container mx-auto px-4 py-8'>{children}</main>
        <SiteFooter />
      </Providers>
    </body>
  );
}
