import ApiService from '@services/ApiService'
import {ModuleListResponse,ModuleList, ModuleData} from '@app/types/learner/courseModule'

export async function fetchCourseModule(programId: number): Promise<ModuleData> {
    try {
        const response = await ApiService.fetchDataWithAxios<ModuleListResponse>({
            url: `/learner/programs/${programId}`,
            method: 'get',
        })
        return response?.data;
    } catch (error) {
        throw error as string;
    }
}
