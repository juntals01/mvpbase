'use client';

import { RightSide } from './RightSide';
import { SearchBar } from './SearchBar';

export function Header() {
  return (
    <header className='flex items-center justify-between bg-white border-b border-gray-200 px-6 h-16 shadow-sm'>
      <SearchBar />
      <RightSide />
    </header>
  );
}
