// apps/web/src/app/(public)/login/page.tsx
'use client';

import EmailLoginForm from '@/components/auth/EmailLoginForm';
import GoogleLoginButtons from '@/components/auth/GoogleLoginButtons';

export default function LoginPage() {
  return (
    <section className='mx-auto max-w-sm py-16 space-y-6'>
      <h1 className='text-2xl font-bold'>Sign In</h1>

      <EmailLoginForm />

      <div className='relative flex items-center justify-center'>
        <span className='absolute bg-background px-2 text-xs text-muted-foreground'>
          OR
        </span>
        <hr className='w-full border-muted-foreground/30' />
      </div>

      <GoogleLoginButtons />
    </section>
  );
}
