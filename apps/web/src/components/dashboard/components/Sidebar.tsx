'use client';

import {
  ClipboardList,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  ShoppingCart,
  User,
} from 'lucide-react';
import { NavItem } from './NavItem';
import { SectionDashboard } from './SectionDashboard';

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}) {
  return (
    <aside
      className={`flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div className='flex items-center justify-between px-4 py-4 border-b border-gray-200'>
        <div
          onClick={() => !sidebarOpen && setSidebarOpen(true)}
          className='flex items-center gap-2 cursor-pointer select-none'
        >
          <div className='bg-indigo-500 text-white font-bold rounded-full h-8 w-8 grid place-items-center'>
            G
          </div>
          {sidebarOpen && (
            <span className='font-semibold text-sm'>GOODFOOD</span>
          )}
        </div>

        {/* Only show hamburger if sidebar is open */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className='text-gray-500 hover:text-gray-700'
          >
            <Menu size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className='flex-1 mt-6'>
        <SectionDashboard title='MENU' open={sidebarOpen} />
        <ul className='space-y-1'>
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label='Dashboard'
            open={sidebarOpen}
          />
          <NavItem
            icon={<ShoppingCart size={18} />}
            label='Food Order'
            open={sidebarOpen}
          />
          <NavItem
            icon={<ClipboardList size={18} />}
            label='Manage Menu'
            open={sidebarOpen}
          />
          <NavItem
            icon={<MessageSquare size={18} />}
            label='Customer Review'
            open={sidebarOpen}
          />
        </ul>

        <SectionDashboard title='OTHERS' open={sidebarOpen} />
        <ul className='space-y-1'>
          <NavItem
            icon={<Settings size={18} />}
            label='Settings'
            open={sidebarOpen}
          />
          <NavItem
            icon={<CreditCard size={18} />}
            label='Payment'
            open={sidebarOpen}
          />
          <NavItem
            icon={<User size={18} />}
            label='Accounts'
            open={sidebarOpen}
          />
          <NavItem
            icon={<HelpCircle size={18} />}
            label='Help'
            open={sidebarOpen}
          />
        </ul>
      </nav>
    </aside>
  );
}
