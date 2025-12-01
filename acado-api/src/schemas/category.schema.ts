// src/schemas/category.schema.ts
import { z } from 'zod';
import { objectId } from './shared.js';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(64),
    icon: z.string().min(1),
    description: z.string().max(256).optional(),
    order: z.number().optional(),
    isCustom: z.boolean().optional()
  })
});

export const addSubcategorySchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ name: z.string().min(2).max(64) })
});

export const deleteSubcategorySchema = z.object({
  params: z.object({ id: objectId, subId: objectId })
});
