// src/services/communityPost.service.ts
import CommunityPost, { CommunityCategoryModel } from '../models/CommunityPost.js';
import { Types } from 'mongoose';

// Category operations
export async function listCategories() {
  const categories = await CommunityCategoryModel.find().sort({ name: 1 });
  return categories.map((c) => c.toJSON());
}

export async function getCategoryById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const category = await CommunityCategoryModel.findById(id);
  return category ? category.toJSON() : null;
}

export async function createCategory(data: { name: string; color?: string }, userId: string) {
  const category = new CommunityCategoryModel({
    name: data.name,
    color: data.color,
    createdBy: userId,
  });
  await category.save();
  return category.toJSON();
}

export async function updateCategory(id: string, data: { name?: string; color?: string }) {
  if (!Types.ObjectId.isValid(id)) return null;
  const updateData: Record<string, any> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.color !== undefined) updateData.color = data.color;
  const category = await CommunityCategoryModel.findByIdAndUpdate(id, updateData, { new: true });
  return category ? category.toJSON() : null;
}

export async function deleteCategory(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const category = await CommunityCategoryModel.findByIdAndDelete(id);
  return category ? category.toJSON() : null;
}

// Post operations
export async function listCommunityPosts(filters: {
  categoryId?: string;
  contentType?: string;
  isPinned?: boolean;
  search?: string;
} = {}) {
  const query: Record<string, any> = {};
  
  if (filters.categoryId && Types.ObjectId.isValid(filters.categoryId)) {
    query.categoryId = filters.categoryId;
  }
  
  if (filters.contentType) {
    query.contentType = filters.contentType;
  }
  
  if (filters.isPinned !== undefined) {
    query.isPinned = filters.isPinned;
  }
  
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
    ];
  }

  const posts = await CommunityPost.find(query).sort({ isPinned: -1, createdAt: -1 });
  return posts.map((p) => p.toJSON());
}

export async function getCommunityPostById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const post = await CommunityPost.findById(id);
  return post ? post.toJSON() : null;
}

export async function createCommunityPost(data: any, userId: string) {
  const payload: Record<string, any> = {
    title: data.title,
    description: data.description,
    contentType: data.contentType,
    categoryId: data.categoryId,
    thumbnail: data.thumbnail,
    media: data.media,
    isPinned: data.isPinned || false,
    createdBy: userId,
  };

  if (data.translations) {
    payload.translations = data.translations;
  }

  const post = new CommunityPost(payload);
  await post.save();
  return post.toJSON();
}

export async function updateCommunityPost(id: string, data: any) {
  if (!Types.ObjectId.isValid(id)) return null;
  
  const updateData: Record<string, any> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.contentType !== undefined) updateData.contentType = data.contentType;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
  if (data.media !== undefined) updateData.media = data.media;
  if (data.isPinned !== undefined) updateData.isPinned = data.isPinned;
  if (data.translations !== undefined) updateData.translations = data.translations;

  const post = await CommunityPost.findByIdAndUpdate(id, updateData, { new: true });
  return post ? post.toJSON() : null;
}

export async function deleteCommunityPost(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const post = await CommunityPost.findByIdAndDelete(id);
  return post ? post.toJSON() : null;
}

