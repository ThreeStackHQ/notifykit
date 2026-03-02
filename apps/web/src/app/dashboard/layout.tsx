import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const email = session.user.email ?? '';

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Sidebar */}
      <DashboardSidebar email={email} />

      {/* Main content — offset by sidebar width on desktop */}
      <div className="lg:pl-56 flex flex-col min-h-screen">
        {/* Mobile top bar spacer */}
        <div className="lg:hidden h-14" />

        {/* Top header with breadcrumb + avatar */}
        <DashboardHeader email={email} />

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
