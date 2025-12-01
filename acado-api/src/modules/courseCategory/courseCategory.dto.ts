// src/modules/courseCategory/courseCategory.dto.ts
import { z } from 'zod';
import { objectIdSchema } from '../../core/utils/validator.js';

export const createCourseCategoryDto = z.object({
  name: z.string().min(1, 'Name is required'),
  shortName: z.string().min(1, 'Short name is required'),
  code: z.string().optional(),
  parentId: objectIdSchema.optional().nullable(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateCourseCategoryDto = createCourseCategoryDto.partial();

export const listCourseCategoriesDto = z.object({
  parentId: z.string().optional().nullable(),
  includeInactive: z.coerce.boolean().optional(),
});

export type CreateCourseCategoryDto = z.infer<typeof createCourseCategoryDto>;
export type UpdateCourseCategoryDto = z.infer<typeof updateCourseCategoryDto>;
export type ListCourseCategoriesDto = z.infer<typeof listCourseCategoriesDto>;

