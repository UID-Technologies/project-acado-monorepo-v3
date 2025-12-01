import ApiService from '@services/ApiService'
import { AssessmentDetail, AssessmentResponse } from '@app/types/learner/assignmentDetails'

export async function fetchAssignmentDetails(program_content_id: number): Promise<AssessmentDetail> {
    try {
        const response = await ApiService.fetchDataWithAxios<AssessmentResponse>({
            url: `/assignmentdetails/${program_content_id}`,
            method: 'get',
        })
        return response?.data?.assessment_details[0];
    } catch (error) {
        throw error as string;
    }
}
