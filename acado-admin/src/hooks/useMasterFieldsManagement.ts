import { useState, useEffect } from 'react';
import { FieldCategory, ApplicationField } from '@/types/application';
import { masterFieldsApi } from '@/api';

export interface MasterFieldsData {
  categories: FieldCategory[];
  fields: ApplicationField[];
}

export const useMasterFieldsManagement = () => {
  const [categories, setCategories] = useState<FieldCategory[]>([]);
  const [fields, setFields] = useState<ApplicationField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load data from JSON server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, fieldsData] = await Promise.all([
          masterFieldsApi.getCategories(),
          masterFieldsApi.getMasterFields(),
        ]);
        setCategories(categoriesData as unknown as FieldCategory[]);
        setFields(fieldsData as unknown as ApplicationField[]);
      } catch (err) {
        setError(err as Error);
        console.error('Failed to fetch master fields data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Category management
  const addCategory = async (category: Omit<FieldCategory, 'id'>) => {
    try {
      console.log('Creating category:', category); // Debug log
      const newCategory = await masterFieldsApi.createCategory({
        name: category.name,
        description: category.description,
        icon: category.icon || 'Folder',
        order: category.order || categories.length + 1,
      });
      console.log('Category created:', newCategory); // Debug log
      setCategories([...categories, newCategory as unknown as FieldCategory]);
      return newCategory.id;
    } catch (err) {
      console.error('Failed to add category:', err);
      throw err;
    }
  };

  const updateCategory = async (categoryId: string, updates: Partial<FieldCategory>) => {
    try {
      await masterFieldsApi.updateCategory(categoryId, updates);
      const updatedCategories = categories.map(cat =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      );
      setCategories(updatedCategories);
    } catch (err) {
      console.error('Failed to update category:', err);
      throw err;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await masterFieldsApi.deleteCategory(categoryId);
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      const updatedFields = fields.filter(field => field.categoryId !== categoryId);
      setCategories(updatedCategories);
      setFields(updatedFields);
    } catch (err) {
      console.error('Failed to delete category:', err);
      throw err;
    }
  };

  // Subcategory management
  const addSubcategory = async (categoryId: string, subcategory: { name: string }) => {
    try {
      console.log('Creating subcategory:', { categoryId, subcategory }); // Debug log
      const newSubcategory = await masterFieldsApi.createSubcategory(categoryId, subcategory);
      console.log('Subcategory created:', newSubcategory); // Debug log
      const updatedCategories = categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            subcategories: [...(cat.subcategories || []), newSubcategory as any],
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
    } catch (err) {
      console.error('Failed to add subcategory:', err);
      throw err;
    }
  };

  const updateSubcategory = async (categoryId: string, subcategoryId: string, name: string) => {
    try {
      await masterFieldsApi.updateSubcategory(categoryId, subcategoryId, { name });
      const updatedCategories = categories.map(cat => {
        if (cat.id === categoryId && cat.subcategories) {
          return {
            ...cat,
            subcategories: cat.subcategories.map(sub =>
              sub.id === subcategoryId ? { ...sub, name } : sub
            ),
          };
        }
        return cat;
      });
      setCategories(updatedCategories);
    } catch (err) {
      console.error('Failed to update subcategory:', err);
      throw err;
    }
  };

  const deleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    try {
      await masterFieldsApi.deleteSubcategory(categoryId, subcategoryId);
      const updatedCategories = categories.map(cat => {
        if (cat.id === categoryId && cat.subcategories) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId),
          };
        }
        return cat;
      });
      const updatedFields = fields.filter(field => field.subcategoryId !== subcategoryId);
      setCategories(updatedCategories);
      setFields(updatedFields);
    } catch (err) {
      console.error('Failed to delete subcategory:', err);
      throw err;
    }
  };

  // Field management
  const addField = async (field: Omit<ApplicationField, 'id' | 'order'>) => {
    try {
      console.log('Creating field:', field); // Debug log
      const categoryFields = fields.filter(f => f.categoryId === field.categoryId);
      const newFieldData: any = {
        ...field,
        order: categoryFields.length + 1,
      };
      console.log('Sending field data to API:', newFieldData); // Debug log
      const newField = await masterFieldsApi.createMasterField(newFieldData);
      console.log('Field created:', newField); // Debug log
      setFields([...fields, newField as unknown as ApplicationField]);
      return newField.id;
    } catch (err) {
      console.error('Failed to add field:', err);
      throw err;
    }
  };

  const updateField = async (fieldId: string, updates: Partial<ApplicationField>) => {
    try {
      await masterFieldsApi.updateMasterField(fieldId, updates as any);
      const updatedFields = fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      );
      setFields(updatedFields);
    } catch (err) {
      console.error('Failed to update field:', err);
      throw err;
    }
  };

  const deleteField = async (fieldId: string) => {
    try {
      await masterFieldsApi.deleteMasterField(fieldId);
      const updatedFields = fields.filter(field => field.id !== fieldId);
      setFields(updatedFields);
    } catch (err) {
      console.error('Failed to delete field:', err);
      throw err;
    }
  };

  return {
    categories,
    fields,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    addField,
    updateField,
    deleteField,
  };
};