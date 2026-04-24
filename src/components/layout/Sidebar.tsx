import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, MessageSquare, Heart, CirclePlus as PlusCircle, Settings, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import clsx from 'clsx';

const adminLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/properties', label: 'All Properties', icon: Building2 },
  { to: '/dashboard/users', label: 'Manage Users', icon: Users },
  { to: '/dashboard/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const agentLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/my-properties', label: 'My Properties', icon: Building2 },
  { to: '/dashboard/add-property', label: 'Add Property', icon: PlusCircle },
  { to: '/dashboard/inquiries', label: 'Inquiries', icon: MessageSquare },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const customerLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/saved', label: 'Saved Properties', icon: Heart },
  { to: '/dashboard/my-inquiries', label: 'My Inquiries', icon: MessageSquare },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { user } = useAuthStore();

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'agent' ? agentLinks : customerLinks;

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-600"
          />
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
              isActive
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
            )}
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('h-4.5 w-4.5 shrink-0', isActive ? 'text-blue-600 dark:text-blue-400' : '')} style={{ width: '1.125rem', height: '1.125rem' }} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
