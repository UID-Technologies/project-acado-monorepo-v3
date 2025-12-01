import { Course } from '@app/types/common/university';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type EnrolledUniversityState = {
    enrolledUniversity: Course[];
    clearEnrolledUniversity: () => void;
    setEnrolledUniversity: (enrolledUniversity: Course[]) => void;
    showAll: boolean;
    setShowAll: (showAll: boolean) => void;
    error: string;
    setError: (error: string) => void;
    noFound: boolean;
    setNoFound: (noFound: boolean) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}


export const useEnrolledUniversityStore = create<EnrolledUniversityState>()(
    persist(
        (set) => ({
            enrolledUniversity: [],
            setEnrolledUniversity: (enrolledUniversity: Course[]) => set({ enrolledUniversity }),
            showAll: false,
            setShowAll: (showAll: boolean) => set({ showAll }),
            clearEnrolledUniversity: () => set({ enrolledUniversity: [] }),
            error: '',
            setError: (error: string) => set({ error }),
            noFound: false,
            setNoFound: (noFound: boolean) => set({ noFound }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'enrolledUniversitiesStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
