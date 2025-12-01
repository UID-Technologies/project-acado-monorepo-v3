// src/schemas/courseLevel.schema.ts
import { z } from 'zod';
import { objectId } from './shared.js';

const baseSchema = z.object({
  name: z.string().min(2).max(128),
  shortName: z.string().min(2).max(32),
  description: z.string().max(512).optional(),
  keywords: z.string().max(256).optional(),
  isActive: z.boolean().optional(),
});

export const createCourseLevelSchema = z.object({
  body: baseSchema.transform((data) => ({
    ...data,
    isActive: data.isActive ?? true,
  })),
});

export const updateCourseLevelSchema = z.object({
  params: z.object({ id: objectId }),
  body: baseSchema.partial(),
});

export const courseLevelIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});


