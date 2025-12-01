// src/modules/form/form.dto.ts
import { z } from 'zod';

export const selectOptionDto = z.object({
  value: z.string(),
  label: z.string(),
});

export const validationRuleDto = z.object({
  type: z.enum(['required', 'minLength', 'maxLength', 'pattern', 'min', 'max', 'email', 'url', 'custom']),
  value: z.any().optional(),
  message: z.string().optional(),
});

export const configuredFieldDto = z.object({
  fieldId: z.string().optional(),
  name: z.string().min(1),
  label: z.string().min(1),
  customLabel: z.string().optional(),
  type: z.string().min(1),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  isRequired: z.boolean().optional(),
  categoryId: z.string().min(1),
  subcategoryId: z.string().optional(),
  options: z.array(selectOptionDto).optional(),
  validation: z.array(validationRuleDto).optional(),
  description: z.string().optional(),
  order: z.number().optional(),
});

export const customCategoryNameDto = z.object({
  name: z.string().min(1),
  subcategories: z.record(z.string()).optional(),
});

export const createFormDto = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  organizationId: z.string().optional(),
  organizationName: z.string().optional(),
  universityId: z.string().optional(),
  universityName: z.string().optional(),
  courseIds: z.array(z.string()).optional(),
  courseNames: z.array(z.string()).optional(),
  fields: z.array(configuredFieldDto),
  customCategoryNames: z.record(customCategoryNameDto).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  isLaunched: z.boolean().optional(),
  isActive: z.boolean().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
}).passthrough();

export const updateFormDto = createFormDto.partial();

export const queryFormsDto = z.object({
  status: z.enum(['draft', 'published', 'archived']).optional(),
  universityId: z.string().optional(),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export type CreateFormDto = z.infer<typeof createFormDto>;
export type UpdateFormDto = z.infer<typeof updateFormDto>;
export type QueryFormsDto = z.infer<typeof queryFormsDto>;

