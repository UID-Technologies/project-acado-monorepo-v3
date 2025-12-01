// src/modules/course/course.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import Course from '../../models/Course.js';
import { Types, Document } from 'mongoose';
import { Course as ICourse } from '../../models/Course.js';

export type CourseDocument = Document<unknown, {}, ICourse> & ICourse;

export class CourseRepository extends BaseRepository<CourseDocument> {
  constructor() {
    super(Course as any);
  }

  async findByUniversity(universityId: string): Promise<CourseDocument[]> {
    return this.find({ universityId: new Types.ObjectId(universityId) } as any);
  }

  async findByType(type: string): Promise<CourseDocument[]> {
    return this.find({ type } as any);
  }

  async findByLevel(level: string): Promise<CourseDocument[]> {
    return this.find({ level } as any);
  }

  async findByCategory(categoryId: string): Promise<CourseDocument[]> {
    return this.find({ categoryId: new Types.ObjectId(categoryId) } as any);
  }

  async findActive(): Promise<CourseDocument[]> {
    return this.find({ isActive: true } as any);
  }
}

