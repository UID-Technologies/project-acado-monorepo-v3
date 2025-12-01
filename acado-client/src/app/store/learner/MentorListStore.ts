import { MentorApiResponse } from '@app/types/learner/mentor';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type MentorListState = {
    mentor?:  MentorApiResponse,
    setMentor: (mentor:  MentorApiResponse) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useMentorStore = create<MentorListState>()(
    persist(
        (set) => ({
            setMentor: (mentor:  MentorApiResponse) => set({ mentor }),
            isLoading: false,
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'mentorStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
