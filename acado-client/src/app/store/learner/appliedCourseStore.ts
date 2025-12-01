import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiResponse } from '@app/types/learner/appliedCourseList'; // Import the correct type

// Define the state type
type AppliedCourseListState = {
    courseList?: ApiResponse; // Use ApiResponse type here
    setCourseList: (courseList: ApiResponse) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

// Create the store
export const useAppliedCourseListStore = create<AppliedCourseListState>()(
    persist(
        (set) => ({
            courseList: undefined, // Initialize courseList as undefined
            setCourseList: (courseList: ApiResponse) => set({ courseList }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'appliedCourseListStore', // Name for localStorage
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
