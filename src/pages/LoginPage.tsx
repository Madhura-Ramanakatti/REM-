import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Building2, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<'login' | 'signup'>(searchParams.get('tab') === 'signup' ? 'signup' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, signUp, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(loginForm.email, loginForm.password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!signupForm.name.trim()) errs.name = 'Name is required';
    if (!signupForm.email.includes('@')) errs.email = 'Valid email required';
    if (signupForm.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (signupForm.password !== signupForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await signUp(signupForm.email, signupForm.password, signupForm.name);
      toast.success('Account created! Please verify your email.');
      setTab('login');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const mockCredentials = [
    { role: 'Admin', email: 'admin@realestate.com', password: 'admin123' },
    { role: 'Agent', email: 'agent@realestate.com', password: 'agent123' },
    { role: 'Customer', email: 'customer@realestate.com', password: 'customer123' },
  ];

  const fillCreds = (email: string, password: string) => {
    setLoginForm({ email, password });
    setTab('login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="relative text-white max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10 group">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl">EstateHub</span>
          </Link>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            The Premier Real Estate Platform
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed mb-8">
            Access thousands of listings, connect with expert agents, and find your dream property today.
          </p>
          <div className="space-y-3">
            {['4,500+ verified listings', '120+ expert agents', '₹1,500 Cr+ in transactions'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-2 w-2 bg-blue-300 rounded-full" />
                <span className="text-blue-100 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 bg-white/10 rounded-2xl border border-white/10">
            <p className="text-sm text-blue-200 mb-3 font-medium">Quick Login (Demo)</p>
            <div className="space-y-2">
              {mockCredentials.map(({ role, email, password }) => (
                <button
                  key={role}
                  onClick={() => fillCreds(email, password)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white transition-colors"
                >
                  <span className="font-medium">{role}</span>
                  <span className="text-blue-200 text-xs">{email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-slate-100">EstateHub</span>
          </Link>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex mb-6 bg-slate-100 dark:bg-slate-700 rounded-xl p-1">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'login' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                Log In
              </button>
              <button
                onClick={() => setTab('signup')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === 'signup' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                Sign Up
              </button>
            </div>

            {tab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Welcome back</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to your account</p>
                </div>
                <Input
                  label="Email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                />
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  iconRight={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                />
                <Button type="submit" className="w-full" size="lg" loading={loading}>
                  Sign In
                </Button>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setTab('signup')} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Sign up
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">Create account</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Get started with EstateHub</p>
                </div>
                <Input
                  label="Full Name"
                  required
                  placeholder="John Doe"
                  icon={<User className="h-4 w-4" />}
                  error={errors.name}
                  value={signupForm.name}
                  onChange={e => setSignupForm(f => ({ ...f, name: e.target.value }))}
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  error={errors.email}
                  value={signupForm.email}
                  onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
                />
                <Input
                  label="Phone (optional)"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  icon={<Phone className="h-4 w-4" />}
                  value={signupForm.phone}
                  onChange={e => setSignupForm(f => ({ ...f, phone: e.target.value }))}
                />
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 6 characters"
                  icon={<Lock className="h-4 w-4" />}
                  iconRight={
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  error={errors.password}
                  value={signupForm.password}
                  onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  required
                  placeholder="Repeat password"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.confirmPassword}
                  value={signupForm.confirmPassword}
                  onChange={e => setSignupForm(f => ({ ...f, confirmPassword: e.target.value }))}
                />
                <Button type="submit" className="w-full" size="lg" loading={loading}>
                  Create Account
                </Button>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setTab('login')} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Log in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
