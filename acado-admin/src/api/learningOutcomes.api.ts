// src/api/learningOutcomes.api.ts
import axiosInstance from '@/lib/axios';
import { LearningOutcome } from '@/types/learningOutcome';

export interface UpsertLearningOutcomePayload {
  name: string;
  shortName: string;
  code?: string;
  parentId?: string | null;
  description?: string;
  keywords?: string;
  isActive?: boolean;
}

export const learningOutcomesApi = {
  async list(params?: { parentId?: string; includeInactive?: boolean }) {
    const response = await axiosInstance.get<LearningOutcome[]>('/learning-outcomes', { params });
    return response.data;
  },

  async get(id: string) {
    const response = await axiosInstance.get<LearningOutcome>(`/learning-outcomes/${id}`);
    return response.data;
  },

  async create(payload: UpsertLearningOutcomePayload) {
    const response = await axiosInstance.post<LearningOutcome>('/learning-outcomes', payload);
    return response.data;
  },

  async update(id: string, payload: Partial<UpsertLearningOutcomePayload>) {
    const response = await axiosInstance.put<LearningOutcome>(`/learning-outcomes/${id}`, payload);
    return response.data;
  },

  async remove(id: string) {
    await axiosInstance.delete(`/learning-outcomes/${id}`);
  },
};


