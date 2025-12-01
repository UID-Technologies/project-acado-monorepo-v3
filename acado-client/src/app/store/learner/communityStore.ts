import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CommunityCategory, Post } from '@app/types/learner/community';

type CommunityState = {
  community: CommunityCategory[];
  setCommunity: (community: CommunityCategory[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      community: [],
      setCommunity: (community: CommunityCategory[]) => set({ community }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: 'communityStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);

// community details store

type CommunityDetailsState = {
  community: CommunityCategory;
  setCommunity: (community: CommunityCategory) => void;
  communityContent: Post[];
  setCommunityContent: (communityContent: Post[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useCommunityDetailsStore = create<CommunityDetailsState>()(
  persist(
    (set) => ({
      community: {} as CommunityCategory,
      setCommunity: (community: CommunityCategory) => set({ community }),
      communityContent: [],
      setCommunityContent: (communityContent: Post[]) => set({ communityContent }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: 'communityDetailsStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);


// community post comment store
type CommunityPostCommentState = {
  postId: string;
  setPostId: (postId: string) => void;
  comments: Post[];
  setComments: (comments: Post[]) => void;
  error: string;
  setError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const useCommunityPostCommentStore = create<CommunityPostCommentState>()(
  persist(
    (set) => ({
      postId: '',
      setPostId: (postId: string) => set({ postId }),
      comments: [],
      setComments: (comments: Post[]) => set({ comments }),
      error: '',
      setError: (error: string) => set({ error }),
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: 'communityPostCommentStore',
      storage: {
        getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
        setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
);

