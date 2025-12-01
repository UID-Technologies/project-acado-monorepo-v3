// src/api/reel.api.ts
import axiosInstance from '@/lib/axios';
import type { Reel } from '@/types/reel';

export interface ReelListResponse {
  data: Reel[];
}

export const reelApi = {
  // Get all reels
  list: async (params?: { status?: string; visibility?: string; category?: string; search?: string }): Promise<Reel[]> => {
    const response = await axiosInstance.get<Reel[]>('/reels', { params });
    return response.data;
  },

  // Get a single reel by ID
  getById: async (id: string): Promise<Reel> => {
    const response = await axiosInstance.get<Reel>(`/reels/${id}`);
    return response.data;
  },

  // Create a new reel
  create: async (data: Omit<Reel, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'views' | 'likes' | 'publishedAt'>): Promise<Reel> => {
    const response = await axiosInstance.post<Reel>('/reels', data);
    return response.data;
  },

  // Update an existing reel
  update: async (id: string, data: Partial<Omit<Reel, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'views' | 'likes'>>): Promise<Reel> => {
    const response = await axiosInstance.put<Reel>(`/reels/${id}`, data);
    return response.data;
  },

  // Delete a reel
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/reels/${id}`);
  },

  // Increment views
  incrementViews: async (id: string): Promise<Reel> => {
    const response = await axiosInstance.post<Reel>(`/reels/${id}/views`);
    return response.data;
  },

  // Increment likes
  incrementLikes: async (id: string): Promise<Reel> => {
    const response = await axiosInstance.post<Reel>(`/reels/${id}/likes`);
    return response.data;
  },
};

