import ApiService from '@services/ApiService';
import { CourseDetails, CourseMetaResponse } from '@app/types/common/university';

export async function fetchAppliedCourseList(): Promise<CourseDetails[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CourseMetaResponse>({
            url: '/applied-course?limit=10000',
            method: 'get',
        });
        return response.data
    } catch (error) {
        throw error as string;
    }
}
