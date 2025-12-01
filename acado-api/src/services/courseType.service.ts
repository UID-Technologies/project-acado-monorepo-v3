// src/services/courseType.service.ts
import CourseType from '../models/CourseType.js';
import { Types } from 'mongoose';
import { ApiError } from '../core/http/ApiError.js';

export const listTypes = async (includeInactive = false) => {
  const query: Record<string, any> = {};
  if (!includeInactive) query.isActive = true;
  const types = await CourseType.find(query).sort({ name: 1 });
  return types.map((type) => type.toJSON());
};

export const getTypeById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  const type = await CourseType.findById(id);
  return type ? type.toJSON() : null;
};

export const createType = async (payload: any) => {
  const type = new CourseType(payload);
  await type.save();
  return type.toJSON();
};

export const updateType = async (id: string, payload: any) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid type id');
  }
  const type = await CourseType.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  return type ? type.toJSON() : null;
};

export const deleteType = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid type id');
  }
  await CourseType.findByIdAndDelete(id);
};


