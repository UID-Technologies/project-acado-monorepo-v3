import ApiService from '@services/ApiService';
import { DashboardResponse } from '@app/types/learner/dasboard';

export async function fetchDadhboard(): Promise<DashboardResponse> {
    try {
        const response = await ApiService.fetchDataWithAxios<DashboardResponse>({
            url: '/g-dashboard',
            method: 'post',
        });

        return response;
    } catch (error) {
        throw error as string;
    }
}
