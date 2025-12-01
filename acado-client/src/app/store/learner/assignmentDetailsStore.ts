import { AssessmentDetail } from '@app/types/learner/assignmentDetails';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AssignmentDetailsState = {
    assignmentDetailsList: AssessmentDetail;
    setAssignmentList: (assignmentDetailsList: AssessmentDetail) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useAssignmentDetailsStore = create<AssignmentDetailsState>()(
    persist(
        (set) => ({
            assignmentDetailsList: {} as AssessmentDetail,
            setAssignmentList: (assignmentDetailsList: AssessmentDetail) => set({ assignmentDetailsList }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'assignmentDetailsListStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
