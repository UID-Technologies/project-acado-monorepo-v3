import ApiService from '@services/ApiService';
import { AssessmentResponse, AssessmentQuestion } from '@app/types/common/questionAttempt';

export async function fetchQuestions(contentId: string): Promise<AssessmentQuestion[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AssessmentResponse>({
            url: `/assessment-detail/${contentId}`,
            method: 'get'
        });
        return response?.data?.assessment_details?.questions;
    } catch (error) {
        throw error as string;
    }
}
