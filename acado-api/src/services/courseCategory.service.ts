// src/services/courseCategory.service.ts
import CourseCategory from '../models/CourseCategory.js';
import { Types } from 'mongoose';
import { ApiError } from '../core/http/ApiError.js';

export interface ListCourseCategoryParams {
  parentId?: string | null;
  includeInactive?: boolean;
}

export const listCategories = async (params: ListCourseCategoryParams = {}) => {
  const query: Record<string, any> = {};

  if (params.parentId === null) {
    query.$or = [{ parentId: null }, { parentId: { $exists: false } }];
  } else if (params.parentId && Types.ObjectId.isValid(params.parentId)) {
    query.parentId = params.parentId;
  }

  if (!params.includeInactive) {
    query.isActive = true;
  }

  const categories = await CourseCategory.find(query).sort({ name: 1 });
  return categories.map((category) => category.toJSON());
};

export const getCategoryById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  const category = await CourseCategory.findById(id);
  return category ? category.toJSON() : null;
};

export const createCategory = async (payload: any) => {
  const data: Record<string, any> = { ...payload };
  if (payload.parentId) {
    if (!Types.ObjectId.isValid(payload.parentId)) {
      throw new ApiError(400, 'Invalid parentId');
    }
    data.parentId = new Types.ObjectId(payload.parentId);
  } else {
    data.parentId = null;
  }
  const category = new CourseCategory(data);
  await category.save();
  return category.toJSON();
};

export const updateCategory = async (id: string, payload: any) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid category id');
  }

  const data: Record<string, any> = { ...payload };
  if (payload.parentId !== undefined) {
    if (payload.parentId === null || payload.parentId === '') {
      data.parentId = null;
    } else if (Types.ObjectId.isValid(payload.parentId)) {
      data.parentId = new Types.ObjectId(payload.parentId);
    } else {
      throw new ApiError(400, 'Invalid parentId');
    }
  }

  const category = await CourseCategory.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  return category ? category.toJSON() : null;
};

export const deleteCategory = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid category id');
  }

  const hasChildren = await CourseCategory.exists({ parentId: id });
  if (hasChildren) {
    throw new ApiError(400, 'Cannot delete category with subcategories');
  }

  await CourseCategory.findByIdAndDelete(id);
};


