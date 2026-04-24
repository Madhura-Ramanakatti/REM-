import { useState, useEffect } from 'react';
import { Search, UserCheck, Mail, Phone, Loader2 } from 'lucide-react';
import { userService } from '../../services/api';
import { Badge } from '../../components/ui/Badge';
import { formatDate, capitalize } from '../../utils/formatters';
import type { User as UserType } from '../../types';

export function ManageUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    userService.getAll().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const nameMatch = u.name?.toLowerCase().includes(q) || false;
    const emailMatch = u.email?.toLowerCase().includes(q) || false;
    const matchSearch = nameMatch || emailMatch;
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleVariant: Record<string, 'blue' | 'green' | 'teal'> = {
    admin: 'blue',
    agent: 'teal',
    user: 'green',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Manage Users</h1>
          <p className="text-slate-500 text-sm mt-1">{users.length} total users</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="py-2.5 px-4 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{u.name}</p>
                        <p className="text-xs text-slate-400">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail className="h-3 w-3" /> {u.email}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone className="h-3 w-3" /> {u.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={roleVariant[u.role]}>
                      <UserCheck className="h-3 w-3 mr-1" />
                      {capitalize(u.role)}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-slate-500">{formatDate(u.joinedAt)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
