'use client';

import { usePathname } from 'next/navigation';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/keys': 'API Keys',
  '/dashboard/preferences': 'Preferences',
  '/dashboard/settings': 'Settings',
  '/dashboard/billing': 'Billing',
};

interface DashboardHeaderProps {
  email: string;
}

export function DashboardHeader({ email }: DashboardHeaderProps) {
  const pathname = usePathname();

  const pageName =
    Object.entries(breadcrumbMap).find(([key]) => pathname === key || pathname.startsWith(key + '/'))?.[1] ?? 'Dashboard';

  const avatarInitial = email.charAt(0).toUpperCase();

  return (
    <header className="bg-[#0f1117] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-500">Dashboard</span>
        {pageName !== 'Dashboard' && (
          <>
            <span className="text-gray-600">/</span>
            <span className="text-white font-medium">{pageName}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 hidden sm:block">{email}</span>
        <div className="w-8 h-8 bg-teal-700 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">{avatarInitial}</span>
        </div>
      </div>
    </header>
  );
}
