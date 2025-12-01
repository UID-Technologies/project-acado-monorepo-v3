// src/schemas/organization.schema.ts
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional()
});

export const locationSchema = z.object({
  country: z.string().trim().optional(),
  state: z.string().trim().optional(),
  city: z.string().trim().optional()
});

const onboardingEmailsSchema = z
  .union([
    z.array(z.string().trim().email()),
    z
      .string()
      .trim()
      .transform((value) =>
        value
          ? value
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
          : []
      )
  ])
  .optional()
  .transform((value) => value ?? []);

const communicationsSchema = z.object({
  onboardingEmails: onboardingEmailsSchema,
  weeklyUpdates: z.boolean().optional()
});

const supportSchema = z.object({
  successManager: z.string().trim().optional(),
  supportChannel: z.enum(['email', 'slack', 'whatsapp']).optional(),
  supportNotes: z.string().trim().optional()
});

export const adminInviteSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().email('Invalid email format'),
    phone: z.string().trim().optional(),
    password: z
      .string()
      .trim()
      .min(8, 'Password must be at least 8 characters')
      .optional(),
    sendWelcomeEmail: z.boolean().optional()
  })
});

export const organizationStatusSchema = z.object({
  body: z.object({
    suspended: z.boolean(),
  }),
});

const adminSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  password: z
    .string()
    .min(8)
    .optional(),
  sendWelcomeEmail: z.boolean().optional()
});

const baseOrganizationSchema = z.object({
  name: z.string().trim().min(2),
  shortName: z
    .string()
    .trim()
    .min(2)
    .optional(),
  type: z.enum(['University', 'Corporate', 'Non-Profit']).default('University'),
  onboardingStage: z
    .enum(['Profile Created', 'Documents Submitted', 'Approved', 'Live'])
    .default('Profile Created'),
  description: z.string().trim().optional(),
  contacts: z
    .object({
      primary: contactSchema.optional(),
      secondary: contactSchema.optional()
    })
    .optional(),
  location: locationSchema.optional(),
  website: z.string().trim().url().optional(),
  logoUrl: z.string().trim().url().optional(),
  communications: communicationsSchema.optional(),
  support: supportSchema.optional(),
  suspended: z.boolean().optional(),
  admin: adminSchema.optional()
});

export const createOrganizationSchema = z.object({
  body: baseOrganizationSchema
});

export const updateOrganizationLocationSchema = z.object({
  body: locationSchema
});

export const updateOrganizationStageSchema = z.object({
  body: z.object({
    onboardingStage: z.enum(['Profile Created', 'Documents Submitted', 'Approved', 'Live'])
  })
});

const updateOrganizationInfoBodySchema = z
  .object({
    name: z.string().trim().min(2).optional(),
    shortName: z
      .string()
      .trim()
      .min(2)
      .optional(),
    type: z.enum(['University', 'Corporate', 'Non-Profit']).optional(),
    description: z.string().trim().optional(),
    website: z.string().trim().url().optional()
  })
  .refine(
    (value) => Object.values(value).some((item) => item !== undefined),
    'At least one field must be provided to update organization info.'
  );

const updateOrganizationContactBodySchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional()
});

export const updateOrganizationInfoSchema = z.object({
  body: updateOrganizationInfoBodySchema
});

export const updateOrganizationContactsSchema = z.object({
  body: z
    .object({
      primary: updateOrganizationContactBodySchema.optional(),
      secondary: updateOrganizationContactBodySchema.optional()
    })
    .refine(
      (value) => value.primary !== undefined || value.secondary !== undefined,
      'Provide at least one contact to update.'
    )
});

export type CreateOrganizationInput = z.infer<typeof baseOrganizationSchema>;


