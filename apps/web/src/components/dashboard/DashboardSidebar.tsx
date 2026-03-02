'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Bell,
  Key,
  Settings,
  SlidersHorizontal,
  CreditCard,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'API Keys', href: '/dashboard/keys', icon: Key },
  { label: 'Preferences', href: '/dashboard/preferences', icon: SlidersHorizontal },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Billing', href: '/dashboard/billing', icon: CreditCard },
];

interface DashboardSidebarProps {
  email: string;
}

export function DashboardSidebar({ email }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const avatarInitial = email.charAt(0).toUpperCase();

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-teal-600/20 text-teal-400 border border-teal-600/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const UserMenu = () => (
    <div className="px-3 py-4 border-t border-gray-800">
      <div className="flex items-center gap-3 px-3 py-2 mb-1">
        <div className="w-7 h-7 bg-teal-700 rounded-full flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-white">{avatarInitial}</span>
        </div>
        <span className="text-xs text-gray-300 truncate flex-1">{email}</span>
      </div>
      <button
        onClick={() => void signOut({ callbackUrl: '/login' })}
        className="flex items-center gap-3 px-3 py-2 w-full text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg text-sm transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#0a0f14] border-r border-gray-800 min-h-screen fixed top-0 left-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">NotifyKit</span>
        </div>

        <NavLinks />
        <UserMenu />
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0f14] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center">
            <Bell className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white">NotifyKit</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Slide-over Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-[#0a0f14] border-r border-gray-800 h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-white">NotifyKit</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setMobileOpen(false)} />
            <UserMenu />
          </aside>
        </div>
      )}
    </>
  );
}
