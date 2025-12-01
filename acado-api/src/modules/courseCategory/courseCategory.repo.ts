// src/modules/courseCategory/courseCategory.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import CourseCategory, { CourseCategoryDocument } from '../../models/CourseCategory.js';
import { Types } from 'mongoose';

export class CourseCategoryRepository extends BaseRepository<CourseCategoryDocument> {
  constructor() {
    super(CourseCategory as any);
  }

  async findByParent(parentId: string | null): Promise<CourseCategoryDocument[]> {
    if (parentId === null) {
      return this.find({ $or: [{ parentId: null }, { parentId: { $exists: false } }] } as any);
    }
    return this.find({ parentId: new Types.ObjectId(parentId) } as any);
  }

  async findActive(): Promise<CourseCategoryDocument[]> {
    return this.find({ isActive: true } as any);
  }

  async findAll(): Promise<CourseCategoryDocument[]> {
    return this.find({} as any);
  }

  async hasChildren(id: string): Promise<boolean> {
    const count = await CourseCategory.countDocuments({ parentId: new Types.ObjectId(id) });
    return count > 0;
  }
}

