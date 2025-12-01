import { EventApiResponse, Event, EventDetails, EventDetailsResponse, EventCategoryGroupApiResponse, EventCategoryGroups, EventCategoryApiResponse, EventCategory } from '@app/types/collaborate/events';
import ApiService from '@services/ApiService';

export async function fetchEvents(params?: URLSearchParams | null): Promise<Event[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventApiResponse>({
            url: '/competition-list',
            method: 'get',
            params: params
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

export async function fetchPublicEvents(params?: URLSearchParams | null): Promise<Event[]> {
    try {
        console.log("fetchPublicEvents params:", params);
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
    try {
        const response = await ApiService.fetchDataWithAxios<EventDetailsResponse>({
            url: `competitins-details/${id}`,
            method: 'get'
        });
        return response.data;
    } catch (error) {
        throw error as string;
    }
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
        throw error as string;
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
        throw error as string;
    }
}
