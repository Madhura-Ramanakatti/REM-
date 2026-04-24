import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, TrendingUp, Shield, Clock, Star, ArrowRight, Building2, Hop as Home, IndianRupee } from 'lucide-react';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyCardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Testimonials } from '../components/property/Testimonials';
import { FeaturedAgents } from '../components/property/FeaturedAgents';
import { propertyService } from '../services/api';
import { CITIES } from '../data/mockData';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../utils/translations';
import type { Property } from '../types';
import toast from 'react-hot-toast';

export function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [propType, setPropType] = useState('');
  const { language } = useLanguageStore();
  const t = translations[language];
  const navigate = useNavigate();

  useEffect(() => {
    propertyService.getFeatured().then(data => {
      setFeaturedProperties(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (city) params.set('city', city);
    if (propType) params.set('type', propType);
    navigate(`/properties?${params.toString()}`);
  };

  const stats = [
    { icon: Building2, label: t.stats.listed, value: '4,500+' },
    { icon: Home, label: t.stats.sold, value: '3,200+' },
    { icon: IndianRupee, label: t.stats.value, value: '₹1,500 Cr+' },
    { icon: Star, label: t.stats.clients, value: '8,000+' },
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Market Insights',
      desc: 'Real-time market data and trends to help you make informed decisions.',
    },
    {
      icon: Shield,
      title: 'Verified Listings',
      desc: 'Every property is thoroughly verified by our expert team.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      desc: 'Our dedicated agents are available around the clock for you.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Hero background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium mb-6">
              <Star className="h-3.5 w-3.5" />
              {t.hero.tag}
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              {t.hero.title}
              <span className="block text-blue-400">{t.hero.titleAccent}</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-xl">
              {t.hero.subtitle}
            </p>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-700 max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.hero.searchPlaceholder}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-9 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="py-3 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any City</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={propType}
                  onChange={e => setPropType(e.target.value)}
                  className="py-3 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Buy or Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
                <Button size="lg" onClick={handleSearch} className="shrink-0">
                  <Search className="h-4 w-4" />
                  {t.hero.searchBtn}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {CITIES.map(c => (
                <button
                  key={c}
                  onClick={() => navigate(`/properties?city=${c}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm rounded-full transition-colors"
                >
                  <MapPin className="h-3 w-3" />
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-blue-600 dark:bg-blue-700 py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, label, value }) => (
              <motion.div 
                key={label}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-center text-white"
              >
                <Icon className="h-7 w-7 mx-auto mb-3 text-blue-200" />
                <p className="text-3xl font-bold mb-1">{value}</p>
                <p className="text-blue-200 text-sm">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Properties */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-white dark:bg-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-wide">Hand-Picked</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mt-1">Featured Properties</h2>
            </div>
            <Button variant="outline" onClick={() => navigate('/properties')} className="hidden sm:flex">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeleton key={i} />)
              : featuredProperties.slice(0, 3).map(p => <PropertyCard key={p.id} property={p} />)
            }
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Button variant="outline" onClick={() => navigate('/properties')}>
              View All Properties <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.section>

      <FeaturedAgents />

      {/* Features */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-wide">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mt-2">The EstateHub Advantage</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
              We bring together cutting-edge technology and expert knowledge to deliver an unmatched real estate experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow group">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 text-center text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Find Your Perfect Home?</h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of satisfied clients who found their dream property through EstateHub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 font-semibold"
                  onClick={() => navigate('/properties')}
                >
                  Browse Properties
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/login?tab=signup')}
                >
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white text-xl tracking-tight">EstateHub</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Karnataka's most trusted real estate platform. We find you homes that resonate with your spirit.
              </p>
              <div className="flex items-center gap-4 text-white">
                {/* Social placeholders */}
                <button className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Star className="h-4 w-4" />
                </button>
                <button className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Star className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/properties" className="hover:text-blue-400 transition-colors">Find a Home</Link></li>
                <li><Link to="/properties?type=sale" className="hover:text-blue-400 transition-colors">Buy Property</Link></li>
                <li><Link to="/properties?type=rent" className="hover:text-blue-400 transition-colors">Rent Property</Link></li>
                <li><Link to="/dashboard" className="hover:text-blue-400 transition-colors">List Your Property</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => toast('Help Center coming soon!')} className="hover:text-blue-400 transition-colors">Help Center</button></li>
                <li><button onClick={() => toast('FAQ section coming soon!')} className="hover:text-blue-400 transition-colors">FAQs</button></li>
                <li><button onClick={() => toast('Our support team: support@estatehub.in')} className="hover:text-blue-400 transition-colors">Contact Support</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Newsletter</h4>
              <p className="text-xs mb-4">Get the latest market updates and property news directly in your inbox.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600 flex-1" 
                />
                <Button size="sm">Join</Button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>© 2024 EstateHub Real Estate System. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="hover:text-white">Privacy Policy</button>
              <button className="hover:text-white">Terms of Service</button>
              <button className="hover:text-white">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
