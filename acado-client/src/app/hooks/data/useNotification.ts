import { useQuery } from "@tanstack/react-query";
import { fetchNotificationList } from "@services/learner/NotificationsServices";
import { Notification } from "@app/types/learner/notification";

export const useNotifications = (params?: URLSearchParams | null) => {
    const queryKey = ['notifications', params ? params.toString() : ''];
    return useQuery<Array<Notification>>({
        queryKey: queryKey,
        queryFn: async () => {
            params?.append('type', 'notification');
            const res = await fetchNotificationList();
            return res ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
