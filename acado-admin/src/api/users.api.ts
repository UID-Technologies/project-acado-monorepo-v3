import axiosInstance from '@/lib/axios';
import { CreateUserPayload, UpdateUserPayload, User } from '@/types/user';

export interface UsersListParams {
  search?: string;
  userType?: 'Learner' | 'Faculty' | 'Staff';
  status?: 'active' | 'inactive';
  universityId?: string;
  universityName?: string;
  // Removed: page, pageSize (pagination removed)
}

// Backend returns array directly after axios interceptor unwraps
export type UsersListResponse = User[];

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
  // Removed: page, pageSize (pagination removed)
  return searchParams.toString();
};

export const usersApi = {
  async getUsers(params: UsersListParams = {}): Promise<UsersListResponse> {
    const query = buildQueryString(params);
    const response = await axiosInstance.get(`/users${query ? `?${query}` : ''}`);
    // Backend returns array directly (after axios interceptor unwraps)
    const users = Array.isArray(response.data) ? response.data : [];
    return users.map((user: any) => normalizeUser(user));
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
    // Backend returns { data: [...] } which gets unwrapped to array
    const result = Array.isArray(response.data) ? response.data : (response.data?.data || []);
    return result.map((user: any) => normalizeUser(user));
  },
};
