// src/api/courseLevels.api.ts
import axiosInstance from '@/lib/axios';
import { CourseLevel } from '@/types/courseLevel';

export interface UpsertCourseLevelPayload {
  name: string;
  shortName: string;
  description?: string;
  keywords?: string;
  isActive?: boolean;
}

export const courseLevelsApi = {
  async list(params?: { includeInactive?: boolean }) {
    const response = await axiosInstance.get<CourseLevel[]>('/course-levels', { params });
    return response.data;
  },

  async get(id: string) {
    const response = await axiosInstance.get<CourseLevel>(`/course-levels/${id}`);
    return response.data;
  },

  async create(payload: UpsertCourseLevelPayload) {
    const response = await axiosInstance.post<CourseLevel>('/course-levels', payload);
    return response.data;
  },

  async update(id: string, payload: Partial<UpsertCourseLevelPayload>) {
    const response = await axiosInstance.put<CourseLevel>(`/course-levels/${id}`, payload);
    return response.data;
  },

  async remove(id: string) {
    await axiosInstance.delete(`/course-levels/${id}`);
  },
};


