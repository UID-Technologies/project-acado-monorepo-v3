// src/modules/application/application.service.ts
import { Types } from 'mongoose';
import { ApplicationRepository } from './application.repo.js';
import { NotFoundError, ValidationError, ConflictError } from '../../core/http/ApiError.js';
import {
  CreateApplicationInput,
  UpdateApplicationInput,
  QueryApplicationsInput,
} from '../../services/application.service.js';

export class ApplicationService {
  private applicationRepo: ApplicationRepository;

  constructor() {
    this.applicationRepo = new ApplicationRepository();
  }

  async listApplications(query: QueryApplicationsInput = {}) {
    // Use existing service logic for now
    const { listApplications: listApplicationsService } = await import('../../services/application.service.js');
    return listApplicationsService(query);
  }

  async getApplicationById(id: string, enrich = true) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid application ID');
    }

    const application = await this.applicationRepo.findById(id);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (enrich) {
      const { enrichApplication } = await import('../../services/application.service.js');
      return enrichApplication(application.toJSON());
    }

    return application.toJSON();
  }

  async createApplication(data: CreateApplicationInput, userId?: string) {
    const { createApplication: createApplicationService } = await import('../../services/application.service.js');
    return createApplicationService(data, userId as any);
  }

  async updateApplication(id: string, data: UpdateApplicationInput) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid application ID');
    }

    const { updateApplication: updateApplicationService } = await import('../../services/application.service.js');
    return updateApplicationService(id, data);
  }

  async deleteApplication(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid application ID');
    }

    const { deleteApplication: deleteApplicationService } = await import('../../services/application.service.js');
    return deleteApplicationService(id);
  }

  async submitApplication(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid application ID');
    }

    const application = await this.applicationRepo.findById(id);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (application.status !== 'draft') {
      throw new ConflictError('Only draft applications can be submitted');
    }

    const updated = await this.applicationRepo.update(id, {
      status: 'submitted',
      submittedAt: new Date(),
    } as any);

    return updated?.toJSON();
  }

  async withdrawApplication(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid application ID');
    }

    const application = await this.applicationRepo.findById(id);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (['accepted', 'rejected', 'withdrawn'].includes(application.status)) {
      throw new ConflictError(`Cannot withdraw application with status: ${application.status}`);
    }

    const updated = await this.applicationRepo.update(id, {
      status: 'withdrawn',
    } as any);

    return updated?.toJSON();
  }

  async reviewApplication(id: string, data: { status: string; reviewNotes?: string }, reviewerId?: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ValidationError('Invalid application ID');
    }

    const application = await this.applicationRepo.findById(id);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    const updated = await this.applicationRepo.update(id, {
      status: data.status,
      reviewNotes: data.reviewNotes,
      reviewedAt: new Date(),
      reviewedBy: reviewerId,
    } as any);

    return updated?.toJSON();
  }

  async getApplicationStats(filters: any = {}) {
    const { getApplicationStats: getStatsService } = await import('../../services/application.service.js');
    return getStatsService(filters);
  }
}

