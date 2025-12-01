import { ProgramList } from '@app/types/learner/programList';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type ProgramListState = {
    programList?: ProgramList,
    setProgramList: (programList: ProgramList) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useProgramListStore = create<ProgramListState>()(
    persist(
        (set) => ({
            setProgramList: (programList: ProgramList) => set({ programList }),
            isLoading: false,
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'programListStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
