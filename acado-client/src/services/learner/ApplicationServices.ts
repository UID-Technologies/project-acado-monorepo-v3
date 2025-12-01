import ApiService from '@services/ApiService';
import { ApplicationData, Data } from '@app/types/learner/application';

export async function fetchApplication(): Promise<Data> {
    try {
        const response = await ApiService.fetchDataWithAxios<ApplicationData>({
            url: '/application-dashboard',
            method: 'get',
        });
        console.log('API response:', response);
        if (response.data) {
            return response.data;
        } else {
            throw new Error('Application data is not available');
        }
    } catch (error: any) {
        console.error('Error details:', error?.response || error?.message || error);
        throw new Error('Failed to fetch application');
    }
}
