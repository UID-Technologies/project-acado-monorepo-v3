import ApiService from '@services/ApiService';
import {ReelsListResponse ,ReelsList} from '@app/types/learner/reels';

export async function fetchReels(): Promise<ReelsList[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<ReelsListResponse>({
            url: `/reels?from=1&count=20`,
            method: 'get'
        });
        return response?.data?.list??[];
    } catch (error) {
        throw error as string;
    }
}


export async function likeReel(reelId: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/user-view-tracking`,
            method: 'post',
            data: {
                type: 'contents',
                content_id: reelId.toString(),
                like: '1'
            }
        });
    } catch (error) {
        throw new Error(`Failed to like reel: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function unlikeReel(reelId: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/user-view-tracking`,
            method: 'post',
            data: {
                type: 'contents',
                content_id: reelId.toString(),
                like: '0'
            }
        });
    } catch (error) {
        throw new Error(`Failed to unlike reel: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}


export async function incrementViewCount(reelId: number): Promise<void> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/user-view-tracking`,
            method: 'post',
            data: {
                type: 'contents',
                content_id: reelId.toString()
            }
        });
    } catch (error) {
        throw new Error(`Failed to increment view count: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
