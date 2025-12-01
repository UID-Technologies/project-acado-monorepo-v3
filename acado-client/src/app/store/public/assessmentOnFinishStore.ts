import { AssessmentOnFinishResponse} from '@app/types/common/assessmentOnFinish';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AssessmentOnFinishState = {
    assessmentOnFinish?:AssessmentOnFinishResponse;
    setAssessmentOnFinish: ( assessmentOnFinish:  AssessmentOnFinishResponse) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useAssessmentOnFinishStore = create<AssessmentOnFinishState>()(
    persist(
        (set) => ({
            setAssessmentOnFinish: ( assessmentOnFinish:  AssessmentOnFinishResponse) => set({assessmentOnFinish }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'assessmentOnFinishStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
