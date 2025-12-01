import ApiService from '@services/ApiService'
import { EventDetailsResponse, EventDetails } from '@app/types/learner/events'

export async function fetchEventDetails(event_id: string): Promise<EventDetails> {
    try {
        const response = await ApiService.fetchDataWithAxios<EventDetailsResponse>({
            url: '/learner-competition-detail/' + event_id,
            method: 'get',
        })
        return response.data
    } catch (error) {
        throw error as string;
    }
}

