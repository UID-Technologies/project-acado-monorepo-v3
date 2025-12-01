// src/modules/courseLevel/courseLevel.dto.ts
import { z } from 'zod';

export const createCourseLevelDto = z.object({
  name: z.string().min(1, 'Name is required'),
  shortName: z.string().min(1, 'Short name is required'),
  description: z.string().optional(),
  keywords: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateCourseLevelDto = createCourseLevelDto.partial();

export const listCourseLevelsDto = z.object({
  includeInactive: z.coerce.boolean().optional(),
});

export type CreateCourseLevelDto = z.infer<typeof createCourseLevelDto>;
export type UpdateCourseLevelDto = z.infer<typeof updateCourseLevelDto>;
export type ListCourseLevelsDto = z.infer<typeof listCourseLevelsDto>;

