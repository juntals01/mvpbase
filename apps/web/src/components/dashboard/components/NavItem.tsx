export function NavItem({
  icon,
  label,
  open,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
}) {
  return (
    <li>
      <a
        href='#'
        className={`flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-indigo-50 transition-all ${
          open ? 'justify-start' : 'justify-center'
        }`}
      >
        {icon}
        {open && <span className='text-sm'>{label}</span>}
      </a>
    </li>
  );
}
