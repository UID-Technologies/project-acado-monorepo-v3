// src/modules/organization/organization.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import Organization, { OrganizationDocument } from '../../models/Organization.js';

export class OrganizationRepository extends BaseRepository<OrganizationDocument> {
  constructor() {
    super(Organization as any);
  }

  async findByType(type: string): Promise<OrganizationDocument[]> {
    return this.find({ type } as any);
  }

  async findActive(): Promise<OrganizationDocument[]> {
    return this.find({ suspended: { $ne: true } } as any);
  }

  async findByShortName(shortName: string): Promise<OrganizationDocument | null> {
    return this.findOne({ shortName } as any);
  }
}

