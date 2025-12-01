import { UserPortfolio, SkillsSuggestionResponseData, SkillsResponseData } from '@app/types/learner/portfolio_temp';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ========== Portfolio Store ==========
type PortfolioState = {
    portfolio: UserPortfolio;
    setPortfolio: (newPortfolio: UserPortfolio) => void;
    clearPortfolio: () => void;
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

export const usePortfolioStore = create<PortfolioState>()(
    persist(
        (set) => ({
            portfolio: {} as UserPortfolio,
            setPortfolio: (portfolio: UserPortfolio) => set({ portfolio }),
            clearPortfolio: () => set({
                portfolio: {} as UserPortfolio,
                error: '',
                loading: false,
            }),
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

// ========== Skills Suggestions Store ==========
type SkillsSuggestionsState = {
    suggestions: SkillsSuggestionResponseData[];
    setSuggestions: (suggestions: SkillsSuggestionResponseData[]) => void;
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

export const useSkillsSuggestionsStore = create<SkillsSuggestionsState>()(
    persist(
        (set) => ({
            suggestions: [] as SkillsSuggestionResponseData[],
            setSuggestions: (suggestions: SkillsSuggestionResponseData[]) => set({ suggestions }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'skillsSuggestionsStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
