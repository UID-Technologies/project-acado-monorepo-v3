// src/modules/scholarship/scholarship.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import Scholarship from '../../models/Scholarship.js';
import { Document } from 'mongoose';
import { Scholarship as IScholarship } from '../../models/Scholarship.js';

export type ScholarshipDocument = Document<unknown, {}, IScholarship> & IScholarship;

export class ScholarshipRepository extends BaseRepository<ScholarshipDocument> {
  constructor() {
    super(Scholarship as any);
  }

  async findByStatus(status: string): Promise<ScholarshipDocument[]> {
    return this.find({ status } as any);
  }

  async findByVisibility(visibility: string): Promise<ScholarshipDocument[]> {
    return this.find({ visibility } as any);
  }

  async findByType(type: string): Promise<ScholarshipDocument[]> {
    return this.find({ type } as any);
  }

  async findActive(): Promise<ScholarshipDocument[]> {
    return this.find({ status: 'active' } as any);
  }
}

