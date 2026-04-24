import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Property } from '../types';

interface ComparisonState {
  propertyIds: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set) => ({
      propertyIds: [],
      addToCompare: (id) => set((state) => {
        if (state.propertyIds.includes(id)) return state;
        if (state.propertyIds.length >= 4) return state; // Max 4
        return { propertyIds: [...state.propertyIds, id] };
      }),
      removeFromCompare: (id) => set((state) => ({
        propertyIds: state.propertyIds.filter((pId) => pId !== id),
      })),
      clearCompare: () => set({ propertyIds: [] }),
    }),
    { name: 'comparison-store' }
  )
);
