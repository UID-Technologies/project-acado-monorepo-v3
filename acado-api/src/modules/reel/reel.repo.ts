// src/modules/reel/reel.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import Reel from '../../models/Reel.js';
import { Document } from 'mongoose';
import { Reel as IReel } from '../../models/Reel.js';

export type ReelDocument = Document<unknown, {}, IReel> & IReel;

export class ReelRepository extends BaseRepository<ReelDocument> {
  constructor() {
    super(Reel as any);
  }

  async findByStatus(status: string): Promise<ReelDocument[]> {
    return this.find({ status } as any);
  }

  async findByVisibility(visibility: string): Promise<ReelDocument[]> {
    return this.find({ visibility } as any);
  }

  async findByCategory(category: string): Promise<ReelDocument[]> {
    return this.find({ category } as any);
  }

  async findActive(): Promise<ReelDocument[]> {
    return this.find({ status: 'active' } as any);
  }

  async findAll(): Promise<ReelDocument[]> {
    return this.find({} as any);
  }
}

