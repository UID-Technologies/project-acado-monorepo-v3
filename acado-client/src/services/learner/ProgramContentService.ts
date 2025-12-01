import ApiService from '@services/ApiService'
import { ContentResponseData, ProgramContentResponse, ProgramModule } from '@app/types/learner/programContent'

export async function fetchProgramContent(moduleId: string): Promise<ProgramModule[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<ProgramContentResponse>({
            url: `learner/programs/modules/${moduleId}/0`,
            method: 'get',
        })
        return response.data.list;
    } catch (error) {
        throw error as string;
    }
}
