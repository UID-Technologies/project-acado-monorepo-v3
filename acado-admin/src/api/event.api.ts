// src/api/event.api.ts
import axiosInstance from '@/lib/axios';
import type { Event } from '@/types/event';

export interface EventListResponse {
  data: Event[];
}

export const eventApi = {
  // Get all events
  list: async (params?: { status?: string; mode?: string; difficultyLevel?: string; subscriptionType?: string; isPopular?: boolean; search?: string }): Promise<Event[]> => {
    const response = await axiosInstance.get<Event[]>('/events', { params });
    return response.data;
  },

  // Get a single event by ID
  getById: async (id: string): Promise<Event> => {
    const response = await axiosInstance.get<Event>(`/events/${id}`);
    return response.data;
  },

  // Create a new event
  create: async (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'publishedAt' | 'registrations' | 'views' | 'completions'>): Promise<Event> => {
    const response = await axiosInstance.post<Event>('/events', data);
    return response.data;
  },

  // Update an existing event
  update: async (id: string, data: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'publishedAt' | 'registrations' | 'views' | 'completions'>>): Promise<Event> => {
    const response = await axiosInstance.put<Event>(`/events/${id}`, data);
    return response.data;
  },

  // Delete an event
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/events/${id}`);
  },

  // Increment views
  incrementViews: async (id: string): Promise<Event> => {
    const response = await axiosInstance.post<Event>(`/events/${id}/views`);
    return response.data;
  },

  // Increment registrations
  incrementRegistrations: async (id: string): Promise<Event> => {
    const response = await axiosInstance.post<Event>(`/events/${id}/registrations`);
    return response.data;
  },
};

