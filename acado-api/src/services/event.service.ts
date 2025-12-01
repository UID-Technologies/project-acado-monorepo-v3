// src/services/event.service.ts
import Event from '../models/Event.js';
import { Types } from 'mongoose';

export async function listEvents(filters: {
  status?: string;
  mode?: string;
  difficultyLevel?: string;
  subscriptionType?: string;
  isPopular?: boolean;
  search?: string;
} = {}) {
  const query: Record<string, any> = {};
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.mode) {
    query.mode = filters.mode;
  }
  
  if (filters.difficultyLevel) {
    query.difficultyLevel = filters.difficultyLevel;
  }
  
  if (filters.subscriptionType) {
    query.subscriptionType = filters.subscriptionType;
  }
  
  if (filters.isPopular !== undefined) {
    query.isPopular = filters.isPopular;
  }
  
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { categoryTags: { $in: [new RegExp(filters.search, 'i')] } },
      { conductedBy: { $regex: filters.search, $options: 'i' } },
    ];
  }

  const events = await Event.find(query).sort({ eventDate: 1, createdAt: -1 });
  return events.map((e) => e.toJSON());
}

export async function getEventById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const event = await Event.findById(id);
  return event ? event.toJSON() : null;
}

export async function createEvent(data: any, userId: string) {
  const payload: Record<string, any> = {
    logo: data.logo,
    title: data.title,
    categoryTags: data.categoryTags || [],
    conductedBy: data.conductedBy,
    functionalDomain: data.functionalDomain,
    jobRole: data.jobRole,
    skills: data.skills || [],
    difficultyLevel: data.difficultyLevel,
    subscriptionType: data.subscriptionType,
    isPopular: data.isPopular || false,
    description: data.description,
    whatsInItForYou: data.whatsInItForYou,
    instructions: data.instructions,
    faq: data.faq,
    registrationStartDate: new Date(data.registrationStartDate),
    registrationEndDate: new Date(data.registrationEndDate),
    eventDate: new Date(data.eventDate),
    eventTime: data.eventTime,
    mode: data.mode,
    venue: data.venue,
    expertId: data.expertId,
    expertName: data.expertName,
    additionalInfo: data.additionalInfo,
    eligibility: data.eligibility,
    registrationSettings: data.registrationSettings,
    stages: data.stages || [],
    status: data.status || 'draft',
    createdBy: userId,
  };

  if (data.status === 'active') {
    payload.publishedAt = new Date();
  }

  const event = new Event(payload);
  await event.save();
  return event.toJSON();
}

export async function updateEvent(id: string, data: any) {
  if (!Types.ObjectId.isValid(id)) return null;
  
  const updateData: Record<string, any> = {};
  
  // Basic fields
  if (data.logo !== undefined) updateData.logo = data.logo;
  if (data.title !== undefined) updateData.title = data.title;
  if (data.categoryTags !== undefined) updateData.categoryTags = data.categoryTags;
  if (data.conductedBy !== undefined) updateData.conductedBy = data.conductedBy;
  if (data.functionalDomain !== undefined) updateData.functionalDomain = data.functionalDomain;
  if (data.jobRole !== undefined) updateData.jobRole = data.jobRole;
  if (data.skills !== undefined) updateData.skills = data.skills;
  if (data.difficultyLevel !== undefined) updateData.difficultyLevel = data.difficultyLevel;
  if (data.subscriptionType !== undefined) updateData.subscriptionType = data.subscriptionType;
  if (data.isPopular !== undefined) updateData.isPopular = data.isPopular;
  
  // Description fields
  if (data.description !== undefined) updateData.description = data.description;
  if (data.whatsInItForYou !== undefined) updateData.whatsInItForYou = data.whatsInItForYou;
  if (data.instructions !== undefined) updateData.instructions = data.instructions;
  if (data.faq !== undefined) updateData.faq = data.faq;
  
  // Schedule fields
  if (data.registrationStartDate !== undefined) updateData.registrationStartDate = new Date(data.registrationStartDate);
  if (data.registrationEndDate !== undefined) updateData.registrationEndDate = new Date(data.registrationEndDate);
  if (data.eventDate !== undefined) updateData.eventDate = new Date(data.eventDate);
  if (data.eventTime !== undefined) updateData.eventTime = data.eventTime;
  if (data.mode !== undefined) updateData.mode = data.mode;
  if (data.venue !== undefined) updateData.venue = data.venue;
  
  // Other fields
  if (data.expertId !== undefined) updateData.expertId = data.expertId;
  if (data.expertName !== undefined) updateData.expertName = data.expertName;
  if (data.additionalInfo !== undefined) updateData.additionalInfo = data.additionalInfo;
  
  // Complex fields
  if (data.eligibility !== undefined) updateData.eligibility = data.eligibility;
  if (data.registrationSettings !== undefined) updateData.registrationSettings = data.registrationSettings;
  if (data.stages !== undefined) updateData.stages = data.stages;
  
  // Status
  if (data.status !== undefined) {
    updateData.status = data.status;
    if (data.status === 'active' && !data.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  const event = await Event.findByIdAndUpdate(id, updateData, { new: true });
  return event ? event.toJSON() : null;
}

export async function deleteEvent(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const event = await Event.findByIdAndDelete(id);
  return event ? event.toJSON() : null;
}

export async function incrementViews(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const event = await Event.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
  return event ? event.toJSON() : null;
}

export async function incrementRegistrations(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const event = await Event.findByIdAndUpdate(id, { $inc: { registrations: 1 } }, { new: true });
  return event ? event.toJSON() : null;
}

