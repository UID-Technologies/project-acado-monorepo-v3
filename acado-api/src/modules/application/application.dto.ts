// src/modules/application/application.dto.ts
import { z } from 'zod';

export const attachmentDto = z.object({
  fieldName: z.string(),
  fileName: z.string(),
  fileUrl: z.string().url(),
  uploadedAt: z.coerce.date().optional(),
});

export const metadataDto = z.object({
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  completionTime: z.number().optional(),
});

export const createApplicationDto = z.object({
  userId: z.string().min(1, 'User ID is required'),
  universityId: z.string().optional(),
  courseId: z.string().optional(),
  formId: z.string().min(1, 'Form ID is required'),
  formData: z.record(z.any()),
  status: z.enum(['draft', 'submitted']).optional(),
  attachments: z.array(attachmentDto).optional(),
  metadata: metadataDto.optional(),
});

export const updateApplicationDto = z.object({
  userId: z.string().optional(),
  universityId: z.string().optional(),
  courseId: z.string().optional(),
  formId: z.string().optional(),
  formData: z.record(z.any()).optional(),
  status: z.enum(['draft', 'submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn', 'waitlisted']).optional(),
  reviewNotes: z.string().optional(),
  submittedAt: z.coerce.date().optional(),
  reviewedAt: z.coerce.date().optional(),
  metadata: metadataDto.optional(),
});

export const queryApplicationsDto = z.object({
  userId: z.string().optional(),
  universityId: z.string().optional(),
  courseId: z.string().optional(),
  formId: z.string().optional(),
  status: z.enum(['draft', 'submitted', 'under_review', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected', 'withdrawn', 'waitlisted']).optional(),
  sort: z.string().optional(),
  enrich: z.coerce.boolean().optional(),
});

export const reviewApplicationDto = z.object({
  status: z.enum(['under_review', 'shortlisted', 'interview_scheduled', 'accepted', 'rejected', 'waitlisted']),
  reviewNotes: z.string().optional(),
});

export type CreateApplicationDto = z.infer<typeof createApplicationDto>;
export type UpdateApplicationDto = z.infer<typeof updateApplicationDto>;
export type QueryApplicationsDto = z.infer<typeof queryApplicationsDto>;
export type ReviewApplicationDto = z.infer<typeof reviewApplicationDto>;

