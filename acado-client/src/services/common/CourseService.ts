import ApiService from '@services/ApiService'
import { CoursesResponse, Courses } from '@app/types/common/courses';

export async function fetchLmsCourseMeta(course_id: string): Promise<Courses> {
    try {
        const response = await ApiService.fetchDataWithAxios<CoursesResponse>({
            url: '/get-course-meta',
            method: 'post',
            data: {
                program_id: course_id,
            }
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}
