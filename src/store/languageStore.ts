import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'kn';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'kn' : 'en' })),
    }),
    { name: 'language-store' }
  )
);
