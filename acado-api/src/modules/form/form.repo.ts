// src/modules/form/form.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import Form from '../../models/Form.js';
import { Document } from 'mongoose';
import { Form as IForm } from '../../models/Form.js';

export type FormDocument = Document<unknown, {}, IForm> & IForm;

export class FormRepository extends BaseRepository<FormDocument> {
  constructor() {
    super(Form as any);
  }

  async findByUniversity(universityId: string): Promise<FormDocument[]> {
    return this.find({ universityId } as any);
  }

  async findByStatus(status: string): Promise<FormDocument[]> {
    return this.find({ status } as any);
  }

  async findActive(): Promise<FormDocument[]> {
    return this.find({ isActive: true } as any);
  }

  async findByCourseId(courseId: string): Promise<FormDocument[]> {
    return this.find({ courseIds: courseId } as any);
  }
}

