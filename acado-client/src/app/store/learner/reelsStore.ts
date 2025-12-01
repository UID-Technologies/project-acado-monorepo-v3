import { ReelsListResponse, ReelsList} from '@app/types/learner/reels'; 
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ReelsListState = {
    reels: ReelsList[];
    setReels: (reels: ReelsList[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useReelsStore = create<ReelsListState>()(
    persist(
        (set) => ({
            reels: [],
            setReels: (reels: ReelsList[]) => set({ reels }),
            isLoading: false,
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'ReelsListStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
