// src/modules/organization/organization.service.ts
import { Types } from 'mongoose';
import { OrganizationRepository } from './organization.repo.js';
import { NotFoundError, ValidationError, ConflictError } from '../../core/http/ApiError.js';
import User from '../../models/User.js';
import {
  CreateOrganizationInput,
} from '../../schemas/organization.schema.js';

export class OrganizationService {
  private organizationRepo: OrganizationRepository;

  constructor() {
    this.organizationRepo = new OrganizationRepository();
  }

  async listOrganizations() {
    const organizations = await this.organizationRepo.find({});
    return organizations.map((org: any) => org.toJSON());
  }

  async listOrganizationsPublic() {
    const organizations = await this.organizationRepo.findActive();
    return organizations.map(org => {
      const json = org.toJSON();
      return {
        id: json.id,
        name: json.name,
        shortName: json.shortName,
        type: json.type,
      };
    });
  }

  async getOrganizationById(organizationId: string) {
    if (!Types.ObjectId.isValid(organizationId)) {
      throw new ValidationError('Invalid organization identifier');
    }

    const organization = await this.organizationRepo.findById(organizationId);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }

    // Get admin user
    const adminUser = await User.findOne({
      organizationId: organization._id,
      role: 'admin',
    }).select({ name: 1, email: 1, mobileNo: 1 }).lean();

    const orgJson = organization.toJSON();
    return {
      ...orgJson,
      adminUser: adminUser ? {
        id: adminUser._id.toString(),
        name: adminUser.name,
        email: adminUser.email,
        mobileNo: adminUser.mobileNo,
      } : null,
    };
  }

  async createOrganization(data: CreateOrganizationInput) {
    // Use existing service for complex logic
    const { createOrganization: createOrgService } = await import('../../services/organization.service.js');
    return createOrgService(data);
  }

  async updateOrganizationInfo(organizationId: string, data: any) {
    if (!Types.ObjectId.isValid(organizationId)) {
      throw new ValidationError('Invalid organization identifier');
    }

    const { updateOrganizationInfo: updateInfoService } = await import('../../services/organization.service.js');
    return updateInfoService(organizationId, data);
  }

  async updateOrganizationContacts(organizationId: string, data: any) {
    if (!Types.ObjectId.isValid(organizationId)) {
      throw new ValidationError('Invalid organization identifier');
    }

    const { updateOrganizationContacts: updateContactsService } = await import('../../services/organization.service.js');
    return updateContactsService(organizationId, data);
  }

  async updateOrganizationLocation(organizationId: string, data: any) {
    if (!Types.ObjectId.isValid(organizationId)) {
      throw new ValidationError('Invalid organization identifier');
    }

    const { updateOrganizationLocation: updateLocationService } = await import('../../services/organization.service.js');
    return updateLocationService(organizationId, data);
  }

  async updateOrganizationSuspension(organizationId: string, suspended: boolean) {
    if (!Types.ObjectId.isValid(organizationId)) {
      throw new ValidationError('Invalid organization identifier');
    }

    const organization = await this.organizationRepo.update(organizationId, { suspended } as any);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }
    return organization.toJSON();
  }

  async updateOrganizationOnboardingStage(organizationId: string, onboardingStage: string) {
    if (!Types.ObjectId.isValid(organizationId)) {
      throw new ValidationError('Invalid organization identifier');
    }

    const organization = await this.organizationRepo.update(organizationId, { onboardingStage } as any);
    if (!organization) {
      throw new NotFoundError('Organization not found');
    }
    return organization.toJSON();
  }

  async addOrganizationAdmin(organizationId: string, data: any) {
    if (!Types.ObjectId.isValid(organizationId)) {
      throw new ValidationError('Invalid organization identifier');
    }

    const { addOrganizationAdmin: addAdminService } = await import('../../services/organization.service.js');
    return addAdminService(organizationId, data);
  }
}

