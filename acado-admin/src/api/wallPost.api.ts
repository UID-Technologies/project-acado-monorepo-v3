// src/api/wallPost.api.ts
import axiosInstance from '@/lib/axios';
import type { WallPost } from '@/types/wallPost';

export interface WallPostListResponse {
  data: WallPost[];
}

export interface WallPostResponse {
  data: WallPost;
}

export const wallPostApi = {
  // Get all wall posts
  list: async (params?: { createdBy?: string; search?: string }): Promise<WallPost[]> => {
    const response = await axiosInstance.get<WallPost[]>('/wall-posts', { params });
    return response.data;
  },

  // Get a single wall post by ID
  getById: async (id: string): Promise<WallPost> => {
    const response = await axiosInstance.get<WallPost>(`/wall-posts/${id}`);
    return response.data;
  },

  // Create a new wall post
  create: async (data: Omit<WallPost, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<WallPost> => {
    const response = await axiosInstance.post<WallPost>('/wall-posts', data);
    return response.data;
  },

  // Update an existing wall post
  update: async (id: string, data: Partial<Omit<WallPost, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>): Promise<WallPost> => {
    const response = await axiosInstance.put<WallPost>(`/wall-posts/${id}`, data);
    return response.data;
  },

  // Delete a wall post
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/wall-posts/${id}`);
  },
};

