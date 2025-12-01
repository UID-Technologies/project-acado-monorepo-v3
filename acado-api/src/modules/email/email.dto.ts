// src/modules/email/email.dto.ts
import { z } from 'zod';

export const sendEmailDto = z.object({
  template: z.enum(['admin_invitation', 'forgot_password', 'welcome']),
  to: z.string().email('Invalid email address'),
  data: z.record(z.any()),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
});

export type SendEmailDto = z.infer<typeof sendEmailDto>;

