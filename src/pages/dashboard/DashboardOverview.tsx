import { Building2, Users, MessageSquare, Heart, TrendingUp, Eye } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { usePropertyStore } from '../../store/propertyStore';
import { useInquiryStore } from '../../store/inquiryStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import { formatPrice } from '../../utils/formatters';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';
import { MOCK_USERS } from '../../data/mockData';

export function DashboardOverview() {
  const { user } = useAuthStore();
  const { properties } = usePropertyStore();
  const { inquiries } = useInquiryStore();
  const { favoriteIds } = useFavoritesStore();

  const myProperties = user?.role === 'agent'
    ? properties.filter(p => p.agentId === user.id)
    : properties;

  const myInquiries = user?.role === 'customer'
    ? inquiries.filter(i => i.userId === user?.id)
    : user?.role === 'agent'
      ? inquiries.filter(i => myProperties.some(p => p.id === i.propertyId))
      : inquiries;

  const stats = user?.role === 'admin'
    ? [
        { icon: Building2, label: 'Total Properties', value: properties.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
        { icon: Users, label: 'Total Users', value: MOCK_USERS.length, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
        { icon: MessageSquare, label: 'Inquiries', value: inquiries.length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' },
        { icon: TrendingUp, label: 'Active Listings', value: properties.filter(p => p.status === 'active').length, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950' },
      ]
    : user?.role === 'agent'
      ? [
          { icon: Building2, label: 'My Listings', value: myProperties.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
          { icon: MessageSquare, label: 'Inquiries', value: myInquiries.length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' },
          { icon: Eye, label: 'Active', value: myProperties.filter(p => p.status === 'active').length, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
          { icon: TrendingUp, label: 'Pending Inquiries', value: myInquiries.filter(i => i.status === 'pending').length, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950' },
        ]
      : [
          { icon: Heart, label: 'Saved Properties', value: favoriteIds.length, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950' },
          { icon: MessageSquare, label: 'My Inquiries', value: myInquiries.length, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
          { icon: Eye, label: 'Pending', value: myInquiries.filter(i => i.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' },
          { icon: TrendingUp, label: 'Responded', value: myInquiries.filter(i => i.status === 'responded').length, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
        ];

  const recentProperties = myProperties.slice(0, 5);
  const recentInquiries = myInquiries.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Welcome back, {user?.name.split(' ')[0]}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here's what's happening with your {user?.role === 'customer' ? 'searches' : 'listings'}.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
            <div className={`h-11 w-11 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              {user?.role === 'customer' ? 'Recent Properties' : 'My Listings'}
            </h2>
            <Link to="/properties" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
          </div>
          {recentProperties.length === 0 ? (
            <p className="text-slate-400 text-sm py-4 text-center">No properties yet</p>
          ) : (
            <div className="space-y-3">
              {recentProperties.map(p => (
                <Link key={p.id} to={`/properties/${p.id}`} className="flex items-center gap-3 group">
                  <img src={p.images[0]} alt="" className="h-12 w-16 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.title}</p>
                    <p className="text-xs text-slate-500">{p.city}, {p.state}</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 shrink-0">{formatPrice(p.price, p.type)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Recent Inquiries</h2>
            <Link to="/dashboard/inquiries" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="text-slate-400 text-sm py-4 text-center">No inquiries yet</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map(inquiry => (
                <div key={inquiry.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                    {inquiry.userName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{inquiry.propertyTitle}</p>
                    <p className="text-xs text-slate-500 truncate">{inquiry.message}</p>
                  </div>
                  <Badge variant={inquiry.status === 'pending' ? 'amber' : inquiry.status === 'responded' ? 'green' : 'slate'}>
                    {inquiry.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Market Insight Section */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/10">
              <TrendingUp className="h-3 w-3" /> Market Context
            </div>
            <h2 className="text-2xl font-bold mb-3">Karnataka Real Estate is Growing</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Property values in Bangalore and Mysore have seen a 12% increase this quarter. 
              Luxury villas in Hebbal and Whitefield remain the most searched categories.
            </p>
          </div>
          <div className="flex items-end gap-2 h-32">
            {[40, 65, 45, 90, 75, 55, 80].map((h, i) => (
              <div 
                key={i} 
                className="w-4 bg-white/20 rounded-t-sm transition-all hover:bg-blue-400 group relative"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-white text-slate-900 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
