import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Moon, Sun, Hop as Home, Building2, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useComparisonStore } from '../../store/comparisonStore';
import { useThemeStore } from '../../store/themeStore';
import { useLanguageStore } from '../../store/languageStore';
import { translations } from '../../utils/translations';
import { Button } from '../ui/Button';
import clsx from 'clsx';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { favoriteIds } = useFavoritesStore();
  const { propertyIds: compareIds } = useComparisonStore();
  const { isDark, toggle: toggleTheme } = useThemeStore();
  const { language, toggleLanguage } = useLanguageStore();
  const t = translations[language];
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { to: '/', label: t.nav.home, icon: Home },
    { to: '/properties', label: t.nav.properties, icon: Building2 },
  ];

  return (
    <header className={clsx(
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      scrolled || !isHome
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-700'
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className={clsx(
              'font-bold text-lg transition-colors',
              scrolled || !isHome ? 'text-slate-900 dark:text-white' : 'text-white'
            )}>
              EstateHub
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === to
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950'
                    : scrolled || !isHome
                      ? 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                scrolled || !isHome
                  ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              )}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button
              onClick={toggleLanguage}
              className={clsx(
                'px-2 py-1 rounded-lg text-xs font-bold border transition-colors',
                scrolled || !isHome
                  ? 'text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white'
                  : 'text-white border-white hover:bg-white hover:text-blue-600'
              )}
            >
              {language === 'en' ? 'ಕನ್ನಡ' : 'EN'}
            </button>

            <Link
              to="/favorites"
              className={clsx(
                'relative p-2 rounded-lg transition-colors',
                scrolled || !isHome
                  ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              )}
              title={t.nav.favorites}
            >
              <Heart className="h-5 w-5" />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {favoriteIds.length}
                </span>
              )}
            </Link>

            <Link
              to="/compare"
              className={clsx(
                'relative p-2 rounded-lg transition-colors',
                scrolled || !isHome
                  ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              )}
              title="Compare Properties"
            >
              <div className="flex items-center justify-center">
                <Building2 className="h-5 w-5" />
                <span className={clsx(
                  "absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-slate-900 transition-transform",
                  compareIds.length === 0 ? "scale-0" : "scale-100"
                )}>
                  {compareIds.length}
                </span>
              </div>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <img src={user?.avatar} alt={user?.name} className="h-7 w-7 rounded-full object-cover ring-2 ring-blue-600" />
                  <span className={clsx(
                    'text-sm font-medium hidden lg:block',
                    scrolled || !isHome ? 'text-slate-700 dark:text-slate-300' : 'text-white/90'
                  )}>
                    {user?.name.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={clsx(
                    'p-2 rounded-lg transition-colors',
                    scrolled || !isHome
                      ? 'text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                  title={t.nav.logout}
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className={clsx(
                    !scrolled && isHome ? 'text-white hover:bg-white/10' : ''
                  )}>
                    {t.nav.login}
                  </Button>
                </Link>
                <Link to="/login?tab=signup">
                  <Button size="sm">{t.nav.signup}</Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className={clsx(
              'md:hidden p-2 rounded-lg transition-colors',
              scrolled || !isHome
                ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-white hover:bg-white/10'
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <Link to="/favorites" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Heart className="h-4 w-4" />
              Favorites {favoriteIds.length > 0 && <span className="ml-auto text-xs bg-red-100 text-red-600 px-1.5 rounded-full">{favoriteIds.length}</span>}
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">Dark Mode</span>
                <button onClick={toggleTheme} className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {isAuthenticated ? (
              <div className="flex items-center gap-3 px-3 py-2.5">
                <img src={user?.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                </div>
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">Log in</Button>
                </Link>
                <Link to="/login?tab=signup" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button size="sm" className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
