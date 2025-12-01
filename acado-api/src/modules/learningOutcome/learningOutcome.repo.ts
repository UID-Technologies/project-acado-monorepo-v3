// src/modules/learningOutcome/learningOutcome.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import LearningOutcome, { LearningOutcomeDocument } from '../../models/LearningOutcome.js';
import { Types } from 'mongoose';

export class LearningOutcomeRepository extends BaseRepository<LearningOutcomeDocument> {
  constructor() {
    super(LearningOutcome as any);
  }

  async findByParent(parentId: string | null): Promise<LearningOutcomeDocument[]> {
    if (parentId === null) {
      return this.find({ $or: [{ parentId: null }, { parentId: { $exists: false } }] } as any);
    }
    return this.find({ parentId: new Types.ObjectId(parentId) } as any);
  }

  async findActive(): Promise<LearningOutcomeDocument[]> {
    return this.find({ isActive: true } as any);
  }

  async findAll(): Promise<LearningOutcomeDocument[]> {
    return this.find({} as any);
  }

  async hasChildren(id: string): Promise<boolean> {
    const count = await LearningOutcome.countDocuments({ parentId: new Types.ObjectId(id) });
    return count > 0;
  }
}

