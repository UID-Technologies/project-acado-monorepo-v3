import { ModuleData } from '@app/types/learner/courseModule';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CourseModuleState = {
    courseModule?: ModuleData,
    setCourseModule: (courseModule: ModuleData) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useCourseModuleStore = create<CourseModuleState>()(
    persist(
        (set) => ({
            setCourseModule: (courseModule: ModuleData) => set({ courseModule }),
            isLoading: false,
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'courseModuleStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
