
import ApiService from '@services/ApiService';
import { Program, ProgramResponse } from '@app/types/learner/internship';

export async function fetchInternship(): Promise<Program[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<ProgramResponse>({
            url: '/job-list-wow',
            method: 'get',
        });


        return response.data ?? [];
    } catch (error) {
        throw error as string;
    }
}

