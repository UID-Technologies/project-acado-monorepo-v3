// src/schemas/email.schema.ts
import { z } from 'zod';

const emailAddressSchema = z.string().email('Invalid email address');

const adminInvitationDataSchema = z.object({
  recipientName: z.string().min(1).optional(),
  inviterName: z.string().min(1).optional(),
  organizationName: z.string().min(1).optional(),
  inviteLink: z.string().url('inviteLink must be a valid URL'),
});

const forgotPasswordDataSchema = z.object({
  recipientName: z.string().min(1).optional(),
  resetLink: z.string().url('resetLink must be a valid URL'),
  expiresInMinutes: z.number().int().positive().optional(),
});

const welcomeDataSchema = z.object({
  recipientName: z.string().min(1).optional(),
  loginLink: z.string().url('loginLink must be a valid URL').optional(),
  organizationName: z.string().min(1).optional(),
});

const ccBccSchema = z.array(emailAddressSchema).max(10).optional();

export const sendEmailSchema = z.object({
  body: z.discriminatedUnion('template', [
    z.object({
      template: z.literal('admin_invitation'),
      to: emailAddressSchema,
      cc: ccBccSchema,
      bcc: ccBccSchema,
      data: adminInvitationDataSchema,
    }),
    z.object({
      template: z.literal('forgot_password'),
      to: emailAddressSchema,
      cc: ccBccSchema,
      bcc: ccBccSchema,
      data: forgotPasswordDataSchema,
    }),
    z.object({
      template: z.literal('welcome'),
      to: emailAddressSchema,
      cc: ccBccSchema,
      bcc: ccBccSchema,
      data: welcomeDataSchema,
    }),
  ]),
});


