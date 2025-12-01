
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CourseCategory } from '@app/types/public/courseCategory';
import { NotificationData } from '@app/types/learner/notification';

type NotificationsState = {
    notification: NotificationData[];
    setNotification: (notification: NotificationData[]) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useNotificationStore = create<NotificationsState>()(
    persist(
        (set) => ({
            notification: [],
            setNotification: (notification: NotificationData[]) => set({ notification }),
            loading: false,
            setLoading: (loading: boolean) => set({ loading }),
            error: null,
            setError: (error: string | null) => set({ error }),
          
           
        }),
        {
            name: 'notificationStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            }
        }
    )
);
