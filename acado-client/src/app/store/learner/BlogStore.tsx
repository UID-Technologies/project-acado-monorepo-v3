import { Post } from '@app/types/learner/post';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type BlogState = {
    blogs: Post[];
    setBlogs: (blogs: Post[]) => void;
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

export const useBlogsStore = create<BlogState>()(
    persist(
        (set) => ({
            blogs: [],
            setBlogs: (blogs: Post[]) => set({ blogs }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'blogStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);

// blog detail store
type BlogDetailState = {
    postDetail: Post | null;
    setPostDetail: (blogDetail: Post) => void;
    error: string;
    setError: (error: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

export const useBlogDetailStore = create<BlogDetailState>()(
    persist(
        (set) => ({
            postDetail: null,
            setPostDetail: (postDetail: Post) => set({ postDetail }),
            error: '',
            setError: (error: string) => set({ error }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
        }),
        {
            name: 'blogDetailStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);



