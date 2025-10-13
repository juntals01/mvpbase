'use client';

import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className='flex min-h-screen bg-[#f5f5fb56] text-gray-800'>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className='flex flex-col flex-1'>
        <Header />

        {/* Content Area */}
        <main className='flex-1 p-6 bg-white'>{children}</main>
      </div>
    </div>
  );
}
