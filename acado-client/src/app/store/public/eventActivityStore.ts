import { EventActivityResponse } from '@app/types/learner/eventActivity';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type EventActivityState = {
    eventActivity?: EventActivityResponse;
    setEventActivity: ( eventActivity: EventActivityResponse) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useEventActivityStore = create<EventActivityState>()(
    persist(
        (set) => ({
            setEventActivity: ( eventActivity: EventActivityResponse) => set({  eventActivity }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'eventActivityStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
