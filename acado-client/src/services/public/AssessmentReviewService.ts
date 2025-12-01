import ApiService from '@services/ApiService';
import { AssessmentReview, AssessmentReviewResponse } from '@app/types/common/assessmentReview';

export async function fetchAssessmentReview(contentId:number): Promise<AssessmentReview> {
    try {
        const response = await ApiService.fetchDataWithAxios< AssessmentReviewResponse>({
            url: `/assessment-review/${contentId}`,
            method: 'get',
            
        });
        return response?.data?.assessment_review;
    } catch (error) {
        throw error as string;
    }
}
