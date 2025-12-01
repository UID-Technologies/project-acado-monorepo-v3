// src/modules/courseCategory/courseCategory.service.ts
import { Types } from 'mongoose';
import { CourseCategoryRepository } from './courseCategory.repo.js';
import { NotFoundError, ConflictError, ValidationError } from '../../core/http/ApiError.js';
import {
  CreateCourseCategoryDto,
  UpdateCourseCategoryDto,
  ListCourseCategoriesDto,
} from './courseCategory.dto.js';

export class CourseCategoryService {
  private categoryRepo: CourseCategoryRepository;

  constructor() {
    this.categoryRepo = new CourseCategoryRepository();
  }

  async listCategories(params: ListCourseCategoriesDto = {}) {
    const { parentId, includeInactive = false } = params;

    let categories;
    if (parentId !== undefined) {
      categories = await this.categoryRepo.findByParent(parentId);
    } else if (!includeInactive) {
      categories = await this.categoryRepo.findActive();
    } else {
      categories = await this.categoryRepo.findAll();
    }

    return categories.map(c => c.toJSON());
  }

  async getCategoryById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid category ID');
    }

    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError('Course category not found');
    }
    return category.toJSON();
  }

  async createCategory(data: CreateCourseCategoryDto) {
    const payload: any = { ...data };
    
    if (data.parentId) {
      if (!Types.ObjectId.isValid(data.parentId)) {
        throw new ValidationError('Invalid parentId');
      }
      payload.parentId = new Types.ObjectId(data.parentId);
    } else {
      payload.parentId = null;
    }

    const category = await this.categoryRepo.create(payload);
    return category.toJSON();
  }

  async updateCategory(id: string, data: UpdateCourseCategoryDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid category ID');
    }

    const payload: any = { ...data };
    
    if (data.parentId !== undefined) {
      if (data.parentId === null || data.parentId === '') {
        payload.parentId = null;
      } else if (Types.ObjectId.isValid(data.parentId)) {
        payload.parentId = new Types.ObjectId(data.parentId);
      } else {
        throw new ValidationError('Invalid parentId');
      }
    }

    const category = await this.categoryRepo.update(id, payload);
    if (!category) {
      throw new NotFoundError('Course category not found');
    }
    return category.toJSON();
  }

  async deleteCategory(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid category ID');
    }

    const hasChildren = await this.categoryRepo.hasChildren(id);
    if (hasChildren) {
      throw new ConflictError('Cannot delete category with subcategories');
    }

    await this.categoryRepo.delete(id);
  }
}

