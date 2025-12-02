// src/modules/category/category.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import Category, { CategoryDocument } from './category.model.js';
import { FilterQuery } from 'mongoose';

export class CategoryRepository extends BaseRepository<CategoryDocument> {
  constructor() {
    super(Category as any);
  }

  async findByName(name: string): Promise<CategoryDocument | null> {
    return this.findOne({ name });
  }

  async searchByName(search: string): Promise<CategoryDocument[]> {
    return this.find({ name: { $regex: search, $options: 'i' } });
  }

  async findAllSorted(): Promise<CategoryDocument[]> {
    const results = await this.find({});
    // Sort in memory since find() returns a Promise
    return results.sort((a, b) => {
      const orderA = (a as any).order || 0;
      const orderB = (b as any).order || 0;
      if (orderA !== orderB) return orderA - orderB;
      const nameA = (a as any).name || '';
      const nameB = (b as any).name || '';
      return nameA.localeCompare(nameB);
    });
  }
}

