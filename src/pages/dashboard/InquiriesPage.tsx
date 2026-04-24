import { useState } from 'react';
import { MessageSquare, Clock, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';
import { useInquiryStore } from '../../store/inquiryStore';
import { useAuthStore } from '../../store/authStore';
import { usePropertyStore } from '../../store/propertyStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import type { Inquiry } from '../../types';

export function InquiriesPage() {
  const { user } = useAuthStore();
  const { inquiries, updateStatus } = useInquiryStore();
  const { properties } = usePropertyStore();
  const [statusFilter, setStatusFilter] = useState('');

  const myInquiries = user?.role === 'customer'
    ? inquiries.filter(i => i.userId === user.id)
    : user?.role === 'agent'
      ? inquiries.filter(i => properties.filter(p => p.agentId === user.id).some(p => p.id === i.propertyId))
      : inquiries;

  const filtered = myInquiries.filter(i => !statusFilter || i.status === statusFilter);

  const handleStatus = (id: string, status: Inquiry['status']) => {
    updateStatus(id, status);
    toast.success(`Inquiry marked as ${status}`);
  };

  const statusIcon = { pending: Clock, responded: CheckCircle, closed: XCircle };
  const statusVariant: Record<string, 'amber' | 'green' | 'slate'> = {
    pending: 'amber',
    responded: 'green',
    closed: 'slate',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {user?.role === 'customer' ? 'My Inquiries' : 'Inquiries'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} {statusFilter || 'total'}</p>
        </div>
        <div className="flex gap-2">
          {(['', 'pending', 'responded', 'closed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">No inquiries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inquiry => {
            const StatusIcon = statusIcon[inquiry.status];
            return (
              <div key={inquiry.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm shrink-0">
                      {inquiry.userName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{inquiry.userName}</p>
                        <Badge variant={statusVariant[inquiry.status]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {inquiry.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{inquiry.userEmail} · {inquiry.userPhone}</p>
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 truncate">
                        Re: {inquiry.propertyTitle}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{inquiry.message}</p>
                      <p className="text-xs text-slate-400 mt-2">{formatDate(inquiry.createdAt)}</p>
                    </div>
                  </div>
                  {user?.role !== 'customer' && (
                    <div className="flex gap-2 shrink-0">
                      {inquiry.status === 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatus(inquiry.id, 'responded')}>
                          Mark Responded
                        </Button>
                      )}
                      {inquiry.status !== 'closed' && (
                        <Button size="sm" variant="ghost" onClick={() => handleStatus(inquiry.id, 'closed')}>
                          Close
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
