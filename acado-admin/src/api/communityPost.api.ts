// src/api/communityPost.api.ts
import axiosInstance from '@/lib/axios';
import type { CommunityPost, CommunityCategory } from '@/types/communityPost';

export interface CommunityCategoryListResponse {
  data: CommunityCategory[];
}

export interface CommunityPostListResponse {
  data: CommunityPost[];
}

export const communityPostApi = {
  // Category operations
  listCategories: async (): Promise<CommunityCategory[]> => {
    const response = await axiosInstance.get<CommunityCategory[]>('/community-posts/categories');
    return response.data;
  },

  getCategoryById: async (id: string): Promise<CommunityCategory> => {
    const response = await axiosInstance.get<CommunityCategory>(`/community-posts/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: Omit<CommunityCategory, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<CommunityCategory> => {
    const response = await axiosInstance.post<CommunityCategory>('/community-posts/categories', data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<Omit<CommunityCategory, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>): Promise<CommunityCategory> => {
    const response = await axiosInstance.put<CommunityCategory>(`/community-posts/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/community-posts/categories/${id}`);
  },

  // Post operations
  list: async (params?: { categoryId?: string; contentType?: string; isPinned?: boolean; search?: string }): Promise<CommunityPost[]> => {
    const response = await axiosInstance.get<CommunityPost[]>('/community-posts', { params });
    return response.data;
  },

  getById: async (id: string): Promise<CommunityPost> => {
    const response = await axiosInstance.get<CommunityPost>(`/community-posts/${id}`);
    return response.data;
  },

  create: async (data: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<CommunityPost> => {
    const response = await axiosInstance.post<CommunityPost>('/community-posts', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>): Promise<CommunityPost> => {
    const response = await axiosInstance.put<CommunityPost>(`/community-posts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/community-posts/${id}`);
  },
};

