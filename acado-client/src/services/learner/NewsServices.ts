import ApiService from '@services/ApiService'
import { Post, CommunityData } from '@app/types/learner/community'

export async function fetchNews(): Promise<Post[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CommunityData>({
            url: '/get-post?post_type=news',
            method: 'post',
        })
        return response.data.post;
    } catch (error) {
        throw error as string;
    }
}


