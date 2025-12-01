import {AssignmentResponse} from '@app/types/learner/assignmentList';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AssignmentDetailsState = {
    assignmentList?: AssignmentResponse;
    setAssignmentList: (assignmentList: AssignmentResponse) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useAssignmentDetailsStore = create<AssignmentDetailsState>()(
    persist(
        (set) => ({
            setAssignmentList: (assignmentList: AssignmentResponse) => set({ assignmentList }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'assignmentListStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
