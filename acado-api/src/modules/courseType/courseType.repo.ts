// src/modules/courseType/courseType.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import CourseType, { CourseTypeDocument } from '../../models/CourseType.js';

export class CourseTypeRepository extends BaseRepository<CourseTypeDocument> {
  constructor() {
    super(CourseType as any);
  }

  async findActive(): Promise<CourseTypeDocument[]> {
    return this.find({ isActive: true } as any);
  }

  async findAll(): Promise<CourseTypeDocument[]> {
    return this.find({} as any);
  }
}

