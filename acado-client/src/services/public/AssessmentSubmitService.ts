import ApiService from '@services/ApiService';
import { AssessmentSubmitResponse } from '@app/types/common/assessmentSubmit';

export async function fetchAssessmentSubmit(program_content_id: number): Promise<AssessmentSubmitResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<AssessmentSubmitResponse>({
            url: `assessment-submit`,
            method: 'post',
            data: {
                content_id: program_content_id
            }
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}
