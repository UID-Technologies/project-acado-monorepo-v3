// src/modules/scholarship/scholarship.service.ts
import { Types } from 'mongoose';
import { ScholarshipRepository } from './scholarship.repo.js';
import { NotFoundError, ValidationError } from '../../core/http/ApiError.js';
import {
  CreateScholarshipDto,
  UpdateScholarshipDto,
  ListScholarshipsDto,
} from './scholarship.dto.js';

export class ScholarshipService {
  private scholarshipRepo: ScholarshipRepository;

  constructor() {
    this.scholarshipRepo = new ScholarshipRepository();
  }

  async listScholarships(filters: ListScholarshipsDto = {}) {
    // Use existing service for complex filtering
    const { listScholarships: listScholarshipsService } = await import('../../services/scholarship.service.js');
    return listScholarshipsService(filters);
  }

  async getScholarshipById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid scholarship ID');
    }

    const scholarship = await this.scholarshipRepo.findById(id);
    if (!scholarship) {
      throw new NotFoundError('Scholarship not found');
    }
    return scholarship.toJSON();
  }

  async createScholarship(data: CreateScholarshipDto, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new ValidationError('Invalid user ID');
    }

    const { createScholarship: createScholarshipService } = await import('../../services/scholarship.service.js');
    return createScholarshipService(data, userId);
  }

  async updateScholarship(id: string, data: UpdateScholarshipDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid scholarship ID');
    }

    const { updateScholarship: updateScholarshipService } = await import('../../services/scholarship.service.js');
    return updateScholarshipService(id, data);
  }

  async deleteScholarship(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid scholarship ID');
    }

    const { deleteScholarship: deleteScholarshipService } = await import('../../services/scholarship.service.js');
    return deleteScholarshipService(id);
  }

  async incrementViews(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid scholarship ID');
    }

    const scholarship = await this.scholarshipRepo.findById(id);
    if (!scholarship) {
      throw new NotFoundError('Scholarship not found');
    }

    const updated = await this.scholarshipRepo.update(id, {
      views: ((scholarship.toJSON() as any).views || 0) + 1,
    } as any);
    return updated?.toJSON();
  }

  async incrementApplications(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid scholarship ID');
    }

    const scholarship = await this.scholarshipRepo.findById(id);
    if (!scholarship) {
      throw new NotFoundError('Scholarship not found');
    }

    const updated = await this.scholarshipRepo.update(id, {
      applications: ((scholarship.toJSON() as any).applications || 0) + 1,
    } as any);
    return updated?.toJSON();
  }
}

