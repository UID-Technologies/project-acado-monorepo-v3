import { Course, CourseDetails, Module, Pagination, ModuleCourseDetails, ModuleContent } from "@app/types/public/lmsCourses";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CourseCategory } from '@app/types/public/courseCategory';

type FreeCourseState = {
    freeCourses: Course[];
    pagination: Pagination;
    setFreeCourses: (freeCourses: Course[]) => void;
    setPagination: (pagination: Pagination) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    noFound: boolean;
    setNoFound: (noFound: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useFreeCourseStore = create<FreeCourseState>()(
    persist(
        (set) => ({
            freeCourses: [],
            setFreeCourses: (freeCourses: Course[]) => set({ freeCourses }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            noFound: false,
            setNoFound: (noFound: boolean) => set({ noFound }),
            setPagination: (pagination: Pagination) => set({ pagination }),
            pagination: {} as Pagination,
        }),
        {
            name: 'freeCoursesStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            }
        }
    )
);

// Store for Continue Reading
type ContinueReadingState = {
    courses: Course[];
    setFreeCourses: (courses: Course[]) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useContinueReadingStore = create<ContinueReadingState>()(
    persist(
        (set) => ({
            courses: [],
            setFreeCourses: (courses: Course[]) => set({ courses: courses }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error: error }),
        }),
        {
            name: 'continueReadingStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            }
        }
    )
);

// Store for Single Course
type SingleFreeCourseState = {
    course: CourseDetails | null;
    setCourse: (course: CourseDetails) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useSingleCourseStore = create<SingleFreeCourseState>()(
    persist(
        (set) => ({
            course: null,
            setCourse: (course: CourseDetails) => set({ course }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error: error }),
        }),
        {
            name: 'singleCourseStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            }
        }
    )
);

// Store for Modules (specific course modules)
type ModuleState = {
    module: Module;
    course: ModuleCourseDetails;
    content: ModuleContent[] | [];
    setCourse: (course: ModuleCourseDetails) => void;
    setModule: (module: Module) => void;
    setContent: (content: ModuleContent[]) => void;
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useModuleStore = create<ModuleState>()(
    persist(
        (set) => ({
            module: {} as Module,
            course: {} as ModuleCourseDetails,
            content: [] as ModuleContent[],
            setCourse: (course: ModuleCourseDetails) => set({ course }),
            setModule: (module: Module) => set({ module }),
            setContent: (content: ModuleContent[]) => set({ content }),
            loading: false,
            setLoading: (isLoading: boolean) => set({ loading: isLoading }),
            error: null,
            setError: (error: string | null) => set({ error: error }),
        }),
        {
            name: 'moduleStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            }
        }
    )
);

type CourseCategoryState = {
    coursesCategory:  CourseCategory[];
    pagination: Pagination;
    setCoursesCategory: ( coursesCategory:  CourseCategory[]) => void;
    setPagination: (pagination: Pagination) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useCoursesCategoryStore = create<CourseCategoryState>()(
    persist(
        (set) => ({
            coursesCategory: [],
            setCoursesCategory: ( coursesCategory:  CourseCategory[]) => set({  coursesCategory }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
            setPagination: (pagination: Pagination) => set({ pagination }),
            pagination: {} as Pagination,
        }),
        {
            name: 'CoursesCategoryStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            }
        }
    )
);
