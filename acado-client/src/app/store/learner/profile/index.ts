import { portfolio_profile } from '@app/types/learner/profile';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PortfolioState = {
    portfolio: portfolio_profile;
    setPortfolio: (news: portfolio_profile) => void;
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

const porfileStore = create<PortfolioState>()(
    persist(
        (set) => ({
            portfolio: {} as portfolio_profile,
            setPortfolio: (portfolio: portfolio_profile) => set({ portfolio }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'portfolioStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);


export default {
    porfileStore
}
