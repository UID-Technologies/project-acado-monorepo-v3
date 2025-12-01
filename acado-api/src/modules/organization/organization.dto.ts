// src/modules/organization/organization.dto.ts
import { z } from 'zod';

export const organizationContactDto = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const organizationLocationDto = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
});

export const organizationCommunicationsDto = z.object({
  onboardingEmails: z.array(z.string().email()).optional(),
  weeklyUpdates: z.boolean().optional(),
});

export const organizationSupportDto = z.object({
  successManager: z.string().optional(),
  supportChannel: z.enum(['email', 'slack', 'whatsapp']).optional(),
  supportNotes: z.string().optional(),
});

export const createOrganizationDto = z.object({
  name: z.string().min(1, 'Name is required'),
  shortName: z.string().optional(),
  type: z.enum(['University', 'Corporate', 'Non-Profit']).optional(),
  onboardingStage: z.enum(['Profile Created', 'Documents Submitted', 'Approved', 'Live']).optional(),
  description: z.string().optional(),
  contacts: z.object({
    primary: organizationContactDto.optional(),
    secondary: organizationContactDto.optional(),
  }).optional(),
  location: organizationLocationDto.optional(),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  communications: organizationCommunicationsDto.optional(),
  support: organizationSupportDto.optional(),
  suspended: z.boolean().optional(),
}).passthrough();

export const updateOrganizationInfoDto = z.object({
  name: z.string().min(1).optional(),
  shortName: z.string().optional(),
  type: z.enum(['University', 'Corporate', 'Non-Profit']).optional(),
  description: z.string().optional(),
  website: z.string().url().optional(),
});

export const updateOrganizationContactsDto = z.object({
  primary: organizationContactDto.optional(),
  secondary: organizationContactDto.optional(),
});

export const updateOrganizationLocationDto = organizationLocationDto;

export const updateOrganizationStageDto = z.object({
  onboardingStage: z.enum(['Profile Created', 'Documents Submitted', 'Approved', 'Live']),
});

export const organizationStatusDto = z.object({
  suspended: z.boolean(),
});

export const adminInviteDto = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  mobileNo: z.string().optional(),
});

export type CreateOrganizationDto = z.infer<typeof createOrganizationDto>;
export type UpdateOrganizationInfoDto = z.infer<typeof updateOrganizationInfoDto>;
export type UpdateOrganizationContactsDto = z.infer<typeof updateOrganizationContactsDto>;
export type UpdateOrganizationLocationDto = z.infer<typeof updateOrganizationLocationDto>;
export type UpdateOrganizationStageDto = z.infer<typeof updateOrganizationStageDto>;
export type OrganizationStatusDto = z.infer<typeof organizationStatusDto>;
export type AdminInviteDto = z.infer<typeof adminInviteDto>;

