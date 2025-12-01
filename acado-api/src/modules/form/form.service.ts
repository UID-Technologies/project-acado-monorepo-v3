// src/modules/form/form.service.ts
import { Types } from 'mongoose';
import { FormRepository } from './form.repo.js';
import { NotFoundError, ValidationError } from '../../core/http/ApiError.js';
import Course from '../../models/Course.js';
import University from '../../models/University.js';
import {
  CreateFormInput,
  UpdateFormInput,
  QueryFormsInput,
} from '../../services/form.service.js';

export class FormService {
  private formRepo: FormRepository;

  constructor() {
    this.formRepo = new FormRepository();
  }

  async listForms(query: QueryFormsInput = {}) {
    // Use the existing service logic for now, but refactor to use repository
    const { listForms: listFormsService } = await import('../../services/form.service.js');
    return listFormsService(query);
  }

  async getFormById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid form ID');
    }

    const form = await this.formRepo.findById(id);
    if (!form) {
      throw new NotFoundError('Form not found');
    }

    // Enrich with related data
    const { enrichFormDocument } = await import('../../services/form.service.js');
    return enrichFormDocument(form);
  }

  async createForm(data: CreateFormInput, userId?: string) {
    const { createForm: createFormService } = await import('../../services/form.service.js');
    return createFormService(data, userId);
  }

  async updateForm(id: string, data: UpdateFormInput) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid form ID');
    }

    const { updateForm: updateFormService } = await import('../../services/form.service.js');
    return updateFormService(id, data);
  }

  async deleteForm(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid form ID');
    }

    const { deleteForm: deleteFormService } = await import('../../services/form.service.js');
    return deleteFormService(id);
  }

  async publishForm(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid form ID');
    }

    const form = await this.formRepo.update(id, { status: 'published', isLaunched: true });
    if (!form) {
      throw new NotFoundError('Form not found');
    }
    return form.toJSON();
  }

  async archiveForm(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid form ID');
    }

    const form = await this.formRepo.update(id, { status: 'archived' });
    if (!form) {
      throw new NotFoundError('Form not found');
    }
    return form.toJSON();
  }

  async duplicateForm(id: string, userId?: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid form ID');
    }

    const original = await this.formRepo.findById(id);
    if (!original) {
      throw new NotFoundError('Form not found');
    }

    const originalJson = original.toJSON();
    const duplicated = await this.formRepo.create({
      ...originalJson,
      name: `${originalJson.name} (Copy)`,
      title: `${originalJson.title} (Copy)`,
      status: 'draft',
      isLaunched: false,
      createdBy: userId,
    } as any);

    return duplicated.toJSON();
  }

  async getFormByCourseId(courseId: string) {
    if (!Types.ObjectId.isValid(courseId)) {
      throw new ValidationError('Invalid course ID');
    }

    const forms = await this.formRepo.findByCourseId(courseId);
    const activeForms = forms.filter(f => f.isActive && f.status === 'published');
    
    if (activeForms.length === 0) {
      return null;
    }

    // Return the first active form, or the most recent one
    const form = activeForms[0];
    const { enrichFormDocument } = await import('../../services/form.service.js');
    return enrichFormDocument(form);
  }
}

