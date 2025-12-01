// src/services/courseLevel.service.ts
import CourseLevel from '../models/CourseLevel.js';
import { Types } from 'mongoose';
import ApiError from '../utils/ApiError.js';

export const listLevels = async (includeInactive = false) => {
  const query: Record<string, any> = {};
  if (!includeInactive) query.isActive = true;
  const levels = await CourseLevel.find(query).sort({ name: 1 });
  return levels.map((level) => level.toJSON());
};

export const getLevelById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  const level = await CourseLevel.findById(id);
  return level ? level.toJSON() : null;
};

export const createLevel = async (payload: any) => {
  const level = new CourseLevel(payload);
  await level.save();
  return level.toJSON();
};

export const updateLevel = async (id: string, payload: any) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid level id');
  }
  const level = await CourseLevel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  return level ? level.toJSON() : null;
};

export const deleteLevel = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid level id');
  }
  await CourseLevel.findByIdAndDelete(id);
};


