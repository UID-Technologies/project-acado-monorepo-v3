import ApiService from '@services/ApiService'
import { Organization, OrganizationResponse, Course, CourseData, AppliedUniversityResponse, UniversityDetails, UniversityDetailsResponse } from '@app/types/common/university'

export async function fetchUniversities(): Promise<Organization[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<OrganizationResponse>({
            url: 'university-list',
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchUniversityById(universityId: string): Promise<UniversityDetails> {
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

export async function fetchCoursesByUniversityId(universityId?: string, query?: string): Promise<Course[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<CourseData>({
            url: universityId ? `wp/university/${universityId}/courses${query ? '?' + query : ''}` : `wp/courses${query ? '?' + query : ''}`,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}



export async function addUserInUniversity(universityId: number[]): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<any>({
            url: `user-university-save`,
            method: 'post',
            data: {
                organisation_ids: universityId
            }
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function appliedUserUniversity(): Promise<number[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<AppliedUniversityResponse>({
            url: `/user-university-mapped`,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}
