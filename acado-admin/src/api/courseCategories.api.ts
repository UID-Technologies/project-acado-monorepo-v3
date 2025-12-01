// src/api/courseCategories.api.ts
import axiosInstance from '@/lib/axios';
import { CourseCategory } from '@/types/courseCategory';

export interface UpsertCourseCategoryPayload {
  name: string;
  shortName: string;
  code?: string;
  parentId?: string | null;
  description?: string;
  keywords?: string;
  isActive?: boolean;
}

export const courseCategoriesApi = {
  async list(params?: { parentId?: string; includeInactive?: boolean }) {
    const response = await axiosInstance.get<CourseCategory[]>('/course-categories', { params });
    return response.data;
  },

  async get(id: string) {
    const response = await axiosInstance.get<CourseCategory>(`/course-categories/${id}`);
    return response.data;
  },

  async create(payload: UpsertCourseCategoryPayload) {
    const response = await axiosInstance.post<CourseCategory>('/course-categories', payload);
    return response.data;
  },

  async update(id: string, payload: Partial<UpsertCourseCategoryPayload>) {
    const response = await axiosInstance.put<CourseCategory>(`/course-categories/${id}`, payload);
    return response.data;
  },

  async remove(id: string) {
    await axiosInstance.delete(`/course-categories/${id}`);
  },
};


