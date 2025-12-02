import ApiService from '@services/ApiService'
import { Event, EventData, ContentDataResponse, ContentData } from '@app/types/learner/events'
import { adaptEventsArrayToLegacy, adaptEventsResponse } from '@/utils/eventResponseAdapter';

export async function fetchEvent(type?: string): Promise<Event[]> {
    try {
        // If fetching events, use new acado-api endpoint
        if (type === 'event' || !type) {
            const response = await ApiService.fetchDataWithAxios<any>({
                url: '/events',
                method: 'get',
            });
            
            // Adapt response to legacy format
            const adapted = adaptEventsResponse(response);
            return adapted?.data || adapted || [];
        }
        
        // For other types (volunteering, etc.), use legacy endpoint
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
        // Use new scholarship endpoint from acado-api
        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/scholarships',
            method: 'get',
        })
        // Adapt response - acado-api returns { success: true, data: [...] }
        return response?.data || response || [];
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
