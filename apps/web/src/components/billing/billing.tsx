'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatementsSection } from './components/StatementsSection';
import { SubscriptionSection } from './components/SubscriptionSection';

export default function Billing() {
  return (
    <div className='mx-auto w-full space-y-6'>
      <h1 className='text-2xl font-semibold'>Billing</h1>

      <Tabs defaultValue='subscription' className='w-full'>
        {/* underline-style links */}
        <TabsList className='relative h-auto w-full justify-start gap-8 rounded-none border-b border-gray-200 bg-transparent p-0'>
          <TabsTrigger
            value='subscription'
            className='relative rounded-none border-none bg-transparent px-0 pb-2 text-sm font-medium text-gray-600 transition-colors duration-150 hover:text-gray-900 data-[state=active]:text-gray-900
                       after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gray-900 after:transition-all after:duration-200
                       data-[state=active]:after:w-full'
          >
            Subscription
          </TabsTrigger>

          <TabsTrigger
            value='statements'
            className='relative rounded-none border-none bg-transparent px-0 pb-2 text-sm font-medium text-gray-600 transition-colors duration-150 hover:text-gray-900 data-[state=active]:text-gray-900
                       after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gray-900 after:transition-all after:duration-200
                       data-[state=active]:after:w-full'
          >
            Statements
          </TabsTrigger>
        </TabsList>

        <TabsContent value='subscription' className='mt-6'>
          <SubscriptionSection />
        </TabsContent>

        <TabsContent value='statements' className='mt-6'>
          <StatementsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
