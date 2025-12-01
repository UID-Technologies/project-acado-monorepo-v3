// src/modules/field/field.dto.ts
import { z } from 'zod';

export const fieldTypeSchema = z.enum([
  'text', 'email', 'tel', 'number', 'date',
  'select', 'multiselect', 'textarea', 'file', 'checkbox', 'radio', 'country', 'url'
]);

export const selectOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const createFieldDto = z.object({
  name: z.string().min(1, 'Name is required'),
  label: z.string().min(1, 'Label is required'),
  type: fieldTypeSchema,
  placeholder: z.string().optional(),
  description: z.string().optional(),
  required: z.boolean().optional(),
  isCustom: z.boolean().optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
  subcategoryId: z.string().optional(),
  options: z.array(selectOptionSchema).optional(),
  order: z.number().int().positive().optional(),
  validation: z.array(z.any()).optional(),
});

export const updateFieldDto = createFieldDto.partial();

export const queryFieldsDto = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  sort: z.string().optional(),
});

export type CreateFieldDto = z.infer<typeof createFieldDto>;
export type UpdateFieldDto = z.infer<typeof updateFieldDto>;
export type QueryFieldsDto = z.infer<typeof queryFieldsDto>;

