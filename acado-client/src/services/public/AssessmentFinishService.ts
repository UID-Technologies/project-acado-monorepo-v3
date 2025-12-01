import ApiService from '@services/ApiService';
import { AssessmentOnFinishResponse } from '@app/types/common/assessmentOnFinish';

export async function fetchAssessmentFinish(content_id: any): Promise<AssessmentOnFinishResponse> {
    try {
        const formData = new FormData();
        formData.append('content_id', content_id);

        const response = await ApiService.fetchDataWithAxios<AssessmentOnFinishResponse>({
            url: `/assessment-onfinish`,
            method: 'post',
            data: formData as any,
           
        });
        return response;
    } catch (error) {
        throw error as string;
    }
}
