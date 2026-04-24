import { useState } from 'react';
import { Calendar, Clock, Send, User, Phone, Mail } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

interface ScheduleVisitFormProps {
  propertyTitle: string;
}

export function ScheduleVisitForm({ propertyTitle }: ScheduleVisitFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    note: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    toast.success(`Successfully scheduled visit for ${propertyTitle}!`);
    setFormData({ name: '', email: '', phone: '', date: '', time: '', note: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50 mb-6">
        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">Scheduling for</p>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{propertyTitle}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <User className="h-3.5 w-3.5" /> Full Name
          </label>
          <Input
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="dark:bg-slate-900"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" /> Phone Number
          </label>
          <Input
            required
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="dark:bg-slate-900"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Mail className="h-3.5 w-3.5" /> Email Address
        </label>
        <Input
          required
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="dark:bg-slate-900"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" /> Preferred Date
          </label>
          <Input
            required
            type="date"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
            className="dark:bg-slate-900"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" /> Preferred Time
          </label>
          <Input
            required
            type="time"
            value={formData.time}
            onChange={e => setFormData({ ...formData, time: e.target.value })}
            className="dark:bg-slate-900"
          />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Special Notes
        </label>
        <textarea
          rows={2}
          placeholder="I would like to see the terrace..."
          value={formData.note}
          onChange={e => setFormData({ ...formData, note: e.target.value })}
          className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-2"
        />
      </div>

      <Button type="submit" className="w-full h-11">
        <Send className="h-4 w-4" />
        Schedule Visit
      </Button>
      <p className="text-[10px] text-center text-slate-500 mt-2">
        By continuing, you agree to our terms and conditions.
      </p>
    </form>
  );
}
