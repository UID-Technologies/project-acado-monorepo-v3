import axiosInstance from '@/lib/axios';
import { ApplicationField, FieldCategory, FieldSubcategory, SelectOption } from '@/types/application';

// API-specific interfaces
export interface MasterField {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required: boolean;
  categoryId: string;
  subcategoryId?: string;
  options?: SelectOption[];
  description?: string;
  order: number;
  validation?: {
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email' | 'url' | 'custom';
    value?: any;
    message?: string;
  }[];
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  subcategories?: Subcategory[];
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  order?: number;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  icon?: string;
  order?: number;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  icon?: string;
  order?: number;
}

export interface CreateSubcategoryData {
  name: string;
  description?: string;
  order?: number;
}

export interface UpdateSubcategoryData {
  name?: string;
  description?: string;
  order?: number;
}

export interface CreateMasterFieldData {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required: boolean;
  categoryId: string;
  subcategoryId?: string;
  options?: SelectOption[];
  description?: string;
  order?: number;
  validation?: {
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email' | 'url' | 'custom';
    value?: any;
    message?: string;
  }[];
}

export interface UpdateMasterFieldData {
  name?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  categoryId?: string;
  subcategoryId?: string;
  options?: SelectOption[];
  description?: string;
  order?: number;
  validation?: {
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email' | 'url' | 'custom';
    value?: any;
    message?: string;
  }[];
}

