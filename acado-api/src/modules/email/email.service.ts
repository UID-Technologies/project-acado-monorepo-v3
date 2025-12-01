// src/modules/email/email.service.ts
import { sendTemplatedEmail, EmailTemplate } from '../../services/email.service.js';
import { SendTemplateEmailOptions } from '../../services/email.service.js';

export class EmailService {
  async sendEmail(options: SendTemplateEmailOptions<EmailTemplate>) {
    return sendTemplatedEmail(options);
  }
}

