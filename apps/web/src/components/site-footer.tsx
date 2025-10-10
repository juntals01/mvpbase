// apps/web/components/site-footer.tsx
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className='border-t'>
      <div className='container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row'>
        <p className='text-xs text-muted-foreground'>
          © {new Date().getFullYear()} MVP Base. All rights reserved.
        </p>
        <nav className='flex items-center gap-4 text-xs'>
          <Link href='/terms' className='hover:underline underline-offset-4'>
            Terms
          </Link>
          <Link href='/privacy' className='hover:underline underline-offset-4'>
            Privacy
          </Link>
          <Link href='/contact' className='hover:underline underline-offset-4'>
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
