import ApiService from '@services/ApiService'
import { Course, CourseData } from '@app/types/common/university';

export async function fetchEnrolledUniversity(query?: string): Promise<Course[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CourseData>({
            url: `/applied-university-course${query ? query : ''}`,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}


// applied-course
