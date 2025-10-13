'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileDown } from 'lucide-react';

const statements = [
  {
    id: 'st_001',
    date: 'May 20, 2025',
    amount: '$1,800.00',
    status: 'Paid',
    url: '#',
  },
  {
    id: 'st_000',
    date: 'May 20, 2024',
    amount: '$1,800.00',
    status: 'Paid',
    url: '#',
  },
];

export function StatementsSection() {
  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {statements.map((s) => (
              <div
                key={s.id}
                className='flex items-center justify-between rounded-md border p-3'
              >
                <div>
                  <div className='text-sm font-medium'>{s.date}</div>
                  <div className='text-xs text-muted-foreground'>
                    {s.status}
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='text-sm font-medium'>{s.amount}</div>
                  <Button variant='ghost' size='icon'>
                    <FileDown className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
