import axiosInstance from '@/lib/axios';

export interface Application {
  id: string;
  userId: string;
  universityId?: string;
  courseId?: string;
  formId: string;
  formData: Record<string, any>;
  status: 'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected' | 'withdrawn' | 'waitlisted';
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  attachments?: {
    fieldName: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  }[];
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    completionTime?: number;
  };
  createdAt: string;
  updatedAt: string;
  // Enriched fields (added by backend service or frontend transformation)
  courseName?: string;
  universityName?: string;
  applicantName?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  matchScore?: number;
  matchDetails?: any[];
}

export interface CreateApplicationData {
  userId: string;
  universityId?: string;
  courseId?: string;
  formId: string;
  formData: Record<string, any>;
  status?: 'draft' | 'submitted';
  metadata?: {
    completionTime?: number;
  };
}

export interface UpdateApplicationData extends Partial<CreateApplicationData> {
  status?: 'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected' | 'withdrawn' | 'waitlisted';
  reviewNotes?: string;
}

export interface ApplicationStats {
  total: number;
  draft: number;
  submitted: number;
  under_review: number;
  shortlisted?: number;
  interview_scheduled?: number;
  accepted: number;
  rejected: number;
  withdrawn: number;
  waitlisted?: number;
}

export interface QueryApplicationsParams {
  userId?: string;
  universityId?: string;
  courseId?: string;
  formId?: string;
  status?: 'draft' | 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected' | 'withdrawn' | 'waitlisted';
  page?: number;
  limit?: number;
  sort?: string;
  // Enrichment flags
  enrich?: boolean; // If true, backend should populate courseName, universityName, etc.
}

export interface ApplicationsListResponse {
  applications?: Application[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Backend returns array directly after pagination removal
export type ApplicationsListResponseArray = Application[];

export const applicationsApi = {
  // Get all applications with optional filters
  getApplications: async (params?: QueryApplicationsParams): Promise<ApplicationsListResponse | ApplicationsListResponseArray> => {
    const response = await axiosInstance.get('/applications', { params });
    // Backend returns array directly (after axios interceptor unwraps it)
    return response.data;
  },

  // Get single application by ID
  getApplicationById: async (applicationId: string): Promise<Application> => {
    const response = await axiosInstance.get(`/applications/${applicationId}`);
    return response.data;
  },

  // Create new application
  createApplication: async (data: CreateApplicationData): Promise<Application> => {
    const response = await axiosInstance.post('/applications', data);
    return response.data;
  },

  // Update application
  updateApplication: async (applicationId: string, data: UpdateApplicationData): Promise<Application> => {
    const response = await axiosInstance.put(`/applications/${applicationId}`, data);
    return response.data;
  },

  // Delete application
  deleteApplication: async (applicationId: string): Promise<void> => {
    await axiosInstance.delete(`/applications/${applicationId}`);
  },

  // Submit application (change status from draft to submitted)
  submitApplication: async (applicationId: string): Promise<Application> => {
    const response = await axiosInstance.post(`/applications/${applicationId}/submit`);
    return response.data;
  },

  // Withdraw application
  withdrawApplication: async (applicationId: string): Promise<Application> => {
    const response = await axiosInstance.post(`/applications/${applicationId}/withdraw`);
    return response.data;
  },

  // Review application (admin/editor only)
  reviewApplication: async (
    applicationId: string,
    status: 'accepted' | 'rejected' | 'shortlisted' | 'interview_scheduled' | 'under_review' | 'waitlisted',
    reviewNotes?: string
  ): Promise<Application> => {
    const response = await axiosInstance.post(`/applications/${applicationId}/review`, {
      status,
      reviewNotes
    });
    return response.data;
  },

  // Update application status (convenience method)
  updateStatus: async (
    applicationId: string,
    status: 'submitted' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'accepted' | 'rejected' | 'withdrawn' | 'waitlisted',
    reviewNotes?: string
  ): Promise<Application> => {
    const response = await axiosInstance.put(`/applications/${applicationId}`, {
      status,
      reviewNotes
    });
    return response.data;
  },

  // Get application statistics
  getStats: async (params?: { userId?: string; universityId?: string; courseId?: string; formId?: string }): Promise<ApplicationStats> => {
    const response = await axiosInstance.get('/applications/stats', { params });
    return response.data;
  },
};
