// src/modules/category/category.dto.ts
import { z } from 'zod';

export const createCategoryDto = z.object({
  name: z.string().min(1, 'Name is required'),
  icon: z.string().min(1, 'Icon is required'),
  description: z.string().optional(),
  order: z.number().int().positive().optional(),
  isCustom: z.boolean().optional(),
});

export const updateCategoryDto = createCategoryDto.partial();

export const addSubcategoryDto = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  order: z.number().int().positive().optional(),
});

export const updateSubcategoryDto = addSubcategoryDto.partial();

export const deleteSubcategoryDto = z.object({
  id: z.string(),
  subId: z.string(),
});

export type CreateCategoryDto = z.infer<typeof createCategoryDto>;
export type UpdateCategoryDto = z.infer<typeof updateCategoryDto>;
export type AddSubcategoryDto = z.infer<typeof addSubcategoryDto>;
export type UpdateSubcategoryDto = z.infer<typeof updateSubcategoryDto>;

