import { AppliedUniversityData } from '@app/types/learner/appliedUniversityList';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AppliedUniversityListState = {
    universityList: AppliedUniversityData[]; 
    setUniversityList: (universityList: AppliedUniversityData[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useAppliedUniversityListStore = create<AppliedUniversityListState>()(
    persist(
        (set) => ({
            universityList: [],
            setUniversityList: (universityList: AppliedUniversityData[]) => set({ universityList }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'appliedUniversityListStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
