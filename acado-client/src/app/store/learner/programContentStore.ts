import { ProgramModule } from '@app/types/learner/programContent';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProgramContentState = {
    programContent?: ProgramModule,
    setProgramContent: (programContent: ProgramModule) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useProgramContentStore = create<ProgramContentState>()(
    persist(
        (set) => ({
            setProgramContent: (programContent: ProgramModule) => set({ programContent }),
            isLoading: false,
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'programContentStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
