// src/modules/field/field.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import Field, { FieldDocument } from './field.model.js';
import { FilterQuery } from 'mongoose';

export class FieldRepository extends BaseRepository<FieldDocument> {
  constructor() {
    super(Field as any);
  }

  async findByCategory(categoryId: string): Promise<FieldDocument[]> {
    return this.find({ categoryId });
  }

  async findByCategoryAndSubcategory(categoryId: string, subcategoryId: string): Promise<FieldDocument[]> {
    return this.find({ categoryId, subcategoryId });
  }

  async searchByNameOrLabel(search: string): Promise<FieldDocument[]> {
    return this.find({
      $or: [
        { label: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ]
    });
  }
}

