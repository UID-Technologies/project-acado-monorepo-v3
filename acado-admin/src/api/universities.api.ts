import axios from 'axios';
import axiosInstance from '@/lib/axios';
import { getAccessToken } from '@/lib/tokenManager';
import type { UniversityDetails } from '@/types/university';

// ==================== ELMS API CONFIGURATION ====================
const ELMS_API_BASE_URL = 'https://elms.acado.ai/api';
const ELMS_API_KEY = '0612b32b39f4b29f48c5c5363028ee916bb99Acado';

// Dedicated axios instance for ELMS API
const elmsAxios = axios.create({
  baseURL: ELMS_API_BASE_URL,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'nlms-api-key': ELMS_API_KEY,
  },
});

// Add authorization token from current session to all ELMS requests
elmsAxios.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle ELMS API errors
elmsAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log warning instead of error - ELMS API failures shouldn't break the app
    console.warn('⚠️ ELMS API Error (non-critical):', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
);

// ==================== INTERFACES ====================

export interface University {
  id: string;
  name: string;
  description?: string;
  location?: string;
  website?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ElmsCourse {
  id: number;
  name: string;
  description?: string;
  status?: 'Active' | 'deleted' | 'Draft' | 'Inactive';
  organization_id?: number;
  image?: string;
  start_date?: string | null;
  end_date?: string | null;
  duration?: string | null;
  level?: string;
}

export interface CoursesResponse {
  status: number;
  data: {
    programs: {
      current_page: number;
      data: ElmsCourse[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
  };
  error: any[];
}

export interface GetCoursesParams {
  page?: number;
  per_page?: number;
  is_competition?: number;
  is_popular?: number;
  search?: string;
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get organization_id from logged-in user
 */
const getOrganizationId = (): number => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      const candidate =
        user.organizationId ??
        user.organization_id ??
        user.organizationID ??
        null;

      if (typeof candidate === 'number' && !Number.isNaN(candidate)) {
        return candidate;
      }

      if (typeof candidate === 'string') {
        const parsed = Number(candidate);
        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }

      return 152;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  return 152; // Default fallback
};

/**
 * Extract courses array from ELMS API response
 */
export const extractCoursesFromResponse = (response: CoursesResponse): ElmsCourse[] => {
  return response?.data?.programs?.data || [];
};

// ==================== API METHODS ====================

export interface UniversityListParams {
  search?: string;
  country?: string;
  institutionType?: string;
  status?: 'Active' | 'Suspended';
  organizationId?: string;
  parentInstitutionId?: string | null;
  isActive?: boolean;
}

export interface UniversitySummary {
  id: string;
  name: string;
  shortName?: string;
  institutionType: string;
  status?: 'Active' | 'Suspended';
  organizationId?: string | null;
  organizationLevel?: string;
  parentInstitutionId?: string | null;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  tags?: {
    isVerified?: boolean;
  };
  stats?: {
    rating?: string;
    rank?: string;
    totalStudents?: number;
    internationalStudents?: number;
  };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Backend returns array directly after axios interceptor unwraps
export type UniversityListResponse = UniversitySummary[];

export interface UniversityCourseSummary {
  id: string;
  name: string;
  description?: string;
  code?: string;
  status?: string;
}

export interface UniversityStatsResponse {
  total: number;
  active: number;
  inactive: number;
  byType: Record<string, number>;
  topCountries: Array<{ country: string; count: number }>;
}

export const universitiesApi = {
  /**
   * Get all universities
   */
  getUniversities: async (params?: UniversityListParams): Promise<UniversitySummary[]> => {
    const response = await axiosInstance.get<UniversitySummary[]>('/universities', { params });
    return response.data;
  },

  /**
   * Get university stats summary
   */
  getUniversityStats: async (): Promise<UniversityStatsResponse> => {
    const response = await axiosInstance.get<UniversityStatsResponse>('/universities/stats/summary');
    return response.data;
  },

  /**
   * Get university by ID
   */
  getUniversity: async (id: string): Promise<UniversityDetails> => {
    const response = await axiosInstance.get<UniversityDetails>(`/universities/${id}`);
    return response.data;
  },

  /**
   * Create new university
   */
  createUniversity: async (payload: Partial<UniversityDetails>): Promise<UniversityDetails> => {
    const response = await axiosInstance.post<UniversityDetails>('/universities', payload);
    return response.data;
  },

  /**
   * Update existing university
   */
  updateUniversity: async (
    id: string,
    payload: Partial<UniversityDetails>,
  ): Promise<UniversityDetails> => {
    const response = await axiosInstance.put<UniversityDetails>(`/universities/${id}`, payload);
    return response.data;
  },

  updateStatus: async (id: string, status: 'Active' | 'Suspended'): Promise<UniversityDetails> => {
    const response = await axiosInstance.patch<UniversityDetails>(`/universities/${id}`, {
      status,
    });
    return response.data;
  },

  getCoursesByUniversity: async (universityId: string): Promise<UniversityCourseSummary[]> => {
    if (!universityId) {
      return [];
    }
    const response = await axiosInstance.get<UniversityCourseSummary[]>(
      `/universities/${universityId}/courses`
    );
    return response.data;
  },

  /**
   * Delete (soft-delete) a university
   */
  deleteUniversity: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/universities/${id}`);
  },

  /**
   * Get courses by organization_id (from logged-in user)
   * Authorization Bearer token is automatically added by interceptor
   */
  getCoursesByOrgId: async (params?: GetCoursesParams): Promise<CoursesResponse> => {
    try {
      const orgId = getOrganizationId();
      
      const queryParams = new URLSearchParams({
        org_id: orgId.toString()
      });

      // Add optional parameters
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params?.is_competition !== undefined) queryParams.append('is_competition', params.is_competition.toString());
      if (params?.is_popular !== undefined) queryParams.append('is_popular', params.is_popular.toString());
      if (params?.search) queryParams.append('search', params.search);

      const response = await elmsAxios.get(`/programs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      throw error;
    }
  },

  /**
   * Get single course by ID
   * Returns null if course not found or API fails (graceful failure)
   */
  getCourseById: async (courseId: number): Promise<ElmsCourse | null> => {
    try {
      if (!courseId || isNaN(Number(courseId))) {
        console.warn('Invalid courseId:', courseId);
        return null;
      }
      
      const orgId = getOrganizationId();
      const response = await elmsAxios.get(`/programs?org_id=${orgId}`);
      
      const coursesResponse: CoursesResponse = response.data;
      const course = coursesResponse.data.programs.data.find(c => c.id === Number(courseId));
      
      return course || null;
    } catch (error: any) {
      // Don't throw - return null gracefully so app doesn't break
      console.warn('⚠️ Failed to fetch course by ID (non-critical):', {
        courseId,
        status: error.response?.status,
        message: error.message
      });
      return null; // Return null instead of throwing
    }
  },

  /**
   * Legacy method - alias for getCoursesByOrgId
   * @deprecated Use getCoursesByOrgId instead
   */
  getCourses: async (params?: GetCoursesParams): Promise<CoursesResponse> => {
    return universitiesApi.getCoursesByOrgId(params);
  }
};
