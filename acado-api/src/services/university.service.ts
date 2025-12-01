// src/services/university.service.ts
import { FilterQuery, Types } from 'mongoose';
import UniversityModel, { University } from '../models/University.js';
import Course from '../models/Course.js';

export interface ListUniversitiesFilters {
  search?: string;
  country?: string;
  institutionType?: string;
  organizationId?: string;
  parentInstitutionId?: string | null;
  isActive?: boolean;
  status?: 'Active' | 'Suspended';
  page?: number;
  pageSize?: number;
}

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

export async function listUniversities(filters: ListUniversitiesFilters = {}) {
  const {
    search,
    country,
    institutionType,
    organizationId,
    parentInstitutionId,
    isActive,
    status,
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
  } = filters;

  const query: FilterQuery<University> = {};

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
    query.status = status as any;
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

  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.min(100, Math.max(1, Number(pageSize) || DEFAULT_PAGE_SIZE));
  const skip = (safePage - 1) * safePageSize;

  const [items, total] = await Promise.all([
    UniversityModel.find(query)
      .sort({ createdAt: -1, name: 1 })
      .skip(skip)
      .limit(safePageSize)
      .lean(),
    UniversityModel.countDocuments(query),
  ]);

  return {
    data: items.map(toSummary),
    pagination: {
      page: safePage,
      pageSize: safePageSize,
      totalItems: total,
      totalPages: Math.max(1, Math.ceil(total / safePageSize)),
    },
  };
}

export async function getUniversityById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;

  const university = await UniversityModel.findById(id)
    .populate('parentInstitutionId', 'name shortName institutionType location')
    .lean();

  if (!university) return null;

  const parent = university.parentInstitutionId as any;

  return {
    ...university,
    id: university._id?.toString() ?? university.id,
    parentInstitutionId: parent?._id ? parent._id.toString() : university.parentInstitutionId ?? null,
    parentInstitution: parent?._id
      ? {
          id: parent._id.toString(),
          name: parent.name,
          shortName: parent.shortName,
          institutionType: parent.institutionType,
          location: parent.location,
        }
      : null,
  };
}

export async function createUniversity(data: any, userId?: string) {
  const parentInstitutionId =
    data.parentInstitutionId && Types.ObjectId.isValid(data.parentInstitutionId)
      ? new Types.ObjectId(data.parentInstitutionId)
      : null;

  const university = new UniversityModel({
    ...data,
    status: data.status ?? 'Active',
    organizationId:
      data.organizationId && Types.ObjectId.isValid(data.organizationId)
        ? new Types.ObjectId(data.organizationId)
        : undefined,
    parentInstitutionId,
    createdBy: userId && Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined,
  });

  await university.save();
  return university.toJSON();
}

export async function updateUniversity(id: string, data: any) {
  if (!Types.ObjectId.isValid(id)) return null;

  console.log('🔄 Updating university:', id);
  console.log('📦 Update payload:', JSON.stringify(data, null, 2));

  const payload = { ...data };

  if (payload.status && !['Active', 'Suspended'].includes(payload.status)) {
    delete payload.status;
  }

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

  // Log branding updates if present
  if (payload.branding) {
    console.log('🎨 Updating branding:', {
      logoUrl: payload.branding.logoUrl ? '✅ Present' : '❌ Missing',
      templateImageUrl: payload.branding.templateImageUrl ? '✅ Present' : '❌ Missing',
      brochureUrl: payload.branding.brochureUrl ? '✅ Present' : '❌ Missing',
      coverImageUrl: payload.branding.coverImageUrl ? '✅ Present' : '❌ Missing',
    });
  }

  const university = await UniversityModel.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true },
  );

  if (university) {
    console.log('✅ University updated successfully');
    console.log('🎨 Updated branding:', university.branding);
  } else {
    console.log('❌ University not found');
  }

  return university ? university.toJSON() : null;
}

export async function deleteUniversity(id: string) {
  if (!Types.ObjectId.isValid(id)) return false;

  const coursesCount = await Course.countDocuments({ universityId: id });
  if (coursesCount > 0) {
    throw new Error('Cannot delete university with associated courses');
  }

  const result = await UniversityModel.findById(id);
  if (!result) {
    return false;
  }

  await Course.updateMany({ universityId: id }, { $set: { universityId: null } });
  await UniversityModel.findByIdAndDelete(id);
  return true;
}

export async function getUniversityStats() {
  const [total, active, byType, byCountry] = await Promise.all([
    UniversityModel.countDocuments({}),
    UniversityModel.countDocuments({ isActive: true }),
    UniversityModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$institutionType', count: { $sum: 1 } } },
    ]),
    UniversityModel.aggregate<{ _id: string; count: number }>([
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

