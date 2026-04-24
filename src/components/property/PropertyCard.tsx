import { Heart, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useComparisonStore } from '../../store/comparisonStore';
import { formatPrice, capitalize } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import type { Property } from '../../types';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export function PropertyCard({ property, compact }: PropertyCardProps) {
  const { toggle, isFavorite } = useFavoritesStore();
  const { propertyIds: compareIds, addToCompare, removeFromCompare } = useComparisonStore();
  const favorite = isFavorite(property.id);
  const isComparing = compareIds.includes(property.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden',
        'border border-slate-200 dark:border-slate-800',
        'shadow-sm hover:shadow-2xl transition-all duration-300'
      )}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <Link to={`/properties/${property.id}`}>
          <img
            src={property.images[0]}
            alt={property.title}
            className={clsx(
              'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
            )}
          />
        </Link>
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Badge variant={property.type === 'sale' ? 'blue' : 'green'} className="backdrop-blur-md bg-white/90 dark:bg-slate-900/90 shadow-lg">
            For {capitalize(property.type)}
          </Badge>
          {property.isFeatured && <Badge variant="amber" className="backdrop-blur-md bg-white/90 dark:bg-slate-900/90 shadow-lg">Featured</Badge>}
          <button
            onClick={(e) => {
              e.preventDefault();
              isComparing ? removeFromCompare(property.id) : addToCompare(property.id);
            }}
            className={clsx(
              'px-3 py-1.5 rounded-xl backdrop-blur-md transition-all duration-300 text-[10px] font-bold uppercase tracking-wider',
              isComparing
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white shadow-md'
            )}
          >
            {isComparing ? 'Comparing' : 'Compare'}
          </button>
        </div>
        <button
          onClick={() => toggle(property.id)}
          className={clsx(
            'absolute top-4 right-4 p-2.5 rounded-2xl backdrop-blur-md transition-all duration-300',
            favorite
              ? 'bg-red-500 text-white shadow-lg scale-110'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:bg-red-500 hover:text-white shadow-md'
          )}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={clsx('h-5 w-5', favorite && 'fill-current')} />
        </button>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-3 flex justify-between items-center shadow-lg border border-white/20 dark:border-white/5">
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(property.price, property.type)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
              {property.category}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Link to={`/properties/${property.id}`} className="group/title">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg leading-tight mb-2 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors line-clamp-1">
            {property.title}
          </h3>
        </Link>
        <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
          <span className="truncate">{property.city}, {property.state}</span>
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-blue-500/70" />
              {property.bedrooms === 0 ? 'Studio' : property.bedrooms}
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-blue-500/70" />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize2 className="h-4 w-4 text-blue-500/70" />
              {property.area.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
