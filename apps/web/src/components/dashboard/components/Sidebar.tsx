// apps/web/src/components/auth/Sidebar.tsx
'use client';

import { DASHBOARD_LINKS } from '@/constants/dashboard-links';
import {
  CreditCard,
  LayoutDashboard,
  Menu,
  Settings,
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
      className={`flex flex-col border-r border-gray-200 shadow-sm transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center px-4 py-4 border-b border-gray-200 ${
          sidebarOpen ? 'justify-between' : 'justify-center'
        }`}
      >
        <div
          onClick={() => !sidebarOpen && setSidebarOpen(true)}
          className={`flex items-center cursor-pointer select-none ${
            sidebarOpen ? 'gap-2' : ''
          }`}
        >
          <div className='bg-indigo-500 text-white font-bold rounded-full h-8 w-8 grid place-items-center'>
            G
          </div>
          {sidebarOpen && (
            <span className='font-semibold text-sm'>GOODFOOD</span>
          )}
        </div>

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
            href={DASHBOARD_LINKS.DASHBOARD.path}
            icon={<LayoutDashboard size={18} />}
            label={DASHBOARD_LINKS.DASHBOARD.label}
            open={sidebarOpen}
          />
        </ul>

        <SectionDashboard title='OTHERS' open={sidebarOpen} />
        <ul className='space-y-1'>
          <NavItem
            href={DASHBOARD_LINKS.SETTINGS.path}
            icon={<Settings size={18} />}
            label={DASHBOARD_LINKS.SETTINGS.label}
            open={sidebarOpen}
          />
          <NavItem
            href={DASHBOARD_LINKS.PROFILE.path}
            icon={<User size={18} />}
            label={DASHBOARD_LINKS.PROFILE.label}
            open={sidebarOpen}
          />
          <NavItem
            href={DASHBOARD_LINKS.BILLING.path}
            icon={<CreditCard size={18} />}
            label={DASHBOARD_LINKS.BILLING.label}
            open={sidebarOpen}
          />
        </ul>
      </nav>
    </aside>
  );
}
