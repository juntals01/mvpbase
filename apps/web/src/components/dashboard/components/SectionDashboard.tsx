export function SectionDashboard({
  title,
  open,
}: {
  title: string;
  open: boolean;
}) {
  if (!open) return <div className='h-4' />;
  return (
    <div className='px-4 text-xs font-semibold text-gray-400 mb-2 mt-4'>
      {title}
    </div>
  );
}
