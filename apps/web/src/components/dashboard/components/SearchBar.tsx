'use client';

export function SearchBar() {
  return (
    <div className='flex items-center gap-3 w-full max-w-md'>
      <input
        type='text'
        placeholder='Search'
        className='flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400'
      />
    </div>
  );
}
