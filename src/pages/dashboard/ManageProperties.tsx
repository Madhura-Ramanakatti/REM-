import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, MapPin, Bed, Bath } from 'lucide-react';
import { usePropertyStore } from '../../store/propertyStore';
import { useAuthStore } from '../../store/authStore';
import { propertyService } from '../../services/api';
import { formatPrice, capitalize } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import toast from 'react-hot-toast';
import type { Property } from '../../types';

type FormData = {
  title: string;
  description: string;
  price: string;
  type: 'sale' | 'rent';
  category: Property['category'];
  location: string;
  city: string;
  state: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  yearBuilt: string;
  images: string;
  features: string;
  status: Property['status'];
  isFeatured: boolean;
};

const emptyForm: FormData = {
  title: '', description: '', price: '', type: 'sale', category: 'house',
  location: '', city: 'Bangalore', state: 'Karnataka', bedrooms: '3', bathrooms: '2',
  area: '', yearBuilt: '2024', images: '', features: '',
  status: 'active', isFeatured: false,
};

export function ManageProperties() {
  const { user } = useAuthStore();
  const { properties, addProperty, updateProperty, deleteProperty } = usePropertyStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const myProperties = user?.role === 'admin' ? properties : properties.filter(p => p.agentId === user?.id);
  const filtered = myProperties.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowModal(true); };
  const openEdit = (p: Property) => {
    setForm({
      title: p.title, description: p.description, price: String(p.price),
      type: p.type, category: p.category, location: p.location,
      city: p.city, state: p.state, bedrooms: String(p.bedrooms),
      bathrooms: String(p.bathrooms), area: String(p.area),
      yearBuilt: String(p.yearBuilt), images: p.images.join('\n'), features: p.features.join(', '),
      status: p.status, isFeatured: p.isFeatured,
    });
    setEditingId(p.id);
    setShowModal(true);
  };

  const refreshProperties = async () => {
    setFetching(true);
    try {
      const data = await propertyService.getAll();
      usePropertyStore.getState().setProperties(data);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data: any = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      type: form.type,
      category: form.category,
      location: form.location,
      city: form.city,
      state: form.state,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      yearBuilt: Number(form.yearBuilt),
      images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
      features: form.features.split(',').map(s => s.trim()).filter(Boolean),
      agentId: user?.id || '',
      isFeatured: form.isFeatured,
      status: form.status,
    };
    try {
      if (editingId) {
        await propertyService.update(editingId, data);
        toast.success('Property updated');
      } else {
        await propertyService.create(data);
        toast.success('Property added');
      }
      setShowModal(false);
      refreshProperties();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await propertyService.delete(id);
      setDeleteConfirm(null);
      toast.success('Property deleted');
      refreshProperties();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const typeOpts = [{ value: 'sale', label: 'For Sale' }, { value: 'rent', label: 'For Rent' }];
  const catOpts = ['house', 'apartment', 'condo', 'villa', 'townhouse', 'studio'].map(v => ({ value: v, label: capitalize(v) }));
  const statusOpts = [
    { value: 'active', label: 'Active' },
    { value: 'sold', label: 'Sold' },
    { value: 'rented', label: 'Rented' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {user?.role === 'admin' ? 'All Properties' : 'My Properties'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} properties</p>
        </div>
        {(user?.role === 'agent' || user?.role === 'admin') && (
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Property
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title or city (e.g. Bengaluru)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-slate-400 mb-4">No properties found</p>
          <Button onClick={openAdd}><Plus className="h-4 w-4" /> Add your first property</Button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Property</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Details</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Price</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="h-12 w-16 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 dark:text-slate-100 text-sm truncate max-w-xs">{p.title}</p>
                          <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                            <MapPin className="h-3 w-3" /> {p.city}, {p.state}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="flex gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {p.bedrooms}</span>
                        <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {p.bathrooms}</span>
                      </div>
                      <Badge variant="slate" className="mt-1">{capitalize(p.category)}</Badge>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-sm">{formatPrice(p.price, p.type)}</span>
                      <p className="text-xs text-slate-400 mt-0.5 capitalize">{p.type}</p>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={p.status === 'active' ? 'green' : p.status === 'sold' ? 'blue' : 'slate'}>
                        {capitalize(p.status)}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Property' : 'Add New Property'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Input label="Title *" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" options={typeOpts} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as 'sale' | 'rent' }))} />
            <Select label="Category" options={catOpts} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Property['category'] }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Status" options={statusOpts} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Property['status'] }))} />
            {user?.role === 'admin' && (
              <div className="flex items-center gap-2 pt-8">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={form.isFeatured}
                  onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700 dark:text-slate-300">Featured Property</label>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (₹) *" type="number" required value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            <Input label="Area (sq ft) *" type="number" required value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Bedrooms" type="number" value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value }))} />
            <Input label="Bathrooms" type="number" value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: e.target.value }))} />
            <Input label="Year Built" type="number" value={form.yearBuilt} onChange={e => setForm(f => ({ ...f, yearBuilt: e.target.value }))} />
          </div>
          <Input label="Address" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="City *" required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
            <Input label="State" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Image URLs (one per line)</label>
            <textarea rows={2} placeholder="https://..." value={form.images} onChange={e => setForm(f => ({ ...f, images: e.target.value }))} className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <Input label="Features (comma-separated)" placeholder="Pool, Garage, Garden..." value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" className="flex-1">{editingId ? 'Update' : 'Add Property'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Property" size="sm">
        <p className="text-slate-600 dark:text-slate-400 mb-6">Are you sure you want to delete this property? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
