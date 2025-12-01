import ApiService from '@services/ApiService'
import {AssignmentList,AssignmentResponse} from '@app/types/learner/assignmentList'

export async function fetchAssignmentList(program_content_id:number): Promise<AssignmentList[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AssignmentResponse>({
            url: `/assignment/${program_content_id}`,
            method: 'get',
        })
        return response.data.list
    } catch (error) {
        throw error as string;
    }
}
