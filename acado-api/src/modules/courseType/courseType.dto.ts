// src/modules/courseType/courseType.dto.ts
import { z } from 'zod';

export const createCourseTypeDto = z.object({
  name: z.string().min(1, 'Name is required'),
  shortName: z.string().min(1, 'Short name is required'),
  description: z.string().optional(),
  keywords: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateCourseTypeDto = createCourseTypeDto.partial();

export const listCourseTypesDto = z.object({
  includeInactive: z.coerce.boolean().optional(),
});

export type CreateCourseTypeDto = z.infer<typeof createCourseTypeDto>;
export type UpdateCourseTypeDto = z.infer<typeof updateCourseTypeDto>;
export type ListCourseTypesDto = z.infer<typeof listCourseTypesDto>;

