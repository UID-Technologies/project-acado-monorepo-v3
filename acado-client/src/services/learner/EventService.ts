import ApiService from '@services/ApiService'
import { Event, EventData, ContentDataResponse, ContentData } from '@app/types/learner/events'

export async function fetchEvent(type?: string): Promise<Event[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventData>({
            url: `/competition-list`,
            method: 'get',
            params: type ? { type } : {}
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchSchlorship(): Promise<Event[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventData>({
            url: '/competition-list?type=scholarship',
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

// export async function fetchSchlorshipPublic(): Promise<Event[]> {
//     try {
//         const response = await ApiService.fetchDataWithAxios<EventData>({
//             url: '/get-competitons?type=scholarship',
//             method: 'get',
//         })
//         return response.data
//     } catch (error) {
//         throw error as string;
//     }
// }

export async function fetchVolunteering(): Promise<Event[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventData>({
            url: '/competition-list?type=volunteering',
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}



// get event content by id
export async function fetchEventActivityContentById(id: string): Promise<ContentData> {
    try {
        const response = await ApiService.fetchDataWithAxios<ContentDataResponse>({
            url: `/learner/content/${id}`,
            method: 'get',
        })
        return response?.data?.list || {} as ContentData;
    } catch (error) {
        throw error as string;
    }
}
