/**
 * API Response Adapter Utility
 * 
 * Adapts responses from the new acado-api to match the expected legacy format.
 * This ensures backward compatibility while transitioning to the new API structure.
 */

import type { CoursesApiResponse, Pagination } from '@app/types/public/lmsCourses';

/**
 * New API Response Structure (from acado-api)
 */
interface NewApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

/**
 * Adapts new API pagination format to legacy format
 * 
 * @param newPagination - Pagination from new API
 * @returns Pagination in legacy format
 */
function adaptPagination(newPagination?: NewApiResponse<any>['meta']): Partial<Pagination> {
  if (!newPagination) {
    return {
      current_page: 1,
      last_page: 1,
      per_page: 50,
      total: 0,
    };
  }

  return {
    current_page: newPagination.page || 1,
    last_page: newPagination.totalPages || 1,
    per_page: newPagination.pageSize || 50,
    total: newPagination.total || 0,
    // Map totalPages to last_page for compatibility
    totalPages: newPagination.totalPages,
  } as Partial<Pagination>;
}

/**
 * Checks if the response is from the new API
 * 
 * @param response - API response
 * @returns true if response is from new API
 */
function isNewApiResponse(response: any): response is NewApiResponse<any> {
  return response && typeof response === 'object' && 'success' in response;
}

/**
 * Adapts course list response from new API to legacy format
 * 
 * @param response - Response from API
 * @returns Adapted response in legacy format
 */
export function adaptCoursesResponse(response: any): CoursesApiResponse {
  // If it's already in legacy format, return as is
  if (!isNewApiResponse(response)) {
    return response as CoursesApiResponse;
  }

  // Adapt new API response to legacy format
  return {
    status: response.success ? 200 : 500,
    data: Array.isArray(response.data) ? response.data : [],
    pagination: adaptPagination(response.meta) as Pagination,
    error: response.success ? [] : [response.error?.message || 'Unknown error'],
  };
}

/**
 * Adapts a single course detail response
 * 
 * @param response - Response from API
 * @returns Adapted course data
 */
export function adaptCourseDetailResponse(response: any): any {
  if (!isNewApiResponse(response)) {
    return response;
  }

  return response.data;
}

/**
 * Generic adapter for list responses
 * 
 * @param response - Response from API
 * @returns Adapted data array
 */
export function adaptListResponse<T>(response: any): T[] {
  if (!isNewApiResponse(response)) {
    return Array.isArray(response?.data) ? response.data : response;
  }

  return Array.isArray(response.data) ? response.data : [];
}

