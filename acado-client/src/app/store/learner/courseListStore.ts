import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppliedCourses } from '@app/types/learner/courses';
import { CourseDetails } from '@app/types/common/university';

type CourseListState = {
    courseList: AppliedCourses[];
    setCourseList: (courseList: AppliedCourses[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useCourseListStore = create<CourseListState>()(
    persist(
        (set) => ({
            setCourseList: (courseList: AppliedCourses[]) => set({ courseList }),
            courseList: [],
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'courseListStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);


// applied course list

type AppliedCourseListState = {
    appliedCourseList: CourseDetails[];
    setAppliedCourseList: (appliedCourseList: CourseDetails[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useAppliedCourseListStore = create<AppliedCourseListState>()(
    persist(
        (set) => ({
            setAppliedCourseList: (appliedCourseList: CourseDetails[]) => set({ appliedCourseList }),
            appliedCourseList: [],
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'appliedCourseListStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
