import { University, UniversityDetailsResponse, UniversityResponse } from '@app/types/elms/university';
import ApiService from '@services/ApiService'
import { Course, CourseApiResponse } from '@app/types/elms/course'
import { adaptListResponse } from '@/utils/apiResponseAdapter';

export async function fetchUniversities(): Promise<University[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: 'universities', // Updated from 'university-list' to 'universities'
            method: 'get',
        })
        // Adapt response to handle both legacy and new API formats
        return adaptListResponse<University>(response);
    } catch (error) {
        throw error as string;
    }
}

export async function fetchUniversityById(universityId: string): Promise<University> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: `universities/${universityId}`, // Updated from 'get-university-meta/:id' to 'universities/:id'
            method: 'get',
        })
        // Handle both { data: {...} } and direct object responses
        return response?.data || response;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchUniversityCourses(universityId?: number | null): Promise<Course[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: universityId 
                ? `universities/${universityId}/courses` // Updated to use REST endpoint
                : 'courses', // Fallback to all courses if no universityId
            method: 'get',
        })
        // Adapt response to handle both legacy and new API formats
        return adaptListResponse<Course>(response);
    } catch (error) {
        throw error as string;
    }
}
