// src/modules/courseType/courseType.service.ts
import { Types } from 'mongoose';
import { CourseTypeRepository } from './courseType.repo.js';
import { NotFoundError, ValidationError } from '../../core/http/ApiError.js';
import {
  CreateCourseTypeDto,
  UpdateCourseTypeDto,
  ListCourseTypesDto,
} from './courseType.dto.js';

export class CourseTypeService {
  private typeRepo: CourseTypeRepository;

  constructor() {
    this.typeRepo = new CourseTypeRepository();
  }

  async listTypes(params: ListCourseTypesDto = {}) {
    const { includeInactive = false } = params;

    let types;
    if (!includeInactive) {
      types = await this.typeRepo.findActive();
    } else {
      types = await this.typeRepo.findAll();
    }

    return types.map(t => t.toJSON());
  }

  async getTypeById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid type ID');
    }

    const type = await this.typeRepo.findById(id);
    if (!type) {
      throw new NotFoundError('Course type not found');
    }
    return type.toJSON();
  }

  async createType(data: CreateCourseTypeDto) {
    const type = await this.typeRepo.create(data);
    return type.toJSON();
  }

  async updateType(id: string, data: UpdateCourseTypeDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid type ID');
    }

    const type = await this.typeRepo.update(id, data);
    if (!type) {
      throw new NotFoundError('Course type not found');
    }
    return type.toJSON();
  }

  async deleteType(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid type ID');
    }

    await this.typeRepo.delete(id);
  }
}

