import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <div className='bg-red-500'>
      OK {`${process.env.NEXT_PUBLIC_API_URL}`}
      <Button>Click me</Button>
    </div>
  );
}
