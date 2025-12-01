// src/schemas/courseType.schema.ts
import { z } from 'zod';
import { objectId } from './shared.js';

const baseSchema = z.object({
  name: z.string().min(2).max(128),
  shortName: z.string().min(2).max(32),
  description: z.string().max(512).optional(),
  keywords: z.string().max(256).optional(),
  isActive: z.boolean().optional(),
});

export const createCourseTypeSchema = z.object({
  body: baseSchema.transform((data) => ({
    ...data,
    isActive: data.isActive ?? true,
  })),
});

export const updateCourseTypeSchema = z.object({
  params: z.object({ id: objectId }),
  body: baseSchema.partial(),
});

export const courseTypeIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});


