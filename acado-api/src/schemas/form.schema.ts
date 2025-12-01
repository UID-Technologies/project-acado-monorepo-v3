// src/schemas/form.schema.ts
import { z } from 'zod';
import { objectId } from './shared.js';

const selectOptionSchema = z.object({
  value: z.string(),
  label: z.string()
});

const validationRuleSchema = z.object({
  type: z.enum(['required', 'minLength', 'maxLength', 'pattern', 'min', 'max', 'email', 'url', 'custom']),
  value: z.any().optional(),
  message: z.string().optional()
});

const configuredFieldSchema = z.object({
  fieldId: z.string().optional(),
  name: z.string().min(1).max(128),
  label: z.string().min(1).max(128),
  customLabel: z.string().optional(),
  type: z.string().min(1),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  isRequired: z.boolean().optional(),
  categoryId: z.string().min(1),
  subcategoryId: z.string().optional(),
  options: z.array(selectOptionSchema).optional(),
  validation: z.array(validationRuleSchema).optional(),
  description: z.string().optional(),
  order: z.number().optional()
});

const customCategoryNameSchema = z.object({
  name: z.string().min(1),
  subcategories: z.record(z.string()).optional()
});

export const createFormSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(128),
    title: z.string().min(2).max(128),
    description: z.string().max(512).optional(),
    organizationId: z.string().optional(),
    organizationName: z.string().optional(),
    universityId: z.string().optional(),
    universityName: z.string().optional(), // Can be provided or fetched
    courseIds: z.array(z.string()).optional(),
    courseNames: z.array(z.string()).optional(), // Can be provided or fetched
    fields: z.array(configuredFieldSchema),
    customCategoryNames: z.record(customCategoryNameSchema).optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    isLaunched: z.boolean().optional(),
    isActive: z.boolean().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
});

export const updateFormSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    name: z.string().min(2).max(128).optional(),
    title: z.string().min(2).max(128).optional(),
    description: z.string().max(512).optional(),
    organizationId: z.string().optional(),
    organizationName: z.string().optional(),
    universityId: z.string().optional(),
    universityName: z.string().optional(),
    courseIds: z.array(z.string()).optional(),
    courseNames: z.array(z.string()).optional(),
    fields: z.array(configuredFieldSchema).optional(),
    customCategoryNames: z.record(customCategoryNameSchema).optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    isLaunched: z.boolean().optional(),
    isActive: z.boolean().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
});

export const getFormSchema = z.object({
  params: z.object({ id: objectId })
});

export const deleteFormSchema = z.object({
  params: z.object({ id: objectId })
});

export const queryFormsSchema = z.object({
  query: z.object({
    status: z.enum(['draft', 'published', 'archived']).optional(),
    universityId: z.string().optional(),
    isActive: z.coerce.boolean().optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(100).default(20).optional(),
    sort: z.string().optional()
  })
});

export const getFormByCourseIdSchema = z.object({
  params: z.object({ 
    courseId: z.string().min(1, 'Course ID is required')
  })
});

