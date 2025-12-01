import ApiService from '@services/ApiService'
import { Post, PostsData, BlogDetailResponse } from '@app/types/learner/post'

export async function fetchBlogs(): Promise<Post[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<PostsData>({
            url: '/get-post?post_type=blog',
            method: 'post',
        })
        return response.data.post;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchPostDetail(id: string): Promise<Post> {
    try {
        const response = await ApiService.fetchDataWithAxios<BlogDetailResponse>({
            url: `/joy/contents/${id}`,
            method: 'get',
        })
        return response?.data?.list[0] || null;
    } catch (error) {
        throw error as string;
    }
}
