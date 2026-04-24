import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavoritesStore } from '../store/favoritesStore';
import { usePropertyStore } from '../store/propertyStore';
import { PropertyCard } from '../components/property/PropertyCard';
import { Button } from '../components/ui/Button';
import type { Property } from '../types';

export function FavoritesPage() {
  const { favoriteIds } = useFavoritesStore();
  const { properties } = usePropertyStore();
  const [favorites, setFavorites] = useState<Property[]>([]);

  useEffect(() => {
    setFavorites(properties.filter(p => favoriteIds.includes(p.id)));
  }, [favoriteIds, properties]);

  return (
    <div className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-red-50 dark:bg-red-950 rounded-xl flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-500 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Saved Properties</h1>
              <p className="text-slate-500 text-sm">{favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-5">
              <Heart className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No saved properties yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
              Browse listings and click the heart icon to save properties you love.
            </p>
            <Link to="/properties">
              <Button size="lg">Browse Properties</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favorites.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