export const masterFieldsApi = {
  // ============================================================
  // MASTER FIELDS CRUD OPERATIONS
  // ============================================================

  /**
   * Get all master fields
   */
  getMasterFields: async (): Promise<MasterField[]> => {
    const response = await axiosInstance.get('/masterFields');
    return response.data;
  },

  /**
   * Get master fields by category
   */
  getMasterFieldsByCategory: async (categoryId: string): Promise<MasterField[]> => {
    const response = await axiosInstance.get(`/masterFields?categoryId=${categoryId}`);
    return response.data;
  },

  /**
   * Get master fields by subcategory
   */
  getMasterFieldsBySubcategory: async (categoryId: string, subcategoryId: string): Promise<MasterField[]> => {
    const response = await axiosInstance.get(`/masterFields?categoryId=${categoryId}&subcategoryId=${subcategoryId}`);
    return response.data;
  },

  /**
   * Get a single master field by ID
   */
  getMasterFieldById: async (fieldId: string): Promise<MasterField> => {
    const response = await axiosInstance.get(`/masterFields/${fieldId}`);
    return response.data;
  },

  /**
   * Create a new master field
   */
  createMasterField: async (data: CreateMasterFieldData): Promise<MasterField> => {
    const fieldData = {
      name: data.name,
      label: data.label,
      type: data.type,
      placeholder: data.placeholder,
      required: data.required,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId,
      options: data.options,
      description: data.description,
      order: data.order,
      validation: data.validation,
    };
    const response = await axiosInstance.post('/masterFields', fieldData);
    return response.data;
  },

  /**
   * Update an existing master field
   */
  updateMasterField: async (fieldId: string, data: UpdateMasterFieldData): Promise<MasterField> => {
    const response = await axiosInstance.patch(`/masterFields/${fieldId}`, data);
    return response.data;
  },

  /**
   * Delete a master field
   */
  deleteMasterField: async (fieldId: string): Promise<void> => {
    await axiosInstance.delete(`/masterFields/${fieldId}`);
  },

  /**
   * Bulk create master fields
   */
  bulkCreateMasterFields: async (fields: CreateMasterFieldData[]): Promise<MasterField[]> => {
    const createdFields = await Promise.all(
      fields.map(field => masterFieldsApi.createMasterField(field))
    );
    return createdFields;
  },

  /**
   * Reorder master fields
   */
  reorderMasterFields: async (fieldOrders: { id: string; order: number }[]): Promise<void> => {
    await Promise.all(
      fieldOrders.map(({ id, order }) => 
        axiosInstance.patch(`/masterFields/${id}`, { order })
      )
    );
  },

  // ============================================================
  // CATEGORIES CRUD OPERATIONS
  // ============================================================

  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/masterCategories');
    return response.data;
  },

  /**
   * Get a single category by ID
   */
  getCategoryById: async (categoryId: string): Promise<Category> => {
    const response = await axiosInstance.get(`/masterCategories/${categoryId}`);
    return response.data;
  },

  /**
   * Create a new category
   */
  createCategory: async (data: CreateCategoryData): Promise<Category> => {
    const categoryData = {
      name: data.name,
      icon: data.icon || 'Folder',
      description: data.description,
      order: data.order,
    };
    const response = await axiosInstance.post('/masterCategories', categoryData);
    return response.data;
  },

  /**
   * Update an existing category
   */
  updateCategory: async (categoryId: string, data: UpdateCategoryData): Promise<Category> => {
    const response = await axiosInstance.patch(`/masterCategories/${categoryId}`, data);
    return response.data;
  },

  /**
   * Delete a category
   */
  deleteCategory: async (categoryId: string): Promise<void> => {
    await axiosInstance.delete(`/masterCategories/${categoryId}`);
  },

  /**
   * Reorder categories
   */
  reorderCategories: async (categoryOrders: { id: string; order: number }[]): Promise<void> => {
    await Promise.all(
      categoryOrders.map(({ id, order }) => 
        masterFieldsApi.updateCategory(id, { order })
      )
    );
  },

  // ============================================================
  // SUBCATEGORIES CRUD OPERATIONS
  // ============================================================

  /**
   * Get all subcategories for a category
   */
  getSubcategories: async (categoryId: string): Promise<Subcategory[]> => {
    const category = await masterFieldsApi.getCategoryById(categoryId);
    return category.subcategories || [];
  },

  /**
   * Get a single subcategory
   */
  getSubcategoryById: async (categoryId: string, subcategoryId: string): Promise<Subcategory | undefined> => {
    const category = await masterFieldsApi.getCategoryById(categoryId);
    return category.subcategories?.find((sub: Subcategory) => sub.id === subcategoryId);
  },

  /**
   * Create a new subcategory
   */
  createSubcategory: async (categoryId: string, data: CreateSubcategoryData): Promise<Subcategory> => {
    const response = await axiosInstance.post(`/masterCategories/${categoryId}/subcategories`, data);
    return response.data;
  },

  /**
   * Update an existing subcategory
   */
  updateSubcategory: async (categoryId: string, subcategoryId: string, data: UpdateSubcategoryData): Promise<Subcategory> => {
    const response = await axiosInstance.patch(`/masterCategories/${categoryId}/subcategories/${subcategoryId}`, data);
    return response.data;
  },

  /**
   * Delete a subcategory
   */
  deleteSubcategory: async (categoryId: string, subcategoryId: string): Promise<void> => {
    await axiosInstance.delete(`/masterCategories/${categoryId}/subcategories/${subcategoryId}`);
  },

  /**
   * Reorder subcategories within a category
   */
  reorderSubcategories: async (categoryId: string, subcategoryOrders: { id: string; order: number }[]): Promise<void> => {
    await Promise.all(
      subcategoryOrders.map(({ id, order }) => 
        masterFieldsApi.updateSubcategory(categoryId, id, { order })
      )
    );
  },

  // ============================================================
  // UTILITY METHODS
  // ============================================================

  /**
   * Get complete category hierarchy (categories with subcategories and fields)
   */
  getCategoryHierarchy: async (): Promise<{
    categories: Category[];
    fields: MasterField[];
  }> => {
    const [categories, fields] = await Promise.all([
      masterFieldsApi.getCategories(),
      masterFieldsApi.getMasterFields()
    ]);
    return { categories, fields };
  },

  /**
   * Search master fields by query
   */
  searchMasterFields: async (query: string): Promise<MasterField[]> => {
    const allFields = await masterFieldsApi.getMasterFields();
    const lowerQuery = query.toLowerCase();
    return allFields.filter(field => 
      field.name.toLowerCase().includes(lowerQuery) ||
      field.label.toLowerCase().includes(lowerQuery) ||
      field.description?.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Get field count by category
   */
  getFieldCountByCategory: async (categoryId: string): Promise<number> => {
    const fields = await masterFieldsApi.getMasterFieldsByCategory(categoryId);
    return fields.length;
  },

  /**
   * Duplicate a master field
   */
  duplicateMasterField: async (fieldId: string): Promise<MasterField> => {
    const field = await masterFieldsApi.getMasterFieldById(fieldId);
    const duplicateData: CreateMasterFieldData = {
      name: `${field.name}_copy`,
      label: `${field.label} (Copy)`,
      type: field.type,
      placeholder: field.placeholder,
      required: field.required,
      categoryId: field.categoryId,
      subcategoryId: field.subcategoryId,
      options: field.options,
      description: field.description,
      order: Date.now()
    };
    return masterFieldsApi.createMasterField(duplicateData);
  }
};

