// src/modules/category/category.service.ts
import { Types } from 'mongoose';
import { CategoryRepository } from './category.repo.js';
import Field from '../../models/Field.js';
import { NotFoundError, ConflictError } from '../../core/http/ApiError.js';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  AddSubcategoryDto,
  UpdateSubcategoryDto,
} from './category.dto.js';

export class CategoryService {
  private categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  async listCategories(includeCount = false, search?: string) {
    try {
      let categories;
      
      if (search) {
        categories = await this.categoryRepo.searchByName(search);
      } else {
        categories = await this.categoryRepo.findAllSorted();
      }
      
      // Use lean() or toJSON() - toJSON() is safer as it applies schema transforms
      const categoriesJson = categories.map(cat => {
        try {
          return cat.toJSON ? cat.toJSON() : cat;
        } catch (error) {
          console.error('Error converting category to JSON:', error, cat);
          // Fallback to manual conversion
          const catObj = cat as any;
          return {
            id: catObj._id?.toString() || catObj.id,
            name: catObj.name,
            icon: catObj.icon || 'Folder',
            description: catObj.description,
            order: catObj.order || 1,
            isCustom: catObj.isCustom ?? true,
            subcategories: (catObj.subcategories || []).map((sub: any) => ({
              id: sub._id?.toString() || sub.id,
              categoryId: catObj._id?.toString() || catObj.id,
              name: sub.name,
              description: sub.description,
              order: sub.order
            })),
            createdAt: catObj.createdAt,
            updatedAt: catObj.updatedAt
          };
        }
      });

      if (!includeCount) return categoriesJson;

      const counts = await Field.aggregate([
        { $group: { _id: '$categoryId', count: { $sum: 1 } } }
      ]);
      const countMap = new Map(counts.map(c => [String(c._id), c.count]));
      return categoriesJson.map(c => ({ ...c, fieldCount: countMap.get(String(c.id)) ?? 0 }));
    } catch (error: any) {
      console.error('CategoryService.listCategories error:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        includeCount,
        search
      });
      throw error;
    }
  }

  async getCategoryById(categoryId: string) {
    const category = await this.categoryRepo.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category.toJSON();
  }

  async createCategory(data: CreateCategoryDto, createdBy?: string) {
    // Check if category with same name exists
    const existing = await this.categoryRepo.findByName(data.name);
    if (existing) {
      throw new ConflictError('Category with this name already exists');
    }

    const category = await this.categoryRepo.create({
      ...data,
      createdBy,
    });
    return category.toJSON();
  }

  async updateCategory(categoryId: string, data: UpdateCategoryDto) {
    // Check name uniqueness if updating name
    if (data.name) {
      const existing = await this.categoryRepo.findByName(data.name);
      if (existing && existing.id !== categoryId) {
        throw new ConflictError('Category with this name already exists');
      }
    }

    const updated = await this.categoryRepo.update(categoryId, data);
    if (!updated) {
      throw new NotFoundError('Category not found');
    }
    return updated.toJSON();
  }

  async addSubcategory(categoryId: string, data: AddSubcategoryDto) {
    const category = await this.categoryRepo.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const newSubcat = {
      _id: new Types.ObjectId(),
      name: data.name,
      description: data.description,
      order: data.order || (category.subcategories.length + 1)
    };

    (category.subcategories as any).push(newSubcat);
    await category.save();

    const saved = await this.categoryRepo.findById(categoryId);
    if (!saved) {
      throw new NotFoundError('Category not found');
    }
    const savedJson = saved.toJSON();
    return savedJson.subcategories[savedJson.subcategories.length - 1];
  }

  async updateSubcategory(categoryId: string, subId: string, data: UpdateSubcategoryDto) {
    const category = await this.categoryRepo.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const subcat: any = (category.subcategories as any).find((s: any) => String(s._id) === subId);
    if (!subcat) {
      throw new NotFoundError('Subcategory not found');
    }

    if (data.name !== undefined) subcat.name = data.name;
    if (data.description !== undefined) subcat.description = data.description;
    if (data.order !== undefined) subcat.order = data.order;

    await category.save();
    const saved = await this.categoryRepo.findById(categoryId);
    if (!saved) {
      throw new NotFoundError('Category not found');
    }
    const savedJson = saved.toJSON();
    return savedJson.subcategories.find(s => s.id === subId);
  }

  async deleteSubcategory(categoryId: string, subId: string) {
    const category = await this.categoryRepo.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const before = category.subcategories.length;
    (category.subcategories as any) = (category.subcategories as any).filter((s: any) => String(s._id) !== subId);
    if (category.subcategories.length === before) {
      throw new NotFoundError('Subcategory not found');
    }

    await category.save();
    // Also unset subcategoryId on fields pointing to it
    await Field.updateMany({ categoryId, subcategoryId: subId }, { $unset: { subcategoryId: 1 } });
  }

  async deleteCategory(categoryId: string, cascade = false) {
    const category = await this.categoryRepo.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const catId = category.id;
    await this.categoryRepo.delete(categoryId);

    if (cascade) {
      await Field.deleteMany({ categoryId: catId });
    } else {
      await Field.updateMany({ categoryId: catId }, { $unset: { categoryId: 1, subcategoryId: 1 } });
    }
  }
}

