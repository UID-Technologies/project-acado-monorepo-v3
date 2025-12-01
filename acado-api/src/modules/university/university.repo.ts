// src/modules/university/university.repo.ts
import { BaseRepository } from '../../infrastructure/database/mongo/BaseRepository.js';
import UniversityModel, { University } from '../../models/University.js';
import { Document } from 'mongoose';
import { FilterQuery } from 'mongoose';

export type UniversityDocument = Document<unknown, {}, University> & University;

export class UniversityRepository extends BaseRepository<UniversityDocument> {
  constructor() {
    super(UniversityModel as any);
  }

  async findByOrganization(organizationId: string): Promise<UniversityDocument[]> {
    return this.find({ organizationId } as any);
  }

  async findByCountry(country: string): Promise<UniversityDocument[]> {
    return this.find({ 'location.country': country } as any);
  }

  async findByInstitutionType(type: string): Promise<UniversityDocument[]> {
    return this.find({ institutionType: type } as any);
  }

  async searchUniversities(search: string): Promise<UniversityDocument[]> {
    return this.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { shortName: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } },
        { 'location.country': { $regex: search, $options: 'i' } },
      ]
    } as any);
  }
}

