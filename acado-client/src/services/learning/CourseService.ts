import { AssignmentApiResponse, CourseDetails, CourseDetailsApiResponse, CourseModule, CourseModuleApiResponse, SubmissionApiResponse, SubmittedAssignment } from "@app/types/learning/courses";

import ApiService from "../ApiService";
import { AssessmentInstruction, AssessmentInstructionApiResponse } from "@app/types/learning/assessment";

export async function fetchCourseById(course_id: string | undefined): Promise<CourseDetails> {
    if (!course_id) {
        throw new Error('Course ID is required');
    }
    try {
        const response = await ApiService.fetchDataWithAxios<CourseDetailsApiResponse>({
            url: `/v1/get-course-details/${course_id}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}



// Fetch module by course and module ID
export async function fetchModuleByCourseId(module_id: string | undefined): Promise<CourseModule> {
    try {
        const response = await ApiService.fetchDataWithAxios<CourseModuleApiResponse>({
            url: `v1/module-content-list/${module_id}`,
            method: 'get',
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

// apply for course lead
export async function saveUserCourseLead(params: { program_id: number, reason?: string, wp_center_id: number }): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<string>({
            url: '/user-course-lead',
            method: 'post',
            data: params
        });
        return response
    } catch (error) {
        throw error as string;
    }
}

export async function getPendingContent(content_id: number): Promise<{ content_id: number | null }> {
    try {
        const response = await ApiService.fetchDataWithAxios<{ content_id: number | null }>({
            url: `/v1/get-pending-content/${content_id}`,
            method: 'get',
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}


export async function saveContentCompletion(formData: FormData): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<{
            message: string;
        }>({
            url: `program-content-attempt`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: formData as any,

        });
        return response.message;
    } catch (error) {
        throw error as string;
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function fetchAssignment(content_id: number | undefined): Promise<SubmittedAssignment[]> {
    try {
        if (!content_id) throw 'Content ID is undefined';
        const response = await ApiService.fetchDataWithAxios<AssignmentApiResponse>({
            url: `/assignmentdetails/${content_id}`,
            method: 'get',
        });
        return response?.data?.assessment_details?.length > 0 ? response?.data?.assessment_details[0]?.submission_details || [] : [];
    } catch (error) {
        throw error as string;
    }
}

export async function uploadeAssignment(formData: FormData): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<SubmissionApiResponse>({
            url: `/assignmentsubmit`,
            method: 'post',
            data: formData as any,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response?.message;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchAssessmentInstruction(program_content_id: string | undefined): Promise<AssessmentInstruction> {
    if (!program_content_id) {
        throw new Error('Program Content ID is required');
    }
    try {
        const response = await ApiService.fetchDataWithAxios<AssessmentInstructionApiResponse>({
            url: `/assessment-instructions/${program_content_id}`,
            method: 'get',
        })
        return response?.data?.instruction;
    } catch (error) {
        throw error as string;
    }
}


export async function presentInZoomClass(data: { content_id: number, is_manual: number }): Promise<string> {
    if (!data.content_id) {
        throw new Error('Content ID is required');
    }
    try {
        const response = await ApiService.fetchDataWithAxios<{ message: string }>({
            url: `/add-participant`,
            method: 'post',
            data: data
        })
        return response?.message;
    } catch (error) {
        throw error as string;
    }
}
