import { AssessmentQuestion } from '@app/types/common/questionAttempt'; 
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type QuestionAttemptState = {
    questionAttempt: AssessmentQuestion[];
    setQuestionAttempt: (questionAttempt: AssessmentQuestion[]) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useQuestionAttemptStore = create<QuestionAttemptState>()(
    persist(
        (set) => ({
            questionAttempt: [],
            setQuestionAttempt: (questionAttempt: AssessmentQuestion[]) => set({ questionAttempt }),
            isLoading: false,
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'questionAttemptStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
