'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for trying things out.',
    features: ['1 project', 'Basic analytics', 'Community support'],
    cta: 'Get Started',
  },
  {
    name: 'Pro',
    price: '$19/mo',
    description: 'For growing teams and creators.',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      'Team collaboration',
    ],
    cta: 'Upgrade Now',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored for large-scale operations.',
    features: [
      'Dedicated account manager',
      'Custom integrations',
      'SLA & 24/7 support',
    ],
    cta: 'Contact Sales',
  },
];

const PricingPage = () => {
  return (
    <section className='container mx-auto px-4 py-20'>
      <div className='text-center mb-16'>
        <h1 className='text-4xl font-bold tracking-tight mb-3'>
          Pricing Plans
        </h1>
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          Choose a plan that fits your goals. Start free and upgrade when you’re
          ready.
        </p>
      </div>

      <div className='grid gap-8 md:grid-cols-3'>
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className='flex flex-col justify-between border-border hover:shadow-lg transition-shadow'
          >
            <CardHeader>
              <CardTitle className='text-2xl font-semibold'>
                {plan.name}
              </CardTitle>
              <p className='text-3xl font-bold mt-2'>{plan.price}</p>
              <p className='text-sm text-muted-foreground mt-1'>
                {plan.description}
              </p>
            </CardHeader>
            <CardContent className='flex flex-col gap-3'>
              <ul className='flex-1 space-y-2'>
                {plan.features.map((feature) => (
                  <li key={feature} className='text-sm text-foreground'>
                    • {feature}
                  </li>
                ))}
              </ul>
              <Button className='mt-4 w-full'>{plan.cta}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PricingPage;
