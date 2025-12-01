import ApiService from '@services/ApiService';
import {SelfAssessmentResponse ,AssessmentList} from '@app/types/common/selfAssessment';

export async function fetchSelfAssessment(category_id: any): Promise<AssessmentList[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<SelfAssessmentResponse>({
            url: `/joy/content?category_id=${category_id}&content_type=15`,
            method: 'get'
        });
        return response?.data?.list??[];
    } catch (error) {
        throw error as string;
    }
}
