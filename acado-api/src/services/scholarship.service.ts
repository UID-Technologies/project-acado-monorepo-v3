// src/services/scholarship.service.ts
import Scholarship from '../models/Scholarship.js';
import { Types } from 'mongoose';

export async function listScholarships(filters: {
  status?: string;
  visibility?: string;
  type?: string;
  studyLevel?: string;
  search?: string;
} = {}) {
  const query: Record<string, any> = {};
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.visibility) {
    query.visibility = filters.visibility;
  }
  
  if (filters.type) {
    query.type = filters.type;
  }
  
  if (filters.studyLevel) {
    query.studyLevel = filters.studyLevel;
  }
  
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { shortDescription: { $regex: filters.search, $options: 'i' } },
      { categoryTags: { $in: [new RegExp(filters.search, 'i')] } },
      { providerName: { $regex: filters.search, $options: 'i' } },
    ];
  }

  const scholarships = await Scholarship.find(query).sort({ applicationDeadline: 1, createdAt: -1 });
  return scholarships.map((s) => s.toJSON());
}

export async function getScholarshipById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const scholarship = await Scholarship.findById(id);
  return scholarship ? scholarship.toJSON() : null;
}

export async function createScholarship(data: any, userId: string) {
  const payload: Record<string, any> = {
    categoryTags: data.categoryTags || [],
    title: data.title,
    providerId: data.providerId,
    providerName: data.providerName,
    type: data.type,
    amount: data.amount,
    currency: data.currency || 'USD',
    numberOfAwards: data.numberOfAwards,
    duration: data.duration,
    studyLevel: data.studyLevel,
    fieldsOfStudy: data.fieldsOfStudy || [],
    applicationDeadline: new Date(data.applicationDeadline),
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    mode: data.mode,
    bannerUrl: data.bannerUrl,
    thumbnailUrl: data.thumbnailUrl,
    shortDescription: data.shortDescription,
    description: data.description,
    formFields: data.formFields || [],
    applicationTemplateUrl: data.applicationTemplateUrl,
    stages: data.stages || [],
    evaluationRules: data.evaluationRules,
    status: data.status || 'draft',
    visibility: data.visibility || 'public',
    createdBy: userId,
  };

  if (data.status === 'active') {
    payload.publishedAt = new Date();
  }

  const scholarship = new Scholarship(payload);
  await scholarship.save();
  return scholarship.toJSON();
}

export async function updateScholarship(id: string, data: any) {
  if (!Types.ObjectId.isValid(id)) return null;
  
  const updateData: Record<string, any> = {};
  
  // Basic fields
  if (data.categoryTags !== undefined) updateData.categoryTags = data.categoryTags;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.providerId !== undefined) updateData.providerId = data.providerId;
  if (data.providerName !== undefined) updateData.providerName = data.providerName;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.amount !== undefined) updateData.amount = data.amount;
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.numberOfAwards !== undefined) updateData.numberOfAwards = data.numberOfAwards;
  if (data.duration !== undefined) updateData.duration = data.duration;
  if (data.studyLevel !== undefined) updateData.studyLevel = data.studyLevel;
  if (data.fieldsOfStudy !== undefined) updateData.fieldsOfStudy = data.fieldsOfStudy;
  
  // Date fields
  if (data.applicationDeadline !== undefined) updateData.applicationDeadline = new Date(data.applicationDeadline);
  if (data.startDate !== undefined) updateData.startDate = data.startDate ? new Date(data.startDate) : undefined;
  if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : undefined;
  
  // Media fields
  if (data.mode !== undefined) updateData.mode = data.mode;
  if (data.bannerUrl !== undefined) updateData.bannerUrl = data.bannerUrl;
  if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
  
  // Description fields
  if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
  if (data.description !== undefined) updateData.description = data.description;
  
  // Form and stages
  if (data.formFields !== undefined) updateData.formFields = data.formFields;
  if (data.applicationTemplateUrl !== undefined) updateData.applicationTemplateUrl = data.applicationTemplateUrl;
  if (data.stages !== undefined) updateData.stages = data.stages;
  if (data.evaluationRules !== undefined) updateData.evaluationRules = data.evaluationRules;
  
  // Status and visibility
  if (data.status !== undefined) {
    updateData.status = data.status;
    if (data.status === 'active' && !data.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }
  if (data.visibility !== undefined) updateData.visibility = data.visibility;

  const scholarship = await Scholarship.findByIdAndUpdate(id, updateData, { new: true });
  return scholarship ? scholarship.toJSON() : null;
}

export async function deleteScholarship(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const scholarship = await Scholarship.findByIdAndDelete(id);
  return scholarship ? scholarship.toJSON() : null;
}

export async function incrementViews(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const scholarship = await Scholarship.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
  return scholarship ? scholarship.toJSON() : null;
}

export async function incrementApplications(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const scholarship = await Scholarship.findByIdAndUpdate(id, { $inc: { applications: 1 } }, { new: true });
  return scholarship ? scholarship.toJSON() : null;
}

