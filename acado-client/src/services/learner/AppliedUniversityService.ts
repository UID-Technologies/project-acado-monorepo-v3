import ApiService from '@services/ApiService'
import { AppliedUniversityData, AppliedUniversityListResponse } from '@app/types/learner/appliedUniversityList'

export async function fetchAppliedUniversities(): Promise<AppliedUniversityData[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AppliedUniversityListResponse>({
            url: '/applied-university',
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}
