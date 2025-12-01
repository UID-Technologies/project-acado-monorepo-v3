import ApiService from '@services/ApiService'
import { Community, CommunityApiResponse, CommunityDetailsResponse, CommunityDetailsList } from '@app/types/common/community'

export async function fetchCommunity(): Promise<Community[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunityApiResponse>({
            url: '/user-joy-category',
            method: 'post',
        })
        return response?.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchCommunityById(id: string): Promise<CommunityDetailsList> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunityDetailsResponse>({
            url: `/joy/content?category_id=${id}`,
            method: 'get',
        })
        return response?.data
    } catch (error) {
        throw error as string;
    }
}
