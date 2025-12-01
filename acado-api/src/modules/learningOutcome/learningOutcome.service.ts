// src/modules/learningOutcome/learningOutcome.service.ts
import { Types } from 'mongoose';
import { LearningOutcomeRepository } from './learningOutcome.repo.js';
import { NotFoundError, ConflictError, ValidationError } from '../../core/http/ApiError.js';
import {
  CreateLearningOutcomeDto,
  UpdateLearningOutcomeDto,
  ListLearningOutcomesDto,
} from './learningOutcome.dto.js';

export class LearningOutcomeService {
  private outcomeRepo: LearningOutcomeRepository;

  constructor() {
    this.outcomeRepo = new LearningOutcomeRepository();
  }

  async listLearningOutcomes(params: ListLearningOutcomesDto = {}) {
    const { parentId, includeInactive = false } = params;

    let outcomes;
    if (parentId !== undefined) {
      outcomes = await this.outcomeRepo.findByParent(parentId);
    } else if (!includeInactive) {
      outcomes = await this.outcomeRepo.findActive();
    } else {
      outcomes = await this.outcomeRepo.findAll();
    }

    return outcomes.map(o => o.toJSON());
  }

  async getLearningOutcomeById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid learning outcome ID');
    }

    const outcome = await this.outcomeRepo.findById(id);
    if (!outcome) {
      throw new NotFoundError('Learning outcome not found');
    }
    return outcome.toJSON();
  }

  async createLearningOutcome(data: CreateLearningOutcomeDto) {
    const payload: any = { ...data };
    
    if (data.parentId) {
      if (!Types.ObjectId.isValid(data.parentId)) {
        throw new ValidationError('Invalid parentId');
      }
      payload.parentId = new Types.ObjectId(data.parentId);
    } else {
      payload.parentId = null;
    }

    const outcome = await this.outcomeRepo.create(payload);
    return outcome.toJSON();
  }

  async updateLearningOutcome(id: string, data: UpdateLearningOutcomeDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid learning outcome ID');
    }

    const payload: any = { ...data };
    
    if (data.parentId !== undefined) {
      if (data.parentId === null || data.parentId === '') {
        payload.parentId = null;
      } else if (Types.ObjectId.isValid(data.parentId)) {
        payload.parentId = new Types.ObjectId(data.parentId);
      } else {
        throw new ValidationError('Invalid parentId');
      }
    }

    const outcome = await this.outcomeRepo.update(id, payload);
    if (!outcome) {
      throw new NotFoundError('Learning outcome not found');
    }
    return outcome.toJSON();
  }

  async deleteLearningOutcome(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid learning outcome ID');
    }

    const hasChildren = await this.outcomeRepo.hasChildren(id);
    if (hasChildren) {
      throw new ConflictError('Cannot delete learning outcome with child outcomes');
    }

    await this.outcomeRepo.delete(id);
  }
}

