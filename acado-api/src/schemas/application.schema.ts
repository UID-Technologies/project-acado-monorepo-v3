// src/schemas/application.schema.ts
import { z } from 'zod';
import { objectId } from './shared.js';

export const createApplicationSchema = z.object({
  body: z.object({
    userId: z.string().min(1),
    universityId: z.string().optional(),
    courseId: z.string().optional(),
    formId: z.string().min(1),
    formData: z.record(z.any()),
    status: z.enum(['draft', 'submitted']).optional(),
    metadata: z.object({
      completionTime: z.number().optional()
    }).optional()
  })
});

export const updateApplicationSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    userId: z.string().optional(),
    universityId: z.string().optional(),
    courseId: z.string().optional(),
    formId: z.string().optional(),
    formData: z.record(z.any()).optional(),
    status: z.enum(['draft', 'submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn', 'waitlisted']).optional(),
    reviewNotes: z.string().optional()
  })
});

export const reviewApplicationSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.enum(['accepted', 'rejected', 'shortlisted', 'interview_scheduled', 'under_review', 'waitlisted']),
    reviewNotes: z.string().optional()
  })
});

export const getApplicationSchema = z.object({
  params: z.object({ id: objectId })
});

export const deleteApplicationSchema = z.object({
  params: z.object({ id: objectId })
});

export const queryApplicationsSchema = z.object({
  query: z.object({
    userId: z.string().optional(),
    universityId: z.string().optional(),
    courseId: z.string().optional(),
    formId: z.string().optional(),
    status: z.enum(['draft', 'submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn', 'waitlisted']).optional(),
    page: z.coerce.number().min(1).default(1).optional(),
    limit: z.coerce.number().min(1).max(100).default(20).optional(),
    sort: z.string().optional(),
    enrich: z.union([z.string(), z.boolean()]).optional() // Support both string and boolean
  })
});

export const statsSchema = z.object({
  query: z.object({
    userId: z.string().optional(),
    universityId: z.string().optional(),
    courseId: z.string().optional(),
    formId: z.string().optional()
  })
});

