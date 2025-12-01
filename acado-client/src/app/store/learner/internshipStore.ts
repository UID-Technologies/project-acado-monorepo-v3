import { Program } from '@app/types/learner/internship';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type InternshipState = {
  internship:  Program[];
  setInternship: (internship:  Program[]) => void;
  showAll: boolean;
  setShowAll: (showAll: boolean) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useInternshipStore = create<InternshipState>()(
  persist(
    (set) => ({
      internship: [],
      setInternship: (internship:  Program[]) => set({ internship }),
      showAll: false,
      setShowAll: (showAll: boolean) => set({ showAll }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: 'internshipStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);
