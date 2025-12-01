// src/api/locations.api.ts
import axiosInstance from '@/lib/axios';

interface StringListResponse {
  data?: string[];
}

const cache = new Map<string, string[]>();

const fetchList = async (cacheKey: string, url: string, params?: Record<string, string>) => {
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const response = await axiosInstance.get<StringListResponse>(url, { params });
  const list = response.data?.data ?? [];
  cache.set(cacheKey, list);
  return list;
};

export const locationsApi = {
  async getCountries() {
    return fetchList('countries', '/locations/countries');
  },

  async getStates(country: string) {
    const key = `states:${country.toLowerCase()}`;
    return fetchList(key, '/locations/states', { country });
  },

  async getCities(country: string, state: string) {
    const key = `cities:${country.toLowerCase()}:${state.toLowerCase()}`;
    return fetchList(key, '/locations/cities', { country, state });
  },

  clearCache() {
    cache.clear();
  },
};

export type LocationApi = typeof locationsApi;


