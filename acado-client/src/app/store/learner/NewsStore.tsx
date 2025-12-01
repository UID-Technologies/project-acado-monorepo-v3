import { Post } from '@app/types/learner/post';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NewsState = {
    news: Post[];
    setNews: (news: Post[]) => void;
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

export const useNewsStore = create<NewsState>()(
    persist(
        (set) => ({
            news: [],
            setNews: (news: Post[]) => set({ news }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'newsStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
