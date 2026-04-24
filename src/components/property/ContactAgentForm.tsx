import { useState } from 'react';
import { Send, User, Mail, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

export function ContactAgentForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent to agent! They will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <User className="h-3.5 w-3.5" /> Name
        </label>
        <Input
          required
          placeholder="Your Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="dark:bg-slate-900"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Mail className="h-3.5 w-3.5" /> Email
        </label>
        <Input
          required
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="dark:bg-slate-900"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5" /> Message
        </label>
        <textarea
          required
          rows={4}
          placeholder="I'm interested in this property..."
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
        />
      </div>

      <Button type="submit" className="w-full">
        <Send className="h-4 w-4" />
        Send Message
      </Button>
    </form>
  );
}
