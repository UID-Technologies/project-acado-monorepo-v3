import { InterestArea } from '@app/types/learner/interest';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type InterestState = {
    interestArea: InterestArea[];
    setInterestArea: (interest: InterestArea[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useInterestAreaStore = create<InterestState>()(
    persist(
        (set) => ({
            interestArea: [],
            setInterestArea: (interestArea: InterestArea[]) => set({ interestArea }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'interestStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
