// src/routes/email.routes.ts
import { Router } from 'express';
import validate from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';
import * as controller from '../controllers/email.controller.js';
import { sendEmailSchema } from '../schemas/email.schema.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(sendEmailSchema),
  controller.sendEmail,
);

export default router;


