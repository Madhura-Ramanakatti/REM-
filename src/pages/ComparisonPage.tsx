import { useComparisonStore } from '../store/comparisonStore';
import { usePropertyStore } from '../store/propertyStore';
import { formatPrice } from '../utils/formatters';
import { X, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function ComparisonPage() {
  const { propertyIds, removeFromCompare, clearCompare } = useComparisonStore();
  const { properties } = usePropertyStore();

  const comparisonItems = properties.filter((p) => propertyIds.includes(p.id));

  if (comparisonItems.length === 0) {
    return (
      <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
          <ArrowRight className="h-10 w-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No properties to compare</h2>
        <p className="text-slate-500 max-w-sm mb-8">Add up to 4 properties to compare their features side-by-side.</p>
        <Link to="/properties">
          <Button>Browse Properties</Button>
        </Link>
      </div>
    );
  }

  const features = [
    { label: 'Price', key: 'price', format: (v: number, p: any) => formatPrice(v, p.type) },
    { label: 'City', key: 'city' },
    { label: 'Type', key: 'category' },
    { label: 'Bedrooms', key: 'bedrooms' },
    { label: 'Bathrooms', key: 'bathrooms' },
    { label: 'Area', key: 'area', format: (v: number) => `${v.toLocaleString()} sq ft` },
    { label: 'Year Built', key: 'yearBuilt' },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Compare Properties</h1>
            <p className="text-slate-500 mt-1">{comparisonItems.length} of 4 properties selected</p>
          </div>
          <Button variant="outline" onClick={clearCompare}>Clear All</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-slate-50 dark:bg-slate-800/50 min-w-[200px] border border-slate-200 dark:border-slate-700"></th>
                {comparisonItems.map((p) => (
                  <th key={p.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-w-[250px]">
                    <div className="relative group">
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <img src={p.images[0]} alt="" className="h-32 w-full object-cover rounded-xl mb-4" />
                      <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">{p.title}</h3>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">{formatPrice(p.price, p.type)}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.label}>
                  <td className="p-4 font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    {f.label}
                  </td>
                  {comparisonItems.map((p) => (
                    <td key={p.id} className="p-4 text-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {(f as any).format ? (f as any).format((p as any)[f.key], p) : (p as any)[f.key]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4 font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  Features
                </td>
                {comparisonItems.map((p) => (
                  <td key={p.id} className="p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <ul className="text-xs space-y-1">
                      {p.features.slice(0, 5).map((feat) => (
                        <li key={feat} className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Check className="h-3 w-3 text-green-500" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"></td>
                {comparisonItems.map((p) => (
                  <td key={p.id} className="p-4 text-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <Link to={`/properties/${p.id}`}>
                      <Button variant="outline" size="sm" className="w-full">View Details</Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
