// src/modules/dashboard/dashboard.routes.ts
import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';
import { requireAuth } from '../../core/middleware/authMiddleware.js';
import { permit } from '../../core/middleware/rbacMiddleware.js';

const router = Router();

router.get('/stats', requireAuth, permit('superadmin', 'admin'), dashboardController.getStats);

export default router;

