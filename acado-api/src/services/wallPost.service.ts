// src/services/wallPost.service.ts
import WallPost from '../models/WallPost.js';
import { Types } from 'mongoose';

export async function listWallPosts(filters: {
  createdBy?: string;
  search?: string;
} = {}) {
  const query: Record<string, any> = {};
  
  if (filters.createdBy && Types.ObjectId.isValid(filters.createdBy)) {
    query.createdBy = filters.createdBy;
  }
  
  if (filters.search) {
    query.description = { $regex: filters.search, $options: 'i' };
  }

  const posts = await WallPost.find(query).sort({ createdAt: -1 });
  return posts.map((p) => p.toJSON());
}

export async function getWallPostById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const post = await WallPost.findById(id);
  return post ? post.toJSON() : null;
}

export async function createWallPost(data: any, userId: string) {
  const payload: Record<string, any> = {
    description: data.description,
    media: data.media,
    mediaType: data.mediaType,
    createdBy: userId,
  };

  const post = new WallPost(payload);
  await post.save();
  return post.toJSON();
}

export async function updateWallPost(id: string, data: any) {
  if (!Types.ObjectId.isValid(id)) return null;
  
  const updateData: Record<string, any> = {};
  if (data.description !== undefined) updateData.description = data.description;
  if (data.media !== undefined) updateData.media = data.media;
  if (data.mediaType !== undefined) updateData.mediaType = data.mediaType;

  const post = await WallPost.findByIdAndUpdate(id, updateData, { new: true });
  return post ? post.toJSON() : null;
}

export async function deleteWallPost(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const post = await WallPost.findByIdAndDelete(id);
  return post ? post.toJSON() : null;
}

