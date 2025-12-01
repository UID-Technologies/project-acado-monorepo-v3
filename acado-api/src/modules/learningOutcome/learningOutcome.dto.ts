// src/modules/learningOutcome/learningOutcome.dto.ts
import { z } from 'zod';
import { objectIdSchema } from '../../core/utils/validator.js';

export const createLearningOutcomeDto = z.object({
  name: z.string().min(1, 'Name is required'),
  shortName: z.string().min(1, 'Short name is required'),
  code: z.string().optional(),
  parentId: objectIdSchema.optional().nullable(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateLearningOutcomeDto = createLearningOutcomeDto.partial();

export const listLearningOutcomesDto = z.object({
  parentId: z.string().optional().nullable(),
  includeInactive: z.coerce.boolean().optional(),
});

export type CreateLearningOutcomeDto = z.infer<typeof createLearningOutcomeDto>;
export type UpdateLearningOutcomeDto = z.infer<typeof updateLearningOutcomeDto>;
export type ListLearningOutcomesDto = z.infer<typeof listLearningOutcomesDto>;

