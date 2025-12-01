import { AssessmentSubmitResponse} from '@app/types/common/assessmentSubmit';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AssessmentSubmitState = {
    assessmentSubmit?:AssessmentSubmitResponse;
    setAssessmentSubmit: ( assessmentSubmit:  AssessmentSubmitResponse) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useAssessmentSubmitStore = create<AssessmentSubmitState>()(
    persist(
        (set) => ({
            setAssessmentSubmit: ( assessmentSubmit:  AssessmentSubmitResponse) => set({assessmentSubmit }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'assessmentSubmitStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
