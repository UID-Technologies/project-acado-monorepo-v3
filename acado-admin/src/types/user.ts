export type UserType = 'Learner' | 'Faculty' | 'Staff' | 'Admin';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  userType: UserType;
  status: UserStatus;
  universityId?: string | null;
  universityName?: string;
  university?: string; // Backward compatibility for existing UI usage
  organizationId?: string | null; // Legacy compatibility
  organizationName?: string; // Legacy compatibility
  mobileNo?: string;
  studentIdStaffId?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  username: string;
  password: string;
  userType: UserType;
  status: UserStatus;
  universityId: string;
  universityName?: string;
  organizationId?: string | null; // Legacy compatibility
  organizationName?: string; // Legacy compatibility
  mobileNo?: string;
  studentIdStaffId?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  password?: string;
}

