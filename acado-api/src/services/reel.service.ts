// src/services/reel.service.ts
import Reel from '../models/Reel.js';
import { Types } from 'mongoose';

export async function listReels(filters: {
  status?: string;
  visibility?: string;
  category?: string;
  search?: string;
} = {}) {
  const query: Record<string, any> = {};
  
  if (filters.status) {
    query.status = filters.status;
  }
  
  if (filters.visibility) {
    query.visibility = filters.visibility;
  }
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { tags: { $in: [new RegExp(filters.search, 'i')] } },
    ];
  }

  const reels = await Reel.find(query).sort({ createdAt: -1 });
  return reels.map((r) => r.toJSON());
}

export async function getReelById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const reel = await Reel.findById(id);
  return reel ? reel.toJSON() : null;
}

export async function createReel(data: any, userId: string) {
  const payload: Record<string, any> = {
    title: data.title,
    description: data.description,
    category: data.category,
    tags: data.tags || [],
    videoUrl: data.videoUrl,
    thumbnailUrl: data.thumbnailUrl,
    duration: data.duration,
    captionUrl: data.captionUrl,
    language: data.language || 'en',
    visibility: data.visibility || 'public',
    status: data.status || 'draft',
    scheduledPublishAt: data.scheduledPublishAt ? new Date(data.scheduledPublishAt) : undefined,
    createdBy: userId,
  };

  if (data.status === 'active' && !data.scheduledPublishAt) {
    payload.publishedAt = new Date();
  }

  const reel = new Reel(payload);
  await reel.save();
  return reel.toJSON();
}

export async function updateReel(id: string, data: any) {
  if (!Types.ObjectId.isValid(id)) return null;
  
  const updateData: Record<string, any> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.videoUrl !== undefined) updateData.videoUrl = data.videoUrl;
  if (data.thumbnailUrl !== undefined) updateData.thumbnailUrl = data.thumbnailUrl;
  if (data.duration !== undefined) updateData.duration = data.duration;
  if (data.captionUrl !== undefined) updateData.captionUrl = data.captionUrl;
  if (data.language !== undefined) updateData.language = data.language;
  if (data.visibility !== undefined) updateData.visibility = data.visibility;
  if (data.status !== undefined) {
    updateData.status = data.status;
    if (data.status === 'active' && !data.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }
  if (data.scheduledPublishAt !== undefined) {
    updateData.scheduledPublishAt = data.scheduledPublishAt ? new Date(data.scheduledPublishAt) : undefined;
  }

  const reel = await Reel.findByIdAndUpdate(id, updateData, { new: true });
  return reel ? reel.toJSON() : null;
}

export async function deleteReel(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const reel = await Reel.findByIdAndDelete(id);
  return reel ? reel.toJSON() : null;
}

export async function incrementViews(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const reel = await Reel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
  return reel ? reel.toJSON() : null;
}

export async function incrementLikes(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const reel = await Reel.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
  return reel ? reel.toJSON() : null;
}

