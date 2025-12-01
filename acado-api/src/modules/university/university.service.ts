// src/modules/university/university.service.ts
import { Types } from 'mongoose';
import { UniversityRepository } from './university.repo.js';
import Course from '../../models/Course.js';
import { NotFoundError, ConflictError } from '../../core/http/ApiError.js';
import {
  CreateUniversityDto,
  UpdateUniversityDto,
  ListUniversitiesDto,
} from './university.dto.js';

const DEFAULT_PAGE_SIZE = 20;

function toSummary(university: any) {
  return {
    id: university.id || university._id?.toString(),
    name: university.name,
    shortName: university.shortName,
    institutionType: university.institutionType,
    status: university.status ?? 'Active',
    organizationId: university.organizationId
      ? university.organizationId.toString()
      : null,
    organizationLevel: university.organizationLevel,
    parentInstitutionId: university.parentInstitutionId ? university.parentInstitutionId.toString() : null,
    location: {
      city: university.location?.city,
      state: university.location?.state,
      country: university.location?.country,
    },
    tags: {
      isVerified: university.tags?.isVerified ?? false,
    },
    stats: {
      rating: university.rating,
      rank: university.rank,
      totalStudents: university.factsAndFigures?.totalStudents ?? 0,
      internationalStudents: university.factsAndFigures?.internationalStudents ?? 0,
    },
    isActive: university.isActive,
    createdAt: university.createdAt,
    updatedAt: university.updatedAt,
  };
}

export class UniversityService {
  private universityRepo: UniversityRepository;

  constructor() {
    this.universityRepo = new UniversityRepository();
  }

  async listUniversities(filters: ListUniversitiesDto = {}) {
    try {
      const {
        search,
        country,
        institutionType,
        organizationId,
        parentInstitutionId,
        isActive,
        status,
      } = filters;

      const query: any = {};

      if (country) {
        query['location.country'] = country;
      }

      if (institutionType) {
        query.institutionType = institutionType;
      }

      if (typeof isActive === 'boolean') {
        query.isActive = isActive;
      }

      if (status && ['Active', 'Suspended'].includes(status)) {
        query.status = status;
      }

      if (organizationId && Types.ObjectId.isValid(organizationId)) {
        query.organizationId = new Types.ObjectId(organizationId);
      }

      if (typeof parentInstitutionId === 'string') {
        if (parentInstitutionId === '' || parentInstitutionId === 'null') {
          query.parentInstitutionId = null;
        } else if (Types.ObjectId.isValid(parentInstitutionId)) {
          query.parentInstitutionId = new Types.ObjectId(parentInstitutionId);
        }
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { shortName: { $regex: search, $options: 'i' } },
          { tagline: { $regex: search, $options: 'i' } },
          { 'location.city': { $regex: search, $options: 'i' } },
          { 'location.state': { $regex: search, $options: 'i' } },
          { 'location.country': { $regex: search, $options: 'i' } },
        ];
      }

      const universities = await this.universityRepo.find(query);
      
      // Sort by createdAt desc, then name asc
      const sorted = universities.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (dateB !== dateA) return dateB - dateA;
        return (a.name || '').localeCompare(b.name || '');
      });

      return sorted.map(toSummary);
    } catch (error: any) {
      console.error('UniversityService.listUniversities error:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        filters,
      });
      throw error;
    }
  }

  async getUniversityById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundError('Invalid university ID');
    }

    const university = await this.universityRepo.findById(id);
    if (!university) {
      throw new NotFoundError('University not found');
    }

    // Populate parent institution if exists
    const universityJson = university.toJSON();
    if (universityJson.parentInstitutionId) {
      const parent = await this.universityRepo.findById(universityJson.parentInstitutionId);
      if (parent) {
        const parentJson = parent.toJSON();
        (universityJson as any).parentInstitution = {
          id: parentJson.id,
          name: parentJson.name,
          shortName: parentJson.shortName,
          institutionType: parentJson.institutionType,
          location: parentJson.location,
        };
      }
    }

    return universityJson;
  }

  async createUniversity(data: CreateUniversityDto, userId?: string) {
    const parentInstitutionId =
      data.parentInstitutionId && Types.ObjectId.isValid(data.parentInstitutionId)
        ? new Types.ObjectId(data.parentInstitutionId)
        : null;

    const university = await this.universityRepo.create({
      ...data,
      status: data.status ?? 'Active',
      organizationId:
        data.organizationId && Types.ObjectId.isValid(data.organizationId)
          ? new Types.ObjectId(data.organizationId)
          : undefined,
      parentInstitutionId,
      createdBy: userId && Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined,
    } as any);

    return university.toJSON();
  }

  async updateUniversity(id: string, data: UpdateUniversityDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundError('Invalid university ID');
    }

    const payload: any = { ...data };

    if (payload.status && !['Active', 'Suspended'].includes(payload.status)) {
      delete payload.status;
    }

    if (payload.parentInstitutionId === '' || payload.parentInstitutionId === null) {
      payload.parentInstitutionId = null;
    } else if (payload.parentInstitutionId && Types.ObjectId.isValid(payload.parentInstitutionId)) {
      payload.parentInstitutionId = new Types.ObjectId(payload.parentInstitutionId);
    } else if (payload.parentInstitutionId) {
      delete payload.parentInstitutionId;
    }

    if (payload.organizationId === '' || payload.organizationId === null) {
      payload.organizationId = null;
    } else if (payload.organizationId && Types.ObjectId.isValid(payload.organizationId)) {
      payload.organizationId = new Types.ObjectId(payload.organizationId);
    } else if (payload.organizationId) {
      delete payload.organizationId;
    }

    const university = await this.universityRepo.update(id, payload);
    if (!university) {
      throw new NotFoundError('University not found');
    }

    return university.toJSON();
  }

  async deleteUniversity(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundError('Invalid university ID');
    }

    const coursesCount = await Course.countDocuments({ universityId: id });
    if (coursesCount > 0) {
      throw new ConflictError('Cannot delete university with associated courses');
    }

    const deleted = await this.universityRepo.delete(id);
    if (!deleted) {
      throw new NotFoundError('University not found');
    }

    // Update courses to remove university reference
    await Course.updateMany({ universityId: id }, { $set: { universityId: null } });
  }

  async getUniversityStats() {
    const UniversityModel = (this.universityRepo as any).model;
    
    const [total, active, byType, byCountry] = await Promise.all([
      UniversityModel.countDocuments({}),
      UniversityModel.countDocuments({ isActive: true }),
      UniversityModel.aggregate([
        { $group: { _id: '$institutionType', count: { $sum: 1 } } },
      ]),
      UniversityModel.aggregate([
        { $group: { _id: '$location.country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    return {
      total,
      active,
      inactive: total - active,
      byType: byType.reduce((acc: Record<string, number>, item: any) => {
        acc[item._id || 'Unknown'] = item.count;
        return acc;
      }, {}),
      topCountries: byCountry.map((item: any) => ({
        country: item._id || 'Unknown',
        count: item.count,
      })),
    };
  }

  async getCourses(universityId: string) {
    if (!Types.ObjectId.isValid(universityId)) {
      throw new NotFoundError('Invalid university ID');
    }

    const university = await this.universityRepo.findById(universityId);
    if (!university) {
      throw new NotFoundError('University not found');
    }

    const courses = await Course.find({ universityId }).sort({ name: 1 });
    return courses.map(c => c.toJSON());
  }
}

