// src/controllers/email.controller.ts
import { Request, Response, NextFunction } from 'express';
import { sendTemplatedEmail, EmailTemplate } from '../services/email.service.js';

export const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { template, to, data, cc, bcc } = req.body;

    // ------------------------------
    // Runtime Validation
    // ------------------------------
    if (!template) {
      return res.status(400).json({ error: 'template is required' });
    }

    if (!to) {
      return res.status(400).json({ error: 'recipient email (to) is required' });
    }

    // Ensure template is one of the valid types
    const validTemplates: EmailTemplate[] = [
      'admin_invitation',
      'forgot_password',
      'welcome',
    ];

    if (!validTemplates.includes(template)) {
      return res.status(400).json({
        error: `Invalid template '${template}'. Must be one of: ${validTemplates.join(', ')}`,
      });
    }

    if (!data || typeof data !== 'object') {
      return res.status(400).json({
        error: 'data must be an object containing template-specific inputs',
      });
    }

    // ------------------------------
    // Send Email
    // ------------------------------
    const result = await sendTemplatedEmail({
      template,
      to,
      data,
      cc,
      bcc,
    });

    // ------------------------------
    // Response
    // ------------------------------
    return res.status(202).json({
      message: 'Email queued successfully',
      messageId: result.messageId,
      previewUrl: result.previewUrl ?? null,
    });
  } catch (error) {
    next(error);
  }
};
