// src/api/scholarship.api.ts
import axiosInstance from '@/lib/axios';
import type { Scholarship } from '@/types/scholarship';

export interface ScholarshipListResponse {
  data: Scholarship[];
}

export const scholarshipApi = {
  // Get all scholarships
  list: async (params?: { status?: string; visibility?: string; type?: string; studyLevel?: string; search?: string }): Promise<Scholarship[]> => {
    const response = await axiosInstance.get<Scholarship[]>('/scholarships', { params });
    return response.data;
  },

  // Get a single scholarship by ID
  getById: async (id: string): Promise<Scholarship> => {
    const response = await axiosInstance.get<Scholarship>(`/scholarships/${id}`);
    return response.data;
  },

  // Create a new scholarship
  create: async (data: Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'publishedAt' | 'views' | 'applications' | 'shortlisted' | 'awarded'>): Promise<Scholarship> => {
    const response = await axiosInstance.post<Scholarship>('/scholarships', data);
    return response.data;
  },

  // Update an existing scholarship
  update: async (id: string, data: Partial<Omit<Scholarship, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'publishedAt' | 'views' | 'applications' | 'shortlisted' | 'awarded'>>): Promise<Scholarship> => {
    const response = await axiosInstance.put<Scholarship>(`/scholarships/${id}`, data);
    return response.data;
  },

  // Delete a scholarship
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/scholarships/${id}`);
  },

  // Increment views
  incrementViews: async (id: string): Promise<Scholarship> => {
    const response = await axiosInstance.post<Scholarship>(`/scholarships/${id}/views`);
    return response.data;
  },

  // Increment applications
  incrementApplications: async (id: string): Promise<Scholarship> => {
    const response = await axiosInstance.post<Scholarship>(`/scholarships/${id}/applications`);
    return response.data;
  },
};

