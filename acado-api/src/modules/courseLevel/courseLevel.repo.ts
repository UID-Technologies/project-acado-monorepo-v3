// src/modules/courseLevel/courseLevel.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import CourseLevel, { CourseLevelDocument } from '../../models/CourseLevel.js';

export class CourseLevelRepository extends BaseRepository<CourseLevelDocument> {
  constructor() {
    super(CourseLevel as any);
  }

  async findActive(): Promise<CourseLevelDocument[]> {
    return this.find({ isActive: true } as any);
  }

  async findAll(): Promise<CourseLevelDocument[]> {
    return this.find({} as any);
  }
}

