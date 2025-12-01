// src/api/dashboard.api.ts
export interface DashboardStats {
  totalUniversities: number;
  totalUniversitiesChange?: string;
  activeCourses: number;
  activeCoursesChange?: string;
  formTemplates: number;
  formTemplatesChange?: string;
  totalApplications: number;
  totalApplicationsChange?: string;
}

export const dashboardApi = {
  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    // Temporarily disable API call while backend endpoint is unavailable.
    // const response = await axiosInstance.get('/dashboard/stats');
    // return response.data;

    return {
      totalUniversities: 0,
      totalUniversitiesChange: '+0',
      activeCourses: 0,
      activeCoursesChange: '+0',
      formTemplates: 0,
      formTemplatesChange: '+0',
      totalApplications: 0,
      totalApplicationsChange: '+0',
    };
  },
};

