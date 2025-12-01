import ApiService from '@services/ApiService';
import { ProgramApiResponse, Program } from '@app/types/learner/programList';

export async function fetchProgramList(): Promise<Array<Program>> {
    try {
        const response = await ApiService.fetchDataWithAxios<ProgramApiResponse>({
            url: '/learner/programs',
            method: 'get',
        });
        return response?.data?.list || [];
    } catch (error) {
        throw error as string;
    }
}
