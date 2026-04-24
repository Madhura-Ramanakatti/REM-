import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyCardSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { usePropertyStore } from '../store/propertyStore';
import { CITIES } from '../data/mockData';
import type { PropertyFilters } from '../types';

const PAGE_SIZE = 9;

const categoryOptions = [
  { value: '', label: 'All Types' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'studio', label: 'Studio' },
];

const typeOptions = [
  { value: '', label: 'Buy or Rent' },
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];

const cityOptions = [{ value: '', label: 'Any City' }, ...CITIES.map(c => ({ value: c, label: c }))];

const bedroomOptions = [
  { value: '0', label: 'Any Beds' },
  { value: '1', label: '1+ Bed' },
  { value: '2', label: '2+ Beds' },
  { value: '3', label: '3+ Beds' },
  { value: '4', label: '4+ Beds' },
];

export function PropertiesPage() {
  const [searchParams] = useSearchParams();
  const { properties, filters, setFilters, resetFilters } = usePropertyStore();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [localFilters, setLocalFilters] = useState<PropertyFilters>({
    search: searchParams.get('search') || '',
    type: (searchParams.get('type') as PropertyFilters['type']) || '',
    category: '',
    city: searchParams.get('city') || '',
    minPrice: 0,
    maxPrice: 0,
    minBedrooms: 0,
    minArea: 0,
    maxArea: 0,
  });

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setFilters(localFilters);
      setLoading(false);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [localFilters]);

  const updateFilter = (key: keyof PropertyFilters, value: string | number) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredProperties = properties.filter(p => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    if (filters.type && p.type !== filters.type) return false;
    if (filters.category && p.category !== filters.category) return false;
    if (filters.city && p.city !== filters.city) return false;
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.maxPrice && filters.maxPrice > 0 && p.price > filters.maxPrice) return false;
    if (filters.minBedrooms && p.bedrooms < filters.minBedrooms) return false;
    if (filters.minArea && p.area < filters.minArea) return false;
    if (filters.maxArea && filters.maxArea > 0 && p.area > filters.maxArea) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / PAGE_SIZE));
  const paginated = filteredProperties.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleReset = () => {
    const cleared: PropertyFilters = { search: '', type: '', category: '', city: '', minPrice: 0, maxPrice: 0, minBedrooms: 0, minArea: 0, maxArea: 0 };
    setLocalFilters(cleared);
    resetFilters();
    setCurrentPage(1);
  };

  const hasActiveFilters = localFilters.search || localFilters.type || localFilters.category || localFilters.city || localFilters.minPrice > 0 || localFilters.maxPrice > 0 || localFilters.minBedrooms > 0 || localFilters.minArea > 0 || localFilters.maxArea > 0;

  return (
    <div className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
            Property Listings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {loading ? 'Searching...' : `${filteredProperties.length} properties found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Panel */}
          <div className={`lg:w-72 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sticky top-20">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </h2>
                {hasActiveFilters && (
                  <button onClick={handleReset} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                    <X className="h-3 w-3" /> Clear all
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <Input
                  label="Search"
                  placeholder="Keywords..."
                  value={localFilters.search}
                  onChange={e => updateFilter('search', e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
                <Select
                  label="Transaction Type"
                  options={typeOptions}
                  value={localFilters.type}
                  onChange={e => updateFilter('type', e.target.value)}
                />
                <Select
                  label="Property Type"
                  options={categoryOptions}
                  value={localFilters.category}
                  onChange={e => updateFilter('category', e.target.value)}
                />
                <Select
                  label="City"
                  options={cityOptions}
                  value={localFilters.city}
                  onChange={e => updateFilter('city', e.target.value)}
                />
                <Select
                  label="Bedrooms"
                  options={bedroomOptions}
                  value={String(localFilters.minBedrooms)}
                  onChange={e => updateFilter('minBedrooms', Number(e.target.value))}
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="No minimum"
                    value={localFilters.minPrice || ''}
                    onChange={e => updateFilter('minPrice', Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="No maximum"
                    value={localFilters.maxPrice || ''}
                    onChange={e => updateFilter('maxPrice', Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Min Area (sq ft)
                    </label>
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.minArea || ''}
                      onChange={e => updateFilter('minArea', Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Max Area (sq ft)
                    </label>
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.maxArea || ''}
                      onChange={e => updateFilter('maxArea', Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
                {hasActiveFilters && <span className="h-2 w-2 bg-blue-600 rounded-full" />}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-950 text-blue-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-950 text-blue-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-4'}>
                {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20">
                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No properties found</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Try adjusting your filters or search terms</p>
                <Button variant="outline" onClick={handleReset}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                  : 'space-y-4'
                }>
                  {paginated.map(p => <PropertyCard key={p.id} property={p} compact={viewMode === 'list'} />)}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
