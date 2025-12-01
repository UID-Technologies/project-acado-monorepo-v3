import { UserPortfolio } from '@app/types/learner/portfolio';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPortfolio, SkillsSuggestionResponseData, SkillsResponseData } from '@app/types/learner/portfolio';

type PortfolioState = {
    portfolio: UserPortfolio;
    setPortfolio: (portfolio: UserPortfolio) => void;
    error: string | null;
    setError: (error: string | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    reset: () => void;
};

export const usePortfolioStore = create<PortfolioState>()(
    persist(
        (set) => ({
            portfolio: {} as UserPortfolio,
            setPortfolio: (portfolio: UserPortfolio) => set({ portfolio, error: null }),
            error: null,
            setError: (error: string | null) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            reset: () => set({
                portfolio: {} as UserPortfolio,
                error: null,
                loading: false
            }),
        }),
        {
            name: 'portfolio',
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

