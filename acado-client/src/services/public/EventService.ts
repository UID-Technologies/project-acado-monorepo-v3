import ApiService from '@services/ApiService';
import { ApiResponse, Event, EventDetailsResponse, EventDetailsData } from '@app/types/public/event';
import { adaptEventsArrayToLegacy, adaptEventsResponse, adaptEventDetailsResponse } from '@/utils/eventResponseAdapter';

export async function fetchEvents(type?: string): Promise<Event[]> {
    try {
        // If fetching scholarships, use new acado-api endpoint
        if (type === 'scholarship') {
            const response = await ApiService.fetchDataWithAxios<any>({
                url: 'scholarships',
                method: 'get'
            });
            return response?.data || response || [];
        }
        
        // If fetching events, use new acado-api endpoint
        if (type === 'event') {
            const response = await ApiService.fetchDataWithAxios<any>({
                url: 'events',
                method: 'get'
            });
            
            // Adapt response to legacy format
            const adapted = adaptEventsResponse(response);
            return adapted?.data || adapted || [];
        }
        
        // For other types (volunteering, etc.), use legacy endpoint
        const response = await ApiService.fetchDataWithAxios<ApiResponse>({
            url: `get-competitons${type ? `?type=${type}` : ''}`,
            method: 'get'
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchVolunteeringEvents(): Promise<Event[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<ApiResponse>({
            url: 'get-competitons?type=volunteering',
            method: 'get'
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}

export async function fetchEventById(id: string): Promise<EventDetailsData> {
    // Try multiple endpoints in order: events → scholarships → legacy
    const endpoints = [
        { url: `events/${id}`, name: 'events' },
        { url: `scholarships/${id}`, name: 'scholarships' },
        { url: `competitins-details/${id}`, name: 'legacy', isLegacy: true }
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`🔍 Trying endpoint: ${endpoint.url}`);
            const response = await ApiService.fetchDataWithAxios<any>({
                url: endpoint.url,
                method: 'get'
            });
            
            console.log(`✅ Got response from ${endpoint.name}`);
            
            // For legacy endpoint, return response.data
            if (endpoint.isLegacy) {
                return response.data;
            }
            
            // For new API endpoints, adapt the response to legacy format
            const adapted = adaptEventDetailsResponse(response);
            console.log('✅ Adapted event details');
            return adapted;
        } catch (error) {
            console.log(`❌ ${endpoint.name} endpoint failed`);
            // Continue to next endpoint
            if (endpoint === endpoints[endpoints.length - 1]) {
                // If all endpoints failed, throw the error
                throw error;
            }
        }
    }
    
    throw new Error("Failed to fetch event details from all endpoints");
}

export async function fetchEventApply(id: string): Promise<EventDetailsData> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventDetailsResponse>({
            url: `learner-competition-detail/${id}`,
            method: 'get'
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}


export async function fetchInternshipApply(id: string): Promise<EventDetailsData> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventDetailsResponse>({
            url: `learner-competition-detail/${id}?is_applied=1`,
            method: 'get'
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
}
