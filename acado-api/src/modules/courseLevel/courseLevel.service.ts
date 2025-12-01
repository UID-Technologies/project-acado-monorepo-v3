// src/modules/courseLevel/courseLevel.service.ts
import { Types } from 'mongoose';
import { CourseLevelRepository } from './courseLevel.repo.js';
import { NotFoundError, ValidationError } from '../../core/http/ApiError.js';
import {
  CreateCourseLevelDto,
  UpdateCourseLevelDto,
  ListCourseLevelsDto,
} from './courseLevel.dto.js';

export class CourseLevelService {
  private levelRepo: CourseLevelRepository;

  constructor() {
    this.levelRepo = new CourseLevelRepository();
  }

  async listLevels(params: ListCourseLevelsDto = {}) {
    const { includeInactive = false } = params;

    let levels;
    if (!includeInactive) {
      levels = await this.levelRepo.findActive();
    } else {
      levels = await this.levelRepo.findAll();
    }

    return levels.map(l => l.toJSON());
  }

  async getLevelById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid level ID');
    }

    const level = await this.levelRepo.findById(id);
    if (!level) {
      throw new NotFoundError('Course level not found');
    }
    return level.toJSON();
  }

  async createLevel(data: CreateCourseLevelDto) {
    const level = await this.levelRepo.create(data);
    return level.toJSON();
  }

  async updateLevel(id: string, data: UpdateCourseLevelDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid level ID');
    }

    const level = await this.levelRepo.update(id, data);
    if (!level) {
      throw new NotFoundError('Course level not found');
    }
    return level.toJSON();
  }

  async deleteLevel(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid level ID');
    }

    await this.levelRepo.delete(id);
  }
}

