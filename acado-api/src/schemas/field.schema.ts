// src/schemas/field.schema.ts
import { z } from 'zod';
import { objectId } from './shared.js';

const FieldType = z.enum([
  'text','email','tel','number','date','select','multiselect','textarea','file','checkbox','radio','country','url'
]);

const validationSchema = z.object({
  type: z.enum(['required', 'minLength', 'maxLength', 'pattern', 'min', 'max', 'email', 'url', 'custom']),
  value: z.any().optional(),
  message: z.string().optional()
});

const selectOptionSchema = z.object({
  label: z.string(),
  value: z.string()
});

export const createFieldSchema = z.object({
  body: z.object({
    name: z.string().regex(/^[a-z][a-z0-9_]*$/).max(64),
    label: z.string().min(1).max(128),
    type: FieldType,
    placeholder: z.string().optional(),
    required: z.boolean().optional(),
    description: z.string().max(256).optional(),
    order: z.number().optional(),
    isCustom: z.boolean().optional(),
    options: z.array(selectOptionSchema).optional(),
    validation: z.array(validationSchema).optional(),
    categoryId: objectId,
    subcategoryId: objectId.optional()
  })
});

export const queryFieldsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    categoryId: objectId.optional(),
    subcategoryId: objectId.optional(),
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(100).default(20).optional(),
    sort: z.string().optional()
  })
});
