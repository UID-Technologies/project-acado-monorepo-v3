import ApiService from '@services/ApiService';
import { AssessmentAttemptApiResponse, AssessmentAttempt, AssessmentInstruction, AssessmentSubmitResponse, AssessmentFinishResponse, AssessmentInstructionApiResponse, AssessmentReview, AssessmentReviewResponse, AssessmentResult, AssessmentResultResponse } from '@app/types/learning/assessment';

export async function fetchQuestions(contentId: string | undefined): Promise<AssessmentAttempt> {
    if (!contentId) {
        throw 'Content ID is required';
    }
    try {
        const response = await ApiService.fetchDataWithAxios<AssessmentAttemptApiResponse>({
            url: `/assessment-detail/${contentId}`,
            method: 'get'
        });
        return response?.data?.assessment_details;
    } catch (error) {
        throw error as string;
    }
}

export async function assessmentQuestionSave(formData: FormData): Promise<string> {
    try {
        // const formData = new FormData();
        // formData.append('content_id', data.content_id.toString());
        // formData.append('question_id', data.question_id.toString());
        // if (data.option_id !== null) {
        //     formData.append('option_id[]', data.option_id.toString());
        // }
        // formData.append('mark_review', data.mark_review.toString());
        // formData.append('durationSec', data.durationSec.toString());
        const response = await ApiService.fetchDataWithAxios<AssessmentSubmitResponse>({
            url: '/assessment-submit',
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: formData as any,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.message;
    } catch (error) {
        throw error as string;
    }
}


export async function assessmentFinish(content_id: string): Promise<string> {
    try {
        const formData = new FormData();
        formData.append('content_id', content_id.toString());
        const response = await ApiService.fetchDataWithAxios<AssessmentFinishResponse>({
            url: `/assessment-onfinish`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: formData as any,
        });
        return response.message;
    } catch (error) {
        throw error as string;
    }
}



export async function fetchAssessmentInsruction(program_content_id: string): Promise<AssessmentInstruction> {
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



export async function fetchAssessmentReview(contentId: string | undefined): Promise<AssessmentReview> {
    if (!contentId) {
        throw 'Content ID is required';
    }
    try {
        const response = await ApiService.fetchDataWithAxios<AssessmentReviewResponse>({
            url: `/assessment-review/${contentId}`,
            method: 'get',
        });
        return response?.data?.assessment_review;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchAssessmentResult(contentId: string | undefined): Promise<AssessmentResult> {
    if (!contentId) {
        throw 'Content ID is required';
    }
    try {
        const response = await ApiService.fetchDataWithAxios<AssessmentResultResponse>({
            url: `/assessment-result/${contentId}`,
            method: 'get',
        });
        return response?.data?.assessment_result;
    } catch (error) {
        throw error as string;
    }
}
