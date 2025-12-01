// src/modules/application/application.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import Application from '../../models/Application.js';
import { Document } from 'mongoose';
import { Application as IApplication } from '../../models/Application.js';

export type ApplicationDocument = Document<unknown, {}, IApplication> & IApplication;

export class ApplicationRepository extends BaseRepository<ApplicationDocument> {
  constructor() {
    super(Application as any);
  }

  async findByUser(userId: string): Promise<ApplicationDocument[]> {
    return this.find({ userId } as any);
  }

  async findByUniversity(universityId: string): Promise<ApplicationDocument[]> {
    return this.find({ universityId } as any);
  }

  async findByCourse(courseId: string): Promise<ApplicationDocument[]> {
    return this.find({ courseId } as any);
  }

  async findByForm(formId: string): Promise<ApplicationDocument[]> {
    return this.find({ formId } as any);
  }

  async findByStatus(status: string): Promise<ApplicationDocument[]> {
    return this.find({ status } as any);
  }
}

