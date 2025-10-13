'use client';

import {
  useApiUser,
  useAuthLoading,
  useAuthReady,
  useAuthStore,
} from '@/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// shadcn/ui
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// optional toast (shadcn/sonner). You already have <Toaster /> in RootLayout.
import { toast } from 'sonner';

const ProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .max(255, 'Max 255 characters')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  picture: z
    .string()
    .trim()
    .url('Must be a valid URL')
    .max(2048, 'Too long')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  phoneNumber: z
    .string()
    .trim()
    .max(64, 'Max 64 characters')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});

type ProfileValues = z.infer<typeof ProfileSchema>;

export default function ProfilePage() {
  const user = useApiUser();
  const ready = useAuthReady();
  const loading = useAuthLoading();
  const refresh = useAuthStore((s) => s.refresh);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: '',
      picture: '',
      phoneNumber: '',
    },
  });

  // Load current profile (once)
  useEffect(() => {
    if (!ready) {
      void refresh();
    }
  }, [ready, refresh]);

  // When user arrives/changes, reset form values
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? '',
        picture: user.picture ?? '',
        phoneNumber: user.phoneNumber ?? '',
      });
    }
  }, [user, form]);

  const onSubmit = async (values: ProfileValues) => {
    try {
      // Convert empty strings -> null to match API contract
      const payload = {
        name: values.name ?? null,
        picture: values.picture ?? null,
        phoneNumber: values.phoneNumber ?? null,
      };
      await updateProfile(payload);
      toast.success('Profile updated');
    } catch (e: any) {
      const message =
        e?.response?.data?.message ?? e?.message ?? 'Failed to update profile';
      toast.error(message);
    }
  };

  if (!ready || loading) {
    return <div className='p-6'>Loading profile…</div>;
  }

  return (
    <div className='mx-auto max-w-xl p-6 space-y-6'>
      <h1 className='text-2xl font-semibold'>Profile</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Your name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='picture'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Picture URL</FormLabel>
                <FormControl>
                  <Input placeholder='https://…' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder='+63917…' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-fit'>
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
