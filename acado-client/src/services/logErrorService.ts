import ApiService from '@services/ApiService'
import { errorRequest, errorResponse, errors } from '@app/types/errorTypes'


export async function saveErrorLog(errors: any): Promise<string> {
    try {
        const response = await ApiService.fetchDataWithAxios<errorResponse>({
            url: '/save-error-report',
            method: 'post',
            data: errors,
        })
        return response.data;
    } catch (error) {
        throw error as string;
    }
}
