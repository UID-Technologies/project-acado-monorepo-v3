import { University, UniversityDetailsResponse, UniversityResponse } from '@app/types/elms/university';
import ApiService from '@services/ApiService'
import { Course, CourseApiResponse } from '@app/types/elms/course'

export async function fetchUniversities(): Promise<University[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<UniversityResponse>({
            url: 'university-list',
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchUniversityById(universityId: string): Promise<University> {
    try {
        const response = await ApiService.fetchDataWithAxios<UniversityDetailsResponse>({
            url: `get-university-meta/${universityId}`,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchUniversityCourses(universityId?: number | null): Promise<Course[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CourseApiResponse>({
            url: `/v1/free-courses${universityId ? `?org_id=${universityId}` : ''}`,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}
