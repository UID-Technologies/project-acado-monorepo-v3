// src/modules/scholarship/scholarship.dto.ts
import { z } from 'zod';

export const scholarshipFormFieldDto = z.object({
  fieldType: z.enum(['text', 'textarea', 'email', 'phone', 'file', 'url', 'dropdown']),
  label: z.string().min(1),
  required: z.boolean(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
});

export const scholarshipStageDto = z.object({
  type: z.enum(['screening', 'assessment', 'interview', 'assignment']),
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().positive(),
  deadline: z.coerce.date().optional(),
  weightage: z.number().int().min(0).max(100),
  autoScore: z.boolean(),
  reviewers: z.array(z.string()).optional(),
  passScore: z.number().int().nonnegative().optional(),
});

export const evaluationRulesDto = z.object({
  autoSelect: z.boolean().optional(),
  minScore: z.number().nonnegative().optional(),
  maxSelections: z.number().int().positive().optional(),
  tieBreaker: z.string().optional(),
}).passthrough();

export const createScholarshipDto = z.object({
  categoryTags: z.array(z.string()).optional(),
  title: z.string().min(1, 'Title is required'),
  providerId: z.string().min(1),
  providerName: z.string().min(1),
  type: z.enum(['merit', 'need_based', 'partial', 'full', 'fellowship', 'travel_grant']),
  amount: z.number().nonnegative(),
  currency: z.string().optional(),
  numberOfAwards: z.number().int().positive(),
  duration: z.string().optional(),
  studyLevel: z.enum(['undergraduate', 'postgraduate', 'phd', 'short_course', 'any']),
  fieldsOfStudy: z.array(z.string()).optional(),
  applicationDeadline: z.coerce.date(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  mode: z.enum(['online', 'offline']),
  bannerUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
  shortDescription: z.string().optional(),
  description: z.string().min(1),
  formFields: z.array(scholarshipFormFieldDto).optional(),
  applicationTemplateUrl: z.string().url().optional(),
  stages: z.array(scholarshipStageDto).optional(),
  evaluationRules: evaluationRulesDto.optional(),
  status: z.enum(['draft', 'active', 'inactive', 'completed', 'cancelled']).optional(),
  visibility: z.enum(['public', 'organization', 'private']).optional(),
}).passthrough();

export const updateScholarshipDto = createScholarshipDto.partial();

export const listScholarshipsDto = z.object({
  status: z.string().optional(),
  visibility: z.string().optional(),
  type: z.string().optional(),
  studyLevel: z.string().optional(),
  search: z.string().optional(),
});

export type CreateScholarshipDto = z.infer<typeof createScholarshipDto>;
export type UpdateScholarshipDto = z.infer<typeof updateScholarshipDto>;
export type ListScholarshipsDto = z.infer<typeof listScholarshipsDto>;

