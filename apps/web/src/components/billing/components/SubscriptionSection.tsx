'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  CalendarClock,
  ChevronRight,
  CreditCard,
  Settings,
} from 'lucide-react';

export function SubscriptionSection() {
  const paymentMethods = [
    { id: 'pm_1', brand: 'Visa', last4: '4242', isDefault: true },
  ];

  return (
    <div className='space-y-8'>
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-base'>Subscription</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-6'>
          <div className='flex items-center justify-between rounded-md border p-4'>
            <div className='flex items-center gap-3'>
              <div className='grid h-9 w-9 place-items-center rounded-md border'>
                <CalendarClock size={18} />
              </div>
              <div>
                <div className='text-sm font-medium'>Pro Max</div>
                <div className='text-xs text-muted-foreground'>
                  Renews May 20, 2026
                </div>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='text-right'>
                <div className='text-sm font-medium'>$1,800</div>
                <div className='text-xs text-muted-foreground'>/ year</div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size='icon' variant='ghost' className='h-8 w-8'>
                    <Settings className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-40'>
                  <DropdownMenuItem>Manage plan</DropdownMenuItem>
                  <DropdownMenuItem>Cancel subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Button variant='ghost' className='px-0 text-sm hover:bg-transparent'>
            <span className='underline underline-offset-4'>Switch plans</span>
            <ChevronRight className='ml-1 h-4 w-4' />
          </Button>

          <Separator />

          <div className='space-y-4'>
            <div className='text-sm font-medium'>Payment methods</div>
            <div className='space-y-2'>
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  className='flex items-center justify-between rounded-md border p-3'
                >
                  <div className='flex items-center gap-3'>
                    <div className='grid h-8 w-8 place-items-center rounded-md border'>
                      <CreditCard size={16} />
                    </div>
                    <div className='text-sm'>
                      {pm.brand} •••• {pm.last4}
                      {pm.isDefault && (
                        <span className='ml-2 rounded border px-1 text-xs text-muted-foreground'>
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant='ghost'
                className='w-full justify-start gap-2 text-sm'
              >
                <ChevronRight className='h-4 w-4' />
                Add new payment method
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
