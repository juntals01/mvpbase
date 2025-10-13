import AuthListener from '@/components/auth/AuthListener';
import type { Metadata } from 'next';
import './globals.css';

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
    <html lang='en' suppressHydrationWarning>
      <body className='min-h-dvh bg-background text-foreground antialiased'>
        {/* 🔹 Global Firebase Auth listener (syncs with Zustand) */}
        <AuthListener />
        {children}
      </body>
    </html>
  );
}
