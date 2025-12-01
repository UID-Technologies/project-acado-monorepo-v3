import ApiService from '@services/ApiService'
import { AssessmentResponse } from '@app/types/learner/assignmentDetails'

export async function fetchAssignmentSubmissionList(formData: FormData) {
    try {
        await ApiService.fetchDataWithAxios<AssessmentResponse>({
            url: `/assignmentsubmit`,
            method: 'post',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: formData as any,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    } catch (error) {
        throw error as string;
    }
}
