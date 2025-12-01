import axiosInstance from '@/lib/axios';

export interface UniversityFormSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  isRequired: boolean;
  fields: FormSectionField[];
}

export interface FormSectionField {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required: boolean;
  section: string;
  order: number;
  options?: Array<{ value: string; label: string }>;
  validation?: any;
}

export const universityFormSectionsApi = {
  // Get all university form sections
  getUniversityFormSections: async (): Promise<UniversityFormSection[]> => {
    const response = await axiosInstance.get('/universityFormSections');
    return response.data;
  },

  // Get single section by ID
  getUniversityFormSectionById: async (sectionId: string): Promise<UniversityFormSection> => {
    const response = await axiosInstance.get(`/universityFormSections/${sectionId}`);
    return response.data;
  },

  // Create new section
  createUniversityFormSection: async (data: Omit<UniversityFormSection, 'id'>): Promise<UniversityFormSection> => {
    const response = await axiosInstance.post('/universityFormSections', data);
    return response.data;
  },

  // Update section
  updateUniversityFormSection: async (
    sectionId: string,
    data: Partial<Omit<UniversityFormSection, 'id'>>
  ): Promise<UniversityFormSection> => {
    const response = await axiosInstance.put(`/universityFormSections/${sectionId}`, data);
    return response.data;
  },

  // Delete section
  deleteUniversityFormSection: async (sectionId: string): Promise<void> => {
    const response = await axiosInstance.delete(`/universityFormSections/${sectionId}`);
    return response.data;
  },
};

