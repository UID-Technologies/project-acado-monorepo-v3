
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CourseDetails } from '@app/types/common/university';

type CourseState = {
    courses: CourseDetails[];
    clearCourses: () => void;
    setCourses: (courses: CourseDetails[]) => void;
    showAll: boolean;
    setShowAll: (showAll: boolean) => void;
    error: string;
    setError: (error: string) => void;
    noFound: boolean;
    setNoFound: (noFound: boolean) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}


export const useCourseStore = create<CourseState>()(
    persist(
        (set) => ({
            courses: [],
            setCourses: (courses: CourseDetails[]) => set({ courses }),
            showAll: false,
            setShowAll: (showAll: boolean) => set({ showAll }),
            clearCourses: () => set({ courses: [] }),
            error: '',
            setError: (error: string) => set({ error }),
            noFound: false,
            setNoFound: (noFound: boolean) => set({ noFound }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'wpCoursesStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);


// course Details store

type CourseDetailsState = {
    courseDetails: CourseDetails;
    setCourseDetails: (courseDetails: CourseDetails) => void;
    clearCourseDetails: () => void;
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useCourseDetailsStore = create<CourseDetailsState>()(
    persist(
        (set) => ({
            courseDetails: {} as CourseDetails,
            setCourseDetails: (courseDetails: CourseDetails) => set({ courseDetails }),
            clearCourseDetails: () => set({ courseDetails: {} as CourseDetails }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'courseDetailsStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
