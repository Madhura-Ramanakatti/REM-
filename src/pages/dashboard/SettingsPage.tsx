import { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    updateUser(form);
    setSaving(false);
    toast.success('Profile updated');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-5">Profile Information</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img src={user?.avatar} alt="" className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-600" />
            <button className="absolute bottom-0 right-0 h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 hover:bg-blue-700 transition-colors">
              <Camera className="h-3 w-3 text-white" />
            </button>
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">{user?.name}</p>
            <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Full Name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Email" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input label="Phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Account Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Role</span>
            <p className="font-medium text-slate-900 dark:text-slate-100 capitalize mt-0.5">{user?.role}</p>
          </div>
          <div>
            <span className="text-slate-500">Member since</span>
            <p className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">{user?.joinedAt}</p>
          </div>
          <div>
            <span className="text-slate-500">User ID</span>
            <p className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">{user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
