'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function Page() {
  const [count, setCount] = useState(0);

  return (
    <main className='min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 space-y-8'>
      <div className='text-center space-y-2'>
        <h1 className='text-4xl font-bold text-primary'>Welcome to MVP Base</h1>
        <p className='text-muted-foreground'>
          This page shows your ShadCN + Tailwind + custom blue/cyan theme.
        </p>
      </div>

      <Card className='max-w-md w-full shadow-lg border border-border'>
        <CardHeader>
          <CardTitle className='text-lg text-primary'>Demo Form</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Your Name</Label>
            <Input id='name' placeholder='John Doe' />
          </div>
          <div className='flex gap-2 justify-end'>
            <Button variant='secondary'>Cancel</Button>
            <Button>Submit</Button>
          </div>
        </CardContent>
      </Card>

      <div className='space-y-4 w-full max-w-md text-center'>
        <p className='text-sm text-muted-foreground'>
          Buttons and hover states
        </p>
        <div className='flex flex-wrap justify-center gap-3'>
          <Button onClick={() => setCount(count + 1)}>Primary ({count})</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='destructive'>Destructive</Button>
          <Button variant='outline'>Outline</Button>
          <Button variant='ghost'>Ghost</Button>
          <Button variant='link'>Link</Button>
        </div>
      </div>

      <div className='w-full max-w-md text-center space-y-3'>
        <div className='bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition'>
          Custom Tailwind bg-primary
        </div>
        <div className='bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition'>
          Custom Tailwind bg-secondary
        </div>
      </div>
    </main>
  );
}
