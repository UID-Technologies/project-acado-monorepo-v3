import ApiService from '@services/ApiService'
import { Community, CommunityApiResponse, CommunityDetailsResponse, CommunityDetailsList } from '@app/types/common/community'
import { adaptCommunityCategoriesResponse } from '@/utils/communityResponseAdapter';

export async function fetchCommunity(): Promise<Community[]> {
    try {
        // Use new community-posts/categories endpoint
        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/community-posts/categories',
            method: 'get',
        });
        
        // Adapt response to legacy format
        const adapted = adaptCommunityCategoriesResponse(response);
        return adapted?.data || adapted || [];
    } catch (error) {
        // Fallback to legacy endpoint if new API fails
        try {
            const response = await ApiService.fetchDataWithAxios<CommunityApiResponse>({
                url: '/user-joy-category',
                method: 'post',
            });
            return response?.data;
        } catch (fallbackError) {
            throw error as string;
        }
    }
}

export async function fetchCommunityById(id: string): Promise<CommunityDetailsList> {
    try {
        // Hybrid approach: Get category from new API, posts from legacy (for social features)
        const categoryResponse = await ApiService.fetchDataWithAxios<any>({
            url: `/community-posts/categories/${id}`,
            method: 'get',
        });
        
        // Get posts with social features from legacy
        const postsResponse = await ApiService.fetchDataWithAxios<CommunityDetailsResponse>({
            url: `/joy/content?category_id=${id}`,
            method: 'get',
        });
        
        // Combine: category from new API, posts from legacy
        return {
            category: postsResponse?.data?.category || categoryResponse?.data || categoryResponse,
            list: postsResponse?.data?.list || []
        } as CommunityDetailsList;
    } catch (error) {
        // Fallback to full legacy endpoint
        try {
            const response = await ApiService.fetchDataWithAxios<CommunityDetailsResponse>({
                url: `/joy/content?category_id=${id}`,
                method: 'get',
            });
            return response?.data;
        } catch (fallbackError) {
            throw error as string;
        }
    }
}
