import { useQuery } from "@tanstack/react-query";
import { fetchProgramList } from "@services/learner/ProgramListService";
import type { Program } from "@app/types/learner/programList";
import { CourseCategory } from "@app/types/public/courseCategory";
import { fetchCoursesCategory } from "@services/public/CoursesService";
import { fetchFreeCourses, fetchForms } from "@services/public/LmsCourseService";
import { CoursesApiResponse } from "@app/types/public/lmsCourses";
import { CourseDetails, CourseModule, SubmittedAssignment } from "@app/types/learning/courses";
import { fetchAssessmentInstruction, fetchAssignment, fetchCourseById, fetchModuleByCourseId, getPendingContent } from "@services/learning/CourseService";
import { AssessmentAttempt, AssessmentInstruction, AssessmentReview, AssessmentResult } from "@app/types/learning/assessment";
import { fetchAssessmentReview, fetchAssessmentResult, fetchQuestions } from "@services/learning/AssesmentService";


export const useMyCourses = () => {
    const queryKey = ['my-courses'];
    return useQuery<Array<Program>>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await fetchProgramList();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useForms = () => {
    return useQuery<CoursesApiResponse>({
        queryFn: async () => {
            const res = await fetchForms();
            // console.log("dsdsdsds");
            // console.log("res");
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useCourses = (params: URLSearchParams) => {
    const queryKey = ['courses', params.toString()];
    return useQuery<CoursesApiResponse>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await fetchFreeCourses(params);
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};



export const useCourseCategories = () => {
    const queryKey = ['course-categories'];
    return useQuery<Array<CourseCategory>>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await fetchCoursesCategory();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};


export const useCourse = (id: string | undefined) => {
    return useQuery<CourseDetails>({
        queryKey: ['course', id],
        queryFn: async () => {
            const res = await fetchCourseById(id);
            return res || null;
        },
        retry: 1,
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
    });
};

export const useCourseModuleDetails = (module_id: string | undefined) => {
    return useQuery<CourseModule>({
        queryKey: ['courseModule', module_id],
        queryFn: async () => {
            const res = await fetchModuleByCourseId(module_id);
            return res || [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!module_id,
    });
};



// get continue reading courses - getPendingContent
export const useContinueReadingCourses = (content_id: number) => {
    return useQuery({
        queryKey: ['continueReadingCourses', content_id],
        queryFn: async () => {
            const res = await getPendingContent(content_id);
            return res || [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!content_id,
    });
};

export const useLearnerSubmittedAssignments = (content_id: number | undefined) => {
    return useQuery<Array<SubmittedAssignment>>({
        queryKey: ['learnerSubmittedAssignments', content_id],
        queryFn: async () => {
            const res = await fetchAssignment(content_id);
            return res || [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!content_id,
    });
};


// fetchAssessmentInstruction
export const useAssessmentInstruction = (id: string | undefined) => {
    return useQuery<AssessmentInstruction>({
        queryKey: ['assessmentInstruction', id],
        queryFn: async () => {
            const res = await fetchAssessmentInstruction(id);
            return res || null;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!id,
    });
}

// fetch assesment Questions
export const useAssessmentQuestions = (id: string | undefined) => {
    return useQuery<AssessmentAttempt>({
        queryKey: ['assessmentQuestions', id],
        queryFn: async () => {
            const res = await fetchQuestions(id);
            return res || [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!id,
    });
};


// fetchAssessmentReview
export const useAssessmentReview = (id: string | undefined) => {
    return useQuery<AssessmentReview>({
        queryKey: ['assessmentReview', id],
        queryFn: async () => {
            const res = await fetchAssessmentReview(id);
            return res || null;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
        enabled: !!id,
    });
}

/**
 * Hook to fetch assessment result (last attempted scoreboard)
 * @param id - Content ID
 * @returns Query result with assessment result
 */
export const useAssessmentResult = (id: string | undefined) => {
    return useQuery<AssessmentResult>({
        queryKey: ['assessmentResult', id],
        queryFn: async () => {
            const res = await fetchAssessmentResult(id);
            return res || null;
        },
        retry: 1,
        staleTime: 1000 * 60 * 3, // 3 minutes cache
        enabled: !!id,
    });
}
