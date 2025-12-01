// src/api/courseTypes.api.ts
import axiosInstance from '@/lib/axios';
import { CourseType } from '@/types/courseType';

export interface UpsertCourseTypePayload {
  name: string;
  shortName: string;
  description?: string;
  keywords?: string;
  isActive?: boolean;
}

export const courseTypesApi = {
  async list(params?: { includeInactive?: boolean }) {
    const response = await axiosInstance.get<CourseType[]>('/course-types', { params });
    return response.data;
  },

  async get(id: string) {
    const response = await axiosInstance.get<CourseType>(`/course-types/${id}`);
    return response.data;
  },

  async create(payload: UpsertCourseTypePayload) {
    const response = await axiosInstance.post<CourseType>('/course-types', payload);
    return response.data;
  },

  async update(id: string, payload: Partial<UpsertCourseTypePayload>) {
    const response = await axiosInstance.put<CourseType>(`/course-types/${id}`, payload);
    return response.data;
  },

  async remove(id: string) {
    await axiosInstance.delete(`/course-types/${id}`);
  },
};


