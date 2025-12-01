// src/services/learningOutcome.service.ts
import LearningOutcome from '../models/LearningOutcome.js';
import { Types } from 'mongoose';
import { ApiError } from '../core/http/ApiError.js';

export interface ListLearningOutcomeParams {
  parentId?: string | null;
  includeInactive?: boolean;
}

export const listLearningOutcomes = async (params: ListLearningOutcomeParams = {}) => {
  const query: Record<string, any> = {};

  if (params.parentId === null) {
    query.$or = [{ parentId: null }, { parentId: { $exists: false } }];
  } else if (params.parentId && Types.ObjectId.isValid(params.parentId)) {
    query.parentId = params.parentId;
  }

  if (!params.includeInactive) {
    query.isActive = true;
  }

  const outcomes = await LearningOutcome.find(query).sort({ name: 1 });
  return outcomes.map((outcome) => outcome.toJSON());
};

export const getLearningOutcomeById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;
  const outcome = await LearningOutcome.findById(id);
  return outcome ? outcome.toJSON() : null;
};

export const createLearningOutcome = async (payload: any) => {
  const data: Record<string, any> = { ...payload };
  if (payload.parentId) {
    if (!Types.ObjectId.isValid(payload.parentId)) {
      throw new ApiError(400, 'Invalid parentId');
    }
    data.parentId = new Types.ObjectId(payload.parentId);
  } else {
    data.parentId = null;
  }
  const outcome = new LearningOutcome(data);
  await outcome.save();
  return outcome.toJSON();
};

export const updateLearningOutcome = async (id: string, payload: any) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid learning outcome id');
  }

  const data: Record<string, any> = { ...payload };
  if (payload.parentId !== undefined) {
    if (payload.parentId === null || payload.parentId === '') {
      data.parentId = null;
    } else if (Types.ObjectId.isValid(payload.parentId)) {
      data.parentId = new Types.ObjectId(payload.parentId);
    } else {
      throw new ApiError(400, 'Invalid parentId');
    }
  }

  const outcome = await LearningOutcome.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  return outcome ? outcome.toJSON() : null;
};

export const deleteLearningOutcome = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid learning outcome id');
  }

  const hasChildren = await LearningOutcome.exists({ parentId: id });
  if (hasChildren) {
    throw new ApiError(400, 'Cannot delete learning outcome with child outcomes');
  }

  await LearningOutcome.findByIdAndDelete(id);
};


