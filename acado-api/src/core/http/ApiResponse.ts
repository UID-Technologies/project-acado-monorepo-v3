// src/core/http/ApiResponse.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

export function successResponse<T>(
  data: T,
  meta?: ApiResponse['meta']
): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(meta && { meta }),
  };
}

export function errorResponse(
  error: { code: string; message: string; details?: any }
): ApiResponse {
  return {
    success: false,
    error,
  };
}

export function paginatedResponse<T>(
  data: T[],
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: pagination.total,
      totalPages: pagination.totalPages,
    },
  };
}

