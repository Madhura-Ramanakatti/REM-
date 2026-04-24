import { create } from 'zustand';
import type { Property, PropertyFilters } from '../types';
import { MOCK_PROPERTIES } from '../data/mockData';

interface PropertyState {
  properties: Property[];
  filters: PropertyFilters;
  currentPage: number;
  pageSize: number;
  setProperties: (props: Property[]) => void;
  addProperty: (prop: Property) => void;
  updateProperty: (id: string, data: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
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

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: [...MOCK_PROPERTIES],
  filters: defaultFilters,
  currentPage: 1,
  pageSize: 9,
  setProperties: (properties) => set({ properties }),
  addProperty: (prop) => set(state => ({ properties: [...state.properties, prop] })),
  updateProperty: (id, data) => set(state => ({
    properties: state.properties.map(p => p.id === id ? { ...p, ...data } : p),
  })),
  deleteProperty: (id) => set(state => ({
    properties: state.properties.filter(p => p.id !== id),
  })),
  setFilters: (filters) => set(state => ({ filters: { ...state.filters, ...filters }, currentPage: 1 })),
  resetFilters: () => set({ filters: defaultFilters, currentPage: 1 }),
  setPage: (page) => set({ currentPage: page }),
}));
