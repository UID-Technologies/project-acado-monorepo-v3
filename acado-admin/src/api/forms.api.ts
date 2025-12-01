import axiosInstance from '@/lib/axios';

export interface SelectOption {
  value: string;
  label: string;
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email' | 'url' | 'custom';
  value?: any;
  message?: string;
}

export interface ConfiguredField {
  fieldId?: string;
  name: string;
  label: string;
  customLabel?: string;
  type: string;
  placeholder?: string;
  required: boolean;
  isVisible: boolean;
  isRequired: boolean;
  categoryId: string;
  categoryName?: string; // Populated by backend
  subcategoryId?: string;
  subcategoryName?: string; // Populated by backend
  options?: SelectOption[];
  validation?: ValidationRule[];
  description?: string;
  order: number;
}

export interface CustomCategoryName {
  name: string;
  subcategories?: Record<string, string>;
}

export interface Form {
  id: string;
  name: string;
  title: string;
  description?: string;
  organizationId?: string;
  organizationName?: string;
  universityId?: string;
  courseIds?: string[];
  fields: ConfiguredField[];
  customCategoryNames?: Record<string, CustomCategoryName>;
  status: 'draft' | 'published' | 'archived';
  isLaunched: boolean;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormData {
  name: string;
  title: string;
  description?: string;
  organizationId?: string;
  organizationName?: string;
  universityId?: string;
  courseIds?: string[];
  fields: ConfiguredField[];
  customCategoryNames?: Record<string, CustomCategoryName>;
  status?: 'draft' | 'published' | 'archived';
  isLaunched?: boolean;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdateFormData extends Partial<CreateFormData> {}

export interface QueryFormsParams {
  status?: 'draft' | 'published' | 'archived';
  universityId?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface FormsListResponse {
  forms: Form[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const formsApi = {
  // Get all forms with optional filters
  getForms: async (params?: QueryFormsParams): Promise<FormsListResponse> => {
    const response = await axiosInstance.get('/forms', { params });
    return response.data;
  },

  // Get single form by ID
  getFormById: async (formId: string): Promise<Form> => {
    const response = await axiosInstance.get(`/forms/${formId}`);
    return response.data;
  },

  // Create new form
  createForm: async (data: CreateFormData): Promise<Form> => {
    const response = await axiosInstance.post('/forms', data);
    return response.data;
  },

  // Update form
  updateForm: async (formId: string, data: UpdateFormData): Promise<Form> => {
    const response = await axiosInstance.put(`/forms/${formId}`, data);
    return response.data;
  },

  // Delete form
  deleteForm: async (formId: string): Promise<void> => {
    const response = await axiosInstance.delete(`/forms/${formId}`);
    return response.data;
  },

  // Publish form
  publishForm: async (formId: string): Promise<Form> => {
    const response = await axiosInstance.patch(`/forms/${formId}/publish`);
    return response.data;
  },

  // Archive form
  archiveForm: async (formId: string): Promise<Form> => {
    const response = await axiosInstance.patch(`/forms/${formId}/archive`);
    return response.data;
  },

  // Duplicate form
  duplicateForm: async (formId: string): Promise<Form> => {
    const response = await axiosInstance.post(`/forms/${formId}/duplicate`);
    return response.data;
  },
};

