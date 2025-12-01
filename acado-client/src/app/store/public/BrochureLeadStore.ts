import { BrochureApiResponse } from '@app/types/public/brochure';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type BrochureLeadState = {
    brochureLead?:BrochureApiResponse;
    setBrochureLead: ( brochureLead:  BrochureApiResponse) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useBrochureLeadStore = create<BrochureLeadState>()(
    persist(
        (set) => ({
            setBrochureLead: ( brochureLead:  BrochureApiResponse) => set({brochureLead }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'brochureLeadStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
