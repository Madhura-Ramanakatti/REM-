import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuthStore } from '../../store/authStore';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="pt-16 flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="hidden md:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <Sidebar />
      </div>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
