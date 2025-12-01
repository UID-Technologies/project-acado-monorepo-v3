// src/services/course.service.ts
import Course from '../models/Course.js';
import { Types } from 'mongoose';

export async function listCourses(filters: {
  universityId?: string;
  type?: string;
  level?: string;
  typeId?: string;
  levelId?: string;
  categoryId?: string;
  isActive?: boolean;
} = {}) {
  const query: Record<string, any> = {};
  if (filters.universityId && Types.ObjectId.isValid(filters.universityId)) {
    query.universityId = filters.universityId;
  }
  if (filters.type) query.type = filters.type;
  if (filters.level) query.level = filters.level;
  const typeId = filters.typeId ?? (filters as any).courseTypeId;
  if (typeId && Types.ObjectId.isValid(typeId)) {
    query.typeId = typeId;
  }
  const levelId = filters.levelId ?? (filters as any).courseLevelId;
  if (levelId && Types.ObjectId.isValid(levelId)) {
    query.levelId = levelId;
  }
  const categoryId = filters.categoryId ?? (filters as any).courseCategoryId;
  if (categoryId && Types.ObjectId.isValid(categoryId)) {
    query.categoryId = categoryId;
  }
  if (filters.isActive !== undefined) query.isActive = filters.isActive;

  const courses = await Course.find(query).sort({ name: 1 });
  return courses.map((c) => c.toJSON());
}

export async function getCourseById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const course = await Course.findById(id);
  return course ? course.toJSON() : null;
}

export async function createCourse(data: any, userId?: string) {
  const payload: Record<string, any> = { ...data };

  if (typeof data.universityName === 'string') {
    payload.universityName = data.universityName.trim();
  }

  if (data.universityId && Types.ObjectId.isValid(data.universityId)) {
    payload.universityId = new Types.ObjectId(data.universityId);
  }
  const categoryId = data.categoryId ?? data.courseCategoryId;
  if (categoryId && Types.ObjectId.isValid(categoryId)) {
    payload.categoryId = new Types.ObjectId(categoryId);
  }
  const typeId = data.typeId ?? data.courseTypeId;
  if (typeId && Types.ObjectId.isValid(typeId)) {
    payload.typeId = new Types.ObjectId(typeId);
  }
  const levelId = data.levelId ?? data.courseLevelId;
  if (levelId && Types.ObjectId.isValid(levelId)) {
    payload.levelId = new Types.ObjectId(levelId);
  }
  const learningOutcomeIds = data.learningOutcomeIds ?? data.learningOutcomes;
  if (Array.isArray(learningOutcomeIds)) {
    payload.learningOutcomeIds = learningOutcomeIds
      .filter((id: string) => Types.ObjectId.isValid(id))
      .map((id: string) => new Types.ObjectId(id));
  }
  if (userId && Types.ObjectId.isValid(userId)) {
    payload.createdBy = new Types.ObjectId(userId);
  }

  const course = new Course(payload);
  await course.save();
  return course.toJSON();
}

export async function updateCourse(id: string, data: any) {
  if (!Types.ObjectId.isValid(id)) return null;

  const payload: Record<string, any> = { ...data };

  if (data.universityName !== undefined) {
    payload.universityName = typeof data.universityName === 'string'
      ? data.universityName.trim()
      : undefined;
  }

  if (data.universityId && Types.ObjectId.isValid(data.universityId)) {
    payload.universityId = new Types.ObjectId(data.universityId);
  }
  const categoryId = data.categoryId ?? data.courseCategoryId;
  if (categoryId !== undefined) {
    payload.categoryId =
      categoryId && Types.ObjectId.isValid(categoryId)
        ? new Types.ObjectId(categoryId)
        : null;
  }
  const typeId = data.typeId ?? data.courseTypeId;
  if (typeId !== undefined) {
    payload.typeId =
      typeId && Types.ObjectId.isValid(typeId) ? new Types.ObjectId(typeId) : null;
  }
  const levelId = data.levelId ?? data.courseLevelId;
  if (levelId !== undefined) {
    payload.levelId =
      levelId && Types.ObjectId.isValid(levelId) ? new Types.ObjectId(levelId) : null;
  }
  const learningOutcomeIds = data.learningOutcomeIds ?? data.learningOutcomes;
  if (learningOutcomeIds !== undefined) {
    payload.learningOutcomeIds = Array.isArray(learningOutcomeIds)
      ? learningOutcomeIds
          .filter((id: string) => Types.ObjectId.isValid(id))
          .map((id: string) => new Types.ObjectId(id))
      : [];
  }

  const course = await Course.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  return course ? course.toJSON() : null;
}

export async function deleteCourse(id: string) {
  if (!Types.ObjectId.isValid(id)) return false;
  const result = await Course.findByIdAndDelete(id);
  return !!result;
}

export async function getCoursesByUniversityId(universityId: string) {
  if (!Types.ObjectId.isValid(universityId)) return [];
  const courses = await Course.find({ universityId });
  return courses.map(c => c.toJSON());
}

