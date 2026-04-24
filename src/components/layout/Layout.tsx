import { type ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from '../../store/themeStore';
import { useEffect } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isDark } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      <Navbar />
      <main className="pt-16">{children}</main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#f1f5f9' : '#0f172a',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          },
        }}
      />
    </div>
  );
}
