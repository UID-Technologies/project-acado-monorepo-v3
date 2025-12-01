import { SelfAssessmentData, AssessmentList} from '@app/types/common/selfAssessment'; 
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SelfAssesssmentState = {
    selfAssessment: AssessmentList[];
    setSelfAssessment: (selfAssessment: AssessmentList[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useSelfAssessmentStore = create<SelfAssesssmentState>()(
    persist(
        (set) => ({
            selfAssessment: [],
            setSelfAssessment: (selfAssessment: AssessmentList[]) => set({ selfAssessment }),
            isLoading: false,
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'selfAssessmentStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
