import { PortfolioDataResponse} from '@app/types/learner/portfolioBasicInfo';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PortfolioBasicInfoState = {
    portfolioBasicInfo?:PortfolioDataResponse[];
    setPortfolioBasicInfo: ( portfolioBasicInfo:  PortfolioDataResponse[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const usePortfolioBasicInfoStore = create<PortfolioBasicInfoState>()(
    persist(
        (set) => ({
            setPortfolioBasicInfo: ( portfolioBasicInfo:  PortfolioDataResponse[]) => set({portfolioBasicInfo: []}),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'portfolioBasicInfoStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
