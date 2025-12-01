import ApiService from '@services/ApiService';
import { Mentor, MentorApiResponse } from '@app/types/learner/mentor';

export async function fetchMentorList(): Promise<Array<Mentor>> {
    try {
        const response = await ApiService.fetchDataWithAxios<MentorApiResponse>({
            url: '/get-mentor-list',
            method: 'post',
        });

        return response?.data || [];
    } catch (error) {
        throw error as string;
    }
}
