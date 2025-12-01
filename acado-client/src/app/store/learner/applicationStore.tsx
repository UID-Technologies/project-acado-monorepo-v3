import { Application, ApplicationData, Data } from '@app/types/learner/application';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ApplicationState = {
    application: Data | null;
    setApplication: (application: Data) => void; 
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

export const useApplicationStore = create<ApplicationState>()(
    persist(
        (set) => ({
            application: null,
            setApplication: (application: Data) => set({ application }), 
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'applicationStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
