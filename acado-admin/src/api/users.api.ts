import axiosInstance from '@/lib/axios';
import { CreateUserPayload, UpdateUserPayload, User } from '@/types/user';

export interface UsersListParams {
  search?: string;
  userType?: 'Learner' | 'Faculty' | 'Staff';
  status?: 'active' | 'inactive';
  universityId?: string;
  universityName?: string;
  page?: number;
  pageSize?: number;
}

export interface UsersListResponse {
  data: User[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const normalizeUser = (user: any): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  username: user.username,
  userType: user.userType,
  status: user.isActive === false ? 'inactive' : 'active',
  universityId: user.universityId ?? user.organizationId ?? null,
  universityName: user.universityName ?? user.organizationName,
  university: user.universityName ?? user.organizationName,
  mobileNo: user.mobileNo,
  studentIdStaffId: user.studentIdStaffId,
  address: user.address,
  country: user.country,
  state: user.state,
  city: user.city,
  pinCode: user.pinCode,
  dateOfBirth: user.dateOfBirth || undefined,
  gender: user.gender,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const buildQueryString = (params: UsersListParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.append('search', params.search);
  if (params.userType) searchParams.append('userType', params.userType);
  if (params.status) searchParams.append('status', params.status);
  if (params.universityId) searchParams.append('universityId', params.universityId);
  if (params.universityName) searchParams.append('universityName', params.universityName);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
  return searchParams.toString();
};

export const usersApi = {
  async getUsers(params: UsersListParams = {}): Promise<UsersListResponse> {
    const query = buildQueryString(params);
    const response = await axiosInstance.get(`/users${query ? `?${query}` : ''}`);
    return {
      data: Array.isArray(response.data?.data)
        ? response.data.data.map((user: any) => normalizeUser(user))
        : [],
      pagination: response.data?.pagination || {
        page: params.page || 1,
        pageSize: params.pageSize || 25,
        total: Array.isArray(response.data?.data) ? response.data.data.length : 0,
        totalPages: 1,
      },
    };
  },

  async getUser(userId: string): Promise<User> {
    const response = await axiosInstance.get(`/users/${userId}`);
    return normalizeUser(response.data);
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    const response = await axiosInstance.post('/users', payload);
    return normalizeUser(response.data);
  },

  async updateUser(userId: string, payload: UpdateUserPayload): Promise<User> {
    const response = await axiosInstance.patch(`/users/${userId}`, payload);
    return normalizeUser(response.data);
  },

  async deleteUser(userId: string): Promise<void> {
    await axiosInstance.delete(`/users/${userId}`);
  },

  async bulkImportUsers(users: CreateUserPayload[]): Promise<User[]> {
    const response = await axiosInstance.post('/users/bulk', { users });
    return Array.isArray(response.data?.data)
      ? response.data.data.map((user: any) => normalizeUser(user))
      : [];
  },
};
