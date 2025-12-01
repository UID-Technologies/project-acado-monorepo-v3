import { PortfolioDataResponse} from '@app/types/learner/portfolioBasicInfo';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ImageUpdateState = {
    imageUpdate?:PortfolioDataResponse[];
    setImageUpdate: ( imageUpdate:  PortfolioDataResponse[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useImageUpdateStore = create<ImageUpdateState>()(
    persist(
        (set) => ({
            setImageUpdate: ( imageUpdate:  PortfolioDataResponse[]) => set({imageUpdate: []}),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'imageUpdateStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
