import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { clearAccessToken, getAccessToken } from './tokenManager';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

console.log('🌐 Axios configured with base URL:', API_BASE_URL);

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach SSO token to all requests
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const bearerToken = getAccessToken();
  if (bearerToken && config.headers) {
    config.headers.Authorization = `Bearer ${bearerToken}`;
    console.log('🔑 Attaching token to request:', config.url);
  }
  return config;
});

// Unwrap backend response structure { success: true, data: {...} }
// This allows all API files to access response.data directly
axiosInstance.interceptors.response.use(
  (response) => {
    // If response has the wrapped structure, unwrap it
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('❌ 401 Unauthorized - clearing session');
      clearAccessToken();
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

