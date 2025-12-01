// src/modules/course/course.service.ts
import { Types } from 'mongoose';
import { CourseRepository } from './course.repo.js';
import { NotFoundError, ValidationError } from '../../core/http/ApiError.js';
import {
  CreateCourseDto,
  UpdateCourseDto,
  ListCoursesDto,
} from './course.dto.js';

export class CourseService {
  private courseRepo: CourseRepository;

  constructor() {
    this.courseRepo = new CourseRepository();
  }

  async listCourses(filters: ListCoursesDto = {}) {
    const query: any = {};

    if (filters.universityId && Types.ObjectId.isValid(filters.universityId)) {
      query.universityId = new Types.ObjectId(filters.universityId);
    }
    if (filters.type) query.type = filters.type;
    if (filters.level) query.level = filters.level;
    if (filters.typeId && Types.ObjectId.isValid(filters.typeId)) {
      query.typeId = new Types.ObjectId(filters.typeId);
    }
    if (filters.levelId && Types.ObjectId.isValid(filters.levelId)) {
      query.levelId = new Types.ObjectId(filters.levelId);
    }
    if (filters.categoryId && Types.ObjectId.isValid(filters.categoryId)) {
      query.categoryId = new Types.ObjectId(filters.categoryId);
    }
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    const courses = await this.courseRepo.find(query);
    return courses.map(c => c.toJSON());
  }

  async getCourseById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid course ID');
    }

    const course = await this.courseRepo.findById(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    return course.toJSON();
  }

  async createCourse(data: CreateCourseDto, userId?: string) {
    const payload: any = { ...data };

    if (data.universityName && typeof data.universityName === 'string') {
      payload.universityName = data.universityName.trim();
    }

    if (data.universityId && Types.ObjectId.isValid(data.universityId)) {
      payload.universityId = new Types.ObjectId(data.universityId);
    }
    if (data.categoryId && Types.ObjectId.isValid(data.categoryId)) {
      payload.categoryId = new Types.ObjectId(data.categoryId);
    }
    if (data.typeId && Types.ObjectId.isValid(data.typeId)) {
      payload.typeId = new Types.ObjectId(data.typeId);
    }
    if (data.levelId && Types.ObjectId.isValid(data.levelId)) {
      payload.levelId = new Types.ObjectId(data.levelId);
    }
    if (data.learningOutcomeIds && Array.isArray(data.learningOutcomeIds)) {
      payload.learningOutcomeIds = data.learningOutcomeIds
        .filter(id => Types.ObjectId.isValid(id))
        .map(id => new Types.ObjectId(id));
    }
    if (data.applicationFormId && Types.ObjectId.isValid(data.applicationFormId)) {
      payload.applicationFormId = new Types.ObjectId(data.applicationFormId);
    }
    if (userId && Types.ObjectId.isValid(userId)) {
      payload.createdBy = new Types.ObjectId(userId);
    }

    const course = await this.courseRepo.create(payload);
    return course.toJSON();
  }

  async updateCourse(id: string, data: UpdateCourseDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid course ID');
    }

    const payload: any = { ...data };

    if (data.universityName !== undefined) {
      payload.universityName = typeof data.universityName === 'string'
        ? data.universityName.trim()
        : undefined;
    }

    if (data.universityId && Types.ObjectId.isValid(data.universityId)) {
      payload.universityId = new Types.ObjectId(data.universityId);
    }
    if (data.categoryId !== undefined) {
      payload.categoryId = data.categoryId && Types.ObjectId.isValid(data.categoryId)
        ? new Types.ObjectId(data.categoryId)
        : null;
    }
    if (data.typeId !== undefined) {
      payload.typeId = data.typeId && Types.ObjectId.isValid(data.typeId)
        ? new Types.ObjectId(data.typeId)
        : null;
    }
    if (data.levelId !== undefined) {
      payload.levelId = data.levelId && Types.ObjectId.isValid(data.levelId)
        ? new Types.ObjectId(data.levelId)
        : null;
    }
    if (data.learningOutcomeIds !== undefined) {
      payload.learningOutcomeIds = Array.isArray(data.learningOutcomeIds)
        ? data.learningOutcomeIds
            .filter(id => Types.ObjectId.isValid(id))
            .map(id => new Types.ObjectId(id))
        : [];
    }
    if (data.applicationFormId !== undefined) {
      payload.applicationFormId = data.applicationFormId && Types.ObjectId.isValid(data.applicationFormId)
        ? new Types.ObjectId(data.applicationFormId)
        : null;
    }

    const course = await this.courseRepo.update(id, payload);
    if (!course) {
      throw new NotFoundError('Course not found');
    }
    return course.toJSON();
  }

  async deleteCourse(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid course ID');
    }

    const deleted = await this.courseRepo.delete(id);
    if (!deleted) {
      throw new NotFoundError('Course not found');
    }
  }

  async getCoursesByUniversityId(universityId: string) {
    if (!Types.ObjectId.isValid(universityId)) {
      throw new ValidationError('Invalid university ID');
    }

    const courses = await this.courseRepo.findByUniversity(universityId);
    return courses.map(c => c.toJSON());
  }
}

