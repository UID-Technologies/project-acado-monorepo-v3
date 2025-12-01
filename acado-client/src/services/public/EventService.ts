import ApiService from '@services/ApiService';
import { ApiResponse, Event, EventDetailsResponse, EventDetailsData } from '@app/types/public/event';

export async function fetchEvents(type?: string): Promise<Event[]> {
    try {
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
