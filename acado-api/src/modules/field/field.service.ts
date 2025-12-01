// src/modules/field/field.service.ts
import { FieldRepository } from './field.repo.js';
import Category from '../../models/Category.js';
import { NotFoundError } from '../../core/http/ApiError.js';
import {
  CreateFieldDto,
  UpdateFieldDto,
  QueryFieldsDto,
} from './field.dto.js';

export class FieldService {
  private fieldRepo: FieldRepository;

  constructor() {
    this.fieldRepo = new FieldRepository();
  }

  async searchFields(params: QueryFieldsDto) {
    try {
      const { search, categoryId, subcategoryId, sort } = params;

      let fields: any[];
      
      if (search) {
        fields = await this.fieldRepo.searchByNameOrLabel(search);
      } else if (categoryId && subcategoryId) {
        fields = await this.fieldRepo.findByCategoryAndSubcategory(categoryId, subcategoryId);
      } else if (categoryId) {
        fields = await this.fieldRepo.findByCategory(categoryId);
      } else {
        fields = await this.fieldRepo.find({});
      }

      // Apply sorting
      const sorted = sort 
        ? fields.sort((a, b) => {
            const [field, order] = sort.startsWith('-') 
              ? [sort.slice(1), -1] 
              : [sort, 1];
            return (a[field] > b[field] ? 1 : -1) * order;
          })
        : fields.sort((a, b) => (a.order || 0) - (b.order || 0));

      return sorted.map(f => {
        try {
          return f.toJSON ? f.toJSON() : f;
        } catch (error) {
          console.error('Error converting field to JSON:', error, f);
          // Fallback to manual conversion
          const fieldObj = f as any;
          return {
            id: fieldObj._id?.toString() || fieldObj.id,
            name: fieldObj.name,
            label: fieldObj.label,
            type: fieldObj.type,
            placeholder: fieldObj.placeholder,
            required: fieldObj.required ?? false,
            categoryId: fieldObj.categoryId,
            subcategoryId: fieldObj.subcategoryId,
            options: fieldObj.options,
            description: fieldObj.description,
            order: fieldObj.order || 0,
            validation: fieldObj.validation,
            isCustom: fieldObj.isCustom,
            createdAt: fieldObj.createdAt,
            updatedAt: fieldObj.updatedAt
          };
        }
      });
    } catch (error: any) {
      console.error('FieldService.searchFields error:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        params
      });
      throw error;
    }
  }

  async getFieldById(fieldId: string) {
    const field = await this.fieldRepo.findById(fieldId);
    if (!field) {
      throw new NotFoundError('Field not found');
    }
    return field.toJSON();
  }

  async createField(data: CreateFieldDto, createdBy?: string) {
    // Validate category exists
    const cat = await Category.findById(data.categoryId);
    if (!cat) {
      throw new NotFoundError('Category not found');
    }

    // If subcategory provided, assert it exists inside category
    if (data.subcategoryId) {
      const catDoc = cat.toJSON();
      const ok = catDoc.subcategories.some((s: any) => s.id === data.subcategoryId);
      if (!ok) {
        throw new NotFoundError('Subcategory not found');
      }
    }

    const field = await this.fieldRepo.create({ ...data, createdBy });
    return field.toJSON();
  }

  async updateField(fieldId: string, data: UpdateFieldDto) {
    // Validate category if updating
    if (data.categoryId) {
      const cat = await Category.findById(data.categoryId);
      if (!cat) {
        throw new NotFoundError('Category not found');
      }
    }

    const updated = await this.fieldRepo.update(fieldId, data);
    if (!updated) {
      throw new NotFoundError('Field not found');
    }
    return updated.toJSON();
  }

  async deleteField(fieldId: string) {
    const deleted = await this.fieldRepo.delete(fieldId);
    if (!deleted) {
      throw new NotFoundError('Field not found');
    }
  }
}

