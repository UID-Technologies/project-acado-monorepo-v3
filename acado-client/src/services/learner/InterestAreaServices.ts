import ApiService from '@services/ApiService'
import { InterestArea, InterestAreaData } from '@app/types/learner/interest'

export async function changeStatusofUserInterestArea(): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<InterestAreaData>({
            url: '/user-interete-saved',
            method: 'post',
            data: {
                interest_value: "1"
            }
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}


export async function fetchInterestArea(): Promise<InterestArea[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<InterestAreaData>({
            url: '/get-course-category',
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function saveUserInterestArea(interestArea: number[]): Promise<any> {
    try {
        const response = await ApiService.fetchDataWithAxios<InterestAreaData>({
            url: '/user-course-category-map',
            method: 'post',
            data: {
                category_ids: interestArea
            },
        })

        return response.data

    } catch (error) {
        throw error as string;
    }
}

// get-interest-skill
// get-course-category
