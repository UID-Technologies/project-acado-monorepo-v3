// src/schemas/courseCategory.schema.ts
import { z } from 'zod';
import { objectId } from './shared.js';

const baseSchema = z.object({
  name: z.string().min(2).max(128),
  shortName: z.string().min(2).max(32),
  code: z.string().min(1).max(32).optional().or(z.literal('')),
  parentId: objectId.optional().nullable(),
  description: z.string().max(512).optional(),
  keywords: z.string().max(256).optional(),
  isActive: z.boolean().optional(),
});

export const createCourseCategorySchema = z.object({
  body: baseSchema.transform((data) => ({
    ...data,
    code: data.code || undefined,
    parentId: data.parentId ?? null,
    isActive: data.isActive ?? true,
  })),
});

export const updateCourseCategorySchema = z.object({
  params: z.object({ id: objectId }),
  body: baseSchema
    .partial()
    .transform((data) => ({
      ...data,
      code: data.code === '' ? undefined : data.code,
      parentId: data.parentId ?? data.parentId,
    })),
});

export const courseCategoryIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});


