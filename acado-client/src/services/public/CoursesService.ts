import ApiService from '@services/ApiService'
import { Course, CourseData, CourseDetails, CourseDetailsResponse } from '@app/types/common/university'
import { CourseCategory, CourseCategoryResponse } from '@app/types/public/courseCategory';
import { adaptListResponse } from '@/utils/apiResponseAdapter';

export async function fetchCourses(): Promise<Course[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CourseData>({
            url: 'wp/courses/',
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchCourseById(course_id: string): Promise<CourseDetails> {
    try {
        const response = await ApiService.fetchDataWithAxios<CourseDetailsResponse>({
            url: 'wp/courses/' + course_id,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}


export async function fetchCoursesCategory(): Promise<CourseCategory[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: 'course-categories', // Updated from 'get-course-category' to 'course-categories'
            method: 'get',
        })
        // Adapt response to handle both legacy and new API formats
        return adaptListResponse<CourseCategory>(response);
    } catch (error) {
        throw error as string;
    }
}
