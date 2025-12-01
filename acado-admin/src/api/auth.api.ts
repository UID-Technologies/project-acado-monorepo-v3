import axiosInstance from '@/lib/axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export type Role = 'superadmin' | 'admin' | 'learner';
export type UserType = 'Learner' | 'Faculty' | 'Staff' | 'Admin';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  username?: string;
  organizationId: string;
  universityId: string;
  courseIds?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: Role;
  userType: UserType;
  universityId?: string | null;
  universityName?: string;
  organizationId?: string | null;
  organizationName?: string;
  universityIds?: string[];
  courseIds?: string[];
  mobileNo?: string;
  studentIdStaffId?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  dateOfBirth?: string | null;
  gender?: 'Male' | 'Female' | 'Other';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  roles?: Role[];
}

export interface AuthResponse {
  accessToken: string | null;
  expiresIn?: string;
  user: User;
}

const normalizeUser = (rawUser: any): User => {
  if (!rawUser || typeof rawUser !== 'object') {
    throw new Error('Invalid user payload received from authentication API');
  }

  const {
    id,
    _id,
    email,
    name,
    username,
    role,
    userType,
    organizationId,
    organizationName,
    universityId,
    universityName,
    universityIds,
    courseIds,
    mobileNo,
    studentIdStaffId,
    address,
    country,
    state,
    city,
    pinCode,
    dateOfBirth,
    gender,
    isActive,
    createdAt,
    updatedAt,
    roles
  } = rawUser;

  const normalizedRole = (role ?? 'learner') as Role;
  const normalizedRoles = Array.isArray(roles) && roles.length > 0 ? roles as Role[] : [normalizedRole];
  const normalizedUniversityIds = Array.isArray(universityIds)
    ? universityIds.map((value: any) => String(value))
    : [];
  const normalizedCourseIds = Array.isArray(courseIds)
    ? courseIds.map((value: any) => String(value))
    : [];

  const primaryUniversityId =
    (typeof universityId === 'string' && universityId) ||
    (normalizedUniversityIds.length > 0 ? normalizedUniversityIds[0] : null) ||
    (typeof organizationId === 'string' && organizationId) ||
    null;

  if (primaryUniversityId && normalizedUniversityIds.length === 0) {
    normalizedUniversityIds.push(primaryUniversityId);
  }

  const resolvedUniversityName = universityName || organizationName || undefined;

  return {
    id: typeof id === 'string' ? id : (typeof _id === 'string' ? _id : String(id ?? '')),
    email: String(email ?? ''),
    name: String(name ?? ''),
    username: String(username ?? email ?? ''),
    role: normalizedRole,
    userType: (userType ?? 'Learner') as UserType,
    universityId: primaryUniversityId,
    universityName: resolvedUniversityName,
    organizationId: organizationId ?? primaryUniversityId ?? null,
    organizationName: organizationName ?? resolvedUniversityName,
    universityIds: normalizedUniversityIds,
    courseIds: normalizedCourseIds,
    mobileNo: mobileNo ?? undefined,
    studentIdStaffId: studentIdStaffId ?? undefined,
    address: address ?? undefined,
    country: country ?? undefined,
    state: state ?? undefined,
    city: city ?? undefined,
    pinCode: pinCode ?? undefined,
    dateOfBirth: dateOfBirth ? String(dateOfBirth) : undefined,
    gender: gender ?? undefined,
    isActive: Boolean(isActive ?? true),
    createdAt: createdAt ? String(createdAt) : undefined,
    updatedAt: updatedAt ? String(updatedAt) : undefined,
    roles: normalizedRoles
  };
};

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
    return {
      accessToken: data.accessToken ?? null,
      expiresIn: data.expiresIn,
      user: normalizeUser(data.user),
    };
  },

  register: async (payload: RegisterData): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/register', payload);
    return {
      accessToken: data.accessToken ?? null,
      expiresIn: data.expiresIn,
      user: normalizeUser(data.user),
    };
  },

  refresh: async (): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/refresh', {});
    return {
      accessToken: data.accessToken ?? null,
      expiresIn: data.expiresIn,
      user: normalizeUser(data.user),
    };
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout', {});
  },

  getProfile: async (): Promise<User> => {
    const { data } = await axiosInstance.get('/auth/profile');
    return normalizeUser(data);
  },

  updateProfile: async (payload: { name?: string; email?: string }): Promise<User> => {
    const { data } = await axiosInstance.put('/auth/profile', payload);
    return normalizeUser(data);
  },

  changePassword: async (payload: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
    const { data } = await axiosInstance.post('/auth/change-password', payload);
    return data;
  },
};

export { normalizeUser };

