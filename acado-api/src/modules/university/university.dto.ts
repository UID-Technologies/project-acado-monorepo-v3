// src/modules/university/university.dto.ts
import { z } from 'zod';
import { objectIdSchema } from '../../core/utils/validator.js';

export const createUniversityDto = z.object({
  name: z.string().min(1, 'Name is required'),
  shortName: z.string().optional(),
  institutionType: z.enum(['University', 'COE', 'Industry', 'School']),
  organizationId: objectIdSchema.optional().nullable(),
  organizationName: z.string().optional(),
  organizationLevel: z.enum(['parent', 'child', 'branch']).optional(),
  parentInstitutionId: objectIdSchema.optional().nullable(),
  status: z.enum(['Active', 'Suspended']).optional(),
  tagline: z.string().optional(),
  foundedYear: z.number().int().positive().optional(),
  rating: z.string().optional(),
  rank: z.string().optional(),
  contact: z.object({
    primaryEmail: z.string().email().optional(),
    mobileNo: z.string().optional(),
    website: z.string().url().optional(),
  }).optional(),
  address: z.string().optional(),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    campuses: z.array(z.any()).optional(),
  }),
  branding: z.object({
    logoUrl: z.string().url().optional(),
    coverImageUrl: z.string().url().optional(),
    templateImageUrl: z.string().url().optional(),
    brochureUrl: z.string().url().optional(),
  }).optional(),
  // Add other fields as needed
}).passthrough(); // Allow additional fields

export const updateUniversityDto = createUniversityDto.partial();

export const listUniversitiesDto = z.object({
  search: z.string().optional(),
  country: z.string().optional(),
  institutionType: z.string().optional(),
  organizationId: z.string().optional(),
  parentInstitutionId: z.string().optional().nullable(),
  isActive: z.coerce.boolean().optional(),
  status: z.enum(['Active', 'Suspended']).optional(),
});

export type CreateUniversityDto = z.infer<typeof createUniversityDto>;
export type UpdateUniversityDto = z.infer<typeof updateUniversityDto>;
export type ListUniversitiesDto = z.infer<typeof listUniversitiesDto>;

