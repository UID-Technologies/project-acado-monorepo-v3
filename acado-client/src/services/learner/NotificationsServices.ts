import { NotificationApiResponse } from "@app/types/learner/notification";
import ApiService from "../ApiService";

export async function fetchNotificationList(): Promise<Notification[]> {
    try {
        const response = await ApiService.fetchDataWithAxios<NotificationApiResponse>({
            url: `/joy/notifications`,
            method: 'get'
        });
        return response?.data?.list;
    } catch (error) {
        throw error as string;
    }
}
