import { create } from 'zustand';
import type { Property, PropertyFilters } from '../types';
import { propertyService } from '../services/api';

interface PropertyState {
  properties: Property[];
  filters: PropertyFilters;
  isLoading: boolean;
  currentPage: number;
  pageSize: number;
  setProperties: (props: Property[]) => void;
  fetchProperties: () => Promise<void>;
  setFilters: (filters: Partial<PropertyFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
}

const defaultFilters: PropertyFilters = {
  search: '',
  type: '',
  category: '',
  city: '',
  minPrice: 0,
  maxPrice: 0,
  minBedrooms: 0,
  minArea: 0,
  maxArea: 0,
};

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  filters: defaultFilters,
  isLoading: false,
  currentPage: 1,
  pageSize: 9,
  setProperties: (properties) => set({ properties }),
  fetchProperties: async () => {
    set({ isLoading: true });
    try {
      const data = await propertyService.getAll();
      set({ properties: data });
    } catch (err) {
      console.error('Failed to fetch properties', err);
    } finally {
      set({ isLoading: false });
    }
  },
  setFilters: (filters) => set(state => ({ filters: { ...state.filters, ...filters }, currentPage: 1 })),
  resetFilters: () => set({ filters: defaultFilters, currentPage: 1 }),
  setPage: (page) => set({ currentPage: page }),
}));
