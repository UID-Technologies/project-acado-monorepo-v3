// src/modules/email/email.routes.ts
import { Router } from 'express';
import { emailController } from './email.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';
import { validateRequest } from '../../core/middleware/validateMiddleware.js';
import { sendEmailDto } from './email.dto.js';

const router = Router();

router.post('/', requireAuth, permit('superadmin', 'admin'), validateRequest(sendEmailDto, 'body'), emailController.sendEmail);

export default router;

