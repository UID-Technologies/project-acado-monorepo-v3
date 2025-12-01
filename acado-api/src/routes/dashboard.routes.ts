// src/routes/dashboard.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';

const router = Router();

// Dashboard statistics - accessible by authenticated admins
router.get(
  '/stats',
  requireAuth,
  permit('superadmin', 'admin'),
  controller.getStats
);

export default router;

