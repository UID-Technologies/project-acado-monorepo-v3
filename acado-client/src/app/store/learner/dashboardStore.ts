import { Dashboard, DashboardResponse } from '@app/types/learner/dasboard';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type DashboardState = {
    dashboard?: DashboardResponse,
    setDashboard: (dashboard: DashboardResponse) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
};

export const useDashboardStore = create<DashboardState>()(
    persist(
        (set) => ({
            setDashboard: (dashboard: DashboardResponse) => set({ dashboard }),
            isLoading: false,
            setIsLoading: (isLoading: boolean) => set({ isLoading }),
            error: null,
            setError: (error: string | null) => set({ error }),
        }),
        {
            name: 'dashboardStore',
            storage: {
                getItem: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
                setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        }
    )
);
