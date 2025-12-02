import { EventApiResponse, Event, EventDetails, EventDetailsResponse, EventCategoryGroupApiResponse, EventCategoryGroups, EventCategoryApiResponse, EventCategory } from '@app/types/collaborate/events';
import ApiService from '@services/ApiService';
import { adaptEventsArrayToLegacy, adaptEventsResponse, adaptEventDetailsResponse } from '@/utils/eventResponseAdapter';

export async function fetchEvents(params?: URLSearchParams | null): Promise<Event[]> {
    try {
        // Use new events endpoint from acado-api
        const response = await ApiService.fetchDataWithAxios<any>({
            url: '/events',
            method: 'get',
            params: params
        });
        
        // Adapt response to legacy format
        const adapted = adaptEventsResponse(response);
        return adapted?.data || adapted || [];
    } catch (error) {
        // Fallback to legacy endpoint if new API fails
        try {
            const response = await ApiService.fetchDataWithAxios<EventApiResponse>({
                url: '/competition-list',
                method: 'get',
                params: params
            });
            return response.data;
        } catch (fallbackError) {
            throw error as string;
        }
    }
}

export async function fetchPublicEvents(params?: URLSearchParams | null): Promise<Event[]> {
    try {
        console.log("fetchPublicEvents params:", params);
        
        // Check the type parameter
        const type = params?.get('type');
        
        if (type === 'scholarship') {
            // Use new scholarship endpoint from acado-api
            const response = await ApiService.fetchDataWithAxios<any>({
                url: '/scholarships',
                method: 'get',
                params: params
            });
            return response?.data || response || [];
        }
        
        if (type === 'event' || !type) {
            // Use new events endpoint from acado-api
            const response = await ApiService.fetchDataWithAxios<any>({
                url: '/events',
                method: 'get',
                params: params
            });
            
            // Adapt response to legacy format
            const adapted = adaptEventsResponse(response);
            return adapted?.data || adapted || [];
        }
        
        // For other types (volunteering, etc.), use legacy endpoint
        const response = await ApiService.fetchDataWithAxios<EventApiResponse>({
            url: '/get-competitons',
            method: 'get',
            params: params
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchEventById(id: string | undefined): Promise<EventDetails> {
    if (!id) throw new Error("ID is required");
    
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
            
            console.log(`✅ Got response from ${endpoint.name}:`, response);
            
            // For legacy endpoint, return response.data
            if (endpoint.isLegacy) {
                return response.data;
            }
            
            // For new API endpoints, adapt the response to legacy format
            const adapted = adaptEventDetailsResponse(response);
            console.log('✅ Adapted event details:', adapted);
            return adapted;
        } catch (error) {
            console.log(`❌ ${endpoint.name} endpoint failed:`, error);
            // Continue to next endpoint
            if (endpoint === endpoints[endpoints.length - 1]) {
                // If all endpoints failed, throw the error
                throw error;
            }
        }
    }
    
    throw new Error("Failed to fetch event details from all endpoints");
}

export async function fetchInternshipApply(id: string): Promise<EventDetails> {
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

export async function fetchEventCategoryGroups(): Promise<Array<EventCategoryGroups>> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventCategoryGroupApiResponse>({
            url: '/v1/event-category-group',
            method: 'get'
        });
        return response?.data;
    } catch (error) {
        // Event category groups endpoint doesn't exist in acado-api yet
        // Return empty array instead of throwing error
        console.warn('Event category groups endpoint not available, returning empty array');
        return [];
    }
}

export async function fetchEventCategory(): Promise<Array<EventCategory>> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventCategoryApiResponse>({
            url: '/event-category',
            method: 'get'
        });
        return response?.data;
    } catch (error) {
        // Event category endpoint doesn't exist in acado-api yet
        // Return empty array instead of throwing error
        console.warn('Event category endpoint not available, returning empty array');
        return [];
    }
}
