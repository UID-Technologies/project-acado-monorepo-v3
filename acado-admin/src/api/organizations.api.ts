import axiosInstance from '@/lib/axios';

export interface OrganizationContact {
  name?: string;
  email?: string;
  phone?: string;
}

export interface Organization {
  id: string;
  name: string;
  shortName?: string;
  type: 'University' | 'Corporate' | 'Non-Profit';
  onboardingStage: 'Profile Created' | 'Documents Submitted' | 'Approved' | 'Live';
  description?: string;
  contacts?: {
    primary?: OrganizationContact;
    secondary?: OrganizationContact;
  };
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
  website?: string;
  logoUrl?: string;
  communications?: {
    onboardingEmails?: string[];
    weeklyUpdates?: boolean;
  };
  support?: {
    successManager?: string;
    supportChannel?: 'email' | 'slack' | 'whatsapp';
    supportNotes?: string;
  };
  suspended: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ListOrganizationsResponse {
  organizations: Organization[];
}

export interface CreateOrganizationPayload {
  name: string;
  shortName?: string;
  type: 'University' | 'Corporate' | 'Non-Profit';
  onboardingStage?: 'Profile Created' | 'Documents Submitted' | 'Approved' | 'Live';
  description?: string;
  contacts?: {
    primary?: OrganizationContact;
    secondary?: OrganizationContact;
  };
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
  website?: string;
  logoUrl?: string;
  communications?: {
    onboardingEmails?: string[];
    weeklyUpdates?: boolean;
  };
  support?: {
    successManager?: string;
    supportChannel?: 'email' | 'slack' | 'whatsapp';
    supportNotes?: string;
  };
  suspended?: boolean;
  admin?: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    sendWelcomeEmail?: boolean;
  };
}

interface CreateOrganizationResponse {
  organization: Organization;
  admin: unknown;
  adminCredentials?: {
    email: string;
    password: string;
  };
}

export interface OrganizationAdminSummary {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface OrganizationDetailsResponse {
  organization: Organization;
  primaryAdmin?: OrganizationAdminSummary;
}

export interface OrganizationAdminDetails extends OrganizationAdminSummary {
  username?: string;
  userType?: string;
  organizationId?: string;
  organizationName?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddOrganizationAdminPayload {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  sendWelcomeEmail?: boolean;
}

export interface AddOrganizationAdminResponse {
  admin: OrganizationAdminDetails;
  temporaryCredentials?: {
    email: string;
    password: string;
  };
  sendWelcomeEmail: boolean;
}

export interface UpdateOrganizationStatusPayload {
  suspended: boolean;
}

export interface UpdateOrganizationStatusResponse {
  organization: Organization;
}

export interface UpdateOrganizationLocationPayload {
  city?: string;
  state?: string;
  country?: string;
}

export interface UpdateOrganizationLocationResponse {
  organization: Organization;
}

export interface UpdateOrganizationStagePayload {
  onboardingStage: Organization['onboardingStage'];
}

export interface UpdateOrganizationStageResponse {
  organization: Organization;
}

export interface UpdateOrganizationInfoPayload {
  name?: string;
  shortName?: string;
  type?: Organization['type'];
  description?: string;
  website?: string;
}

export interface UpdateOrganizationInfoResponse {
  organization: Organization;
}

export interface UpdateOrganizationContactsPayload {
  primary?: OrganizationContact;
  secondary?: OrganizationContact;
}

export interface UpdateOrganizationContactsResponse {
  organization: Organization;
}

export const organizationsApi = {
  async listPublic(): Promise<Organization[]> {
    const response = await axiosInstance.get('/organizations/public');
    // Backend returns { organizations: [] } which gets unwrapped by interceptor
    // After unwrapping, response.data = { organizations: [] }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.organizations || [];
  },

  async list(): Promise<Organization[]> {
    const response = await axiosInstance.get('/organizations');
    // Backend returns { organizations: [] } which gets unwrapped by interceptor
    // After unwrapping, response.data = { organizations: [] }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.organizations || [];
  },

  async create(payload: CreateOrganizationPayload): Promise<CreateOrganizationResponse> {
    const response = await axiosInstance.post<CreateOrganizationResponse>('/organizations', payload);
    return response.data;
  },

  async get(organizationId: string): Promise<OrganizationDetailsResponse> {
    const response = await axiosInstance.get<OrganizationDetailsResponse>(`/organizations/${organizationId}`);
    return response.data;
  },

  async addAdmin(organizationId: string, payload: AddOrganizationAdminPayload) {
    const response = await axiosInstance.post(`/organizations/${organizationId}/admins`, payload);
    return response.data as AddOrganizationAdminResponse;
  },

  async updateStatus(organizationId: string, payload: UpdateOrganizationStatusPayload) {
    const response = await axiosInstance.patch<UpdateOrganizationStatusResponse>(
      `/organizations/${organizationId}/status`,
      payload
    );
    return response.data;
  },

  async updateLocation(organizationId: string, payload: UpdateOrganizationLocationPayload) {
    const response = await axiosInstance.patch<UpdateOrganizationLocationResponse>(
      `/organizations/${organizationId}/location`,
      payload
    );
    return response.data;
  },

  async updateOnboardingStage(organizationId: string, payload: UpdateOrganizationStagePayload) {
    const response = await axiosInstance.patch<UpdateOrganizationStageResponse>(
      `/organizations/${organizationId}/onboarding-stage`,
      payload
    );
    return response.data;
  },

  async updateInfo(organizationId: string, payload: UpdateOrganizationInfoPayload) {
    const response = await axiosInstance.patch<UpdateOrganizationInfoResponse>(
      `/organizations/${organizationId}/info`,
      payload
    );
    return response.data;
  },

  async updateContacts(organizationId: string, payload: UpdateOrganizationContactsPayload) {
    const response = await axiosInstance.patch<UpdateOrganizationContactsResponse>(
      `/organizations/${organizationId}/contacts`,
      payload
    );
    return response.data;
  }
};


