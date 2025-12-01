import { Query } from '@app/types/learner/mailbox';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type QueryState = {
    queries: Query[];
    setQueries: (queries: Query[]) => void;
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

export const useQueryStore = create<QueryState>()(
    persist(
        (set) => ({
            queries: {} as Query[],
            setQueries: (queries: Query[]) => set({ queries }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'queriesStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
