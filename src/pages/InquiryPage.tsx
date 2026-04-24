import { useState } from 'react';
import { MessageSquare, CircleCheck as CheckCircle, Search, MapPin } from 'lucide-react';
import { usePropertyStore } from '../store/propertyStore';
import { useInquiryStore } from '../store/inquiryStore';
import { useAuthStore } from '../store/authStore';
import { inquiryService } from '../services/api';
import { formatPrice } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { Property } from '../types';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export function InquiryPage() {
  const { properties } = usePropertyStore();
  const { addInquiry } = useInquiryStore();
  const { user } = useAuthStore();

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [propertySearch, setPropertySearch] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filteredProps = properties.filter(p => {
    const q = propertySearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
  }).slice(0, 6);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) { toast.error('Please select a property'); return; }
    if (!form.message.trim()) { toast.error('Please enter a message'); return; }
    setSubmitting(true);
    const inquiry = await inquiryService.create({
      propertyId: selectedProperty.id,
      propertyTitle: selectedProperty.title,
      userId: user?.id || 'guest',
      userName: form.name,
      userEmail: form.email,
      userPhone: form.phone,
      message: form.message,
    });
    addInquiry(inquiry);
    setSubmitting(false);
    setSent(true);
    toast.success('Inquiry submitted!');
  };

  if (sent) {
    return (
      <div className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-10 text-center max-w-md">
          <div className="h-20 w-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Inquiry Submitted!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Your inquiry about <strong className="text-slate-700 dark:text-slate-200">{selectedProperty?.title}</strong> has been sent. The agent will be in touch with you shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => { setSent(false); setSelectedProperty(null); setForm(f => ({ ...f, message: '' })); }}>
              Send Another
            </Button>
            <Link to="/properties">
              <Button variant="outline">Browse Properties</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Send an Inquiry</h1>
              <p className="text-slate-500 text-sm">Contact an agent about a property</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Property */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">1. Select Property</h2>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or city..."
                value={propertySearch}
                onChange={e => setPropertySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProps.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProperty(p)}
                  className={`text-left rounded-xl border-2 p-3 transition-all hover:border-blue-400 ${
                    selectedProperty?.id === p.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <img src={p.images[0]} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-1">{p.title}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin className="h-3 w-3" /> {p.city}
                  </p>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">{formatPrice(p.price, p.type)}</p>
                </button>
              ))}
            </div>
            {selectedProperty && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-800 text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Selected: <strong>{selectedProperty.title}</strong>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">2. Your Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name *" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              <Input label="Email *" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              <Input label="Phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="sm:col-span-2" />
            </div>
          </div>

          {/* Message */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">3. Your Message</h2>
            <textarea
              required
              rows={5}
              placeholder="I'm interested in this property. Could we schedule a viewing? Please let me know your availability."
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" loading={submitting} disabled={!selectedProperty}>
            <MessageSquare className="h-5 w-5" />
            Submit Inquiry
          </Button>
        </form>
      </div>
    </div>
  );
}
