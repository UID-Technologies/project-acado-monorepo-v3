// src/modules/email/email.controller.ts
import { Request, Response, NextFunction } from 'express';
import { EmailService } from './email.service.js';
import { successResponse } from '../../core/http/ApiResponse.js';
import { sendEmailDto } from './email.dto.js';

export class EmailController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  sendEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = sendEmailDto.parse(req.body);
      const result = await this.emailService.sendEmail({
        template: data.template,
        to: data.to,
        data: data.data,
        cc: data.cc,
        bcc: data.bcc,
      });
      res.status(202).json(successResponse({
        message: 'Email queued successfully',
        messageId: result.messageId,
        previewUrl: result.previewUrl ?? null,
      }));
    } catch (error) {
      next(error);
    }
  };
}

export const emailController = new EmailController();

