// src/api/courses.api.ts
import axiosInstance from '@/lib/axios';
import { Course, CourseCampaign } from '@/types/course';

export interface UpsertCoursePayload {
  universityId: string;
  universityName?: string;
  name: string;
  shortName: string;
  courseCode?: string;
  description: string;
  keywords?: string;
  courseCategoryId?: string | null;
  courseLevelId?: string | null;
  courseTypeId?: string | null;
  duration?: string;
  requirements?: string;
  fee?: number;
  currency?: string;
  thumbnail?: string;
  bannerImage?: string;
  videoUrl?: string;
  startDate?: string;
  endDate?: string;
  applicationDeadline?: string;
  learningOutcomeIds?: string[];
  isActive?: boolean;
  campaign?: CourseCampaign;
}

export const coursesApi = {
  async list(params?: {
    universityId?: string;
    type?: string;
    level?: string;
    courseCategoryId?: string;
    courseTypeId?: string;
    courseLevelId?: string;
    isActive?: boolean;
  }) {
    const response = await axiosInstance.get<Course[]>('/courses', { params });
    return response.data;
  },

  // Alias for list method
  async getCourses(params?: {
    universityId?: string;
    type?: string;
    level?: string;
    courseCategoryId?: string;
    courseTypeId?: string;
    courseLevelId?: string;
    isActive?: boolean;
  }) {
    return this.list(params);
  },

  async get(id: string) {
    const response = await axiosInstance.get<Course>(`/courses/${id}`);
    return response.data;
  },

  async create(payload: UpsertCoursePayload) {
    const response = await axiosInstance.post<Course>('/courses', payload);
    return response.data;
  },

  async update(id: string, payload: Partial<UpsertCoursePayload>) {
    const response = await axiosInstance.put<Course>(`/courses/${id}`, payload);
    return response.data;
  },

  async remove(id: string) {
    await axiosInstance.delete(`/courses/${id}`);
  },
};


