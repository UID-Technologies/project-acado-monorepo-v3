// src/routes/event.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/event.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';

const router = Router();

// Public routes
router.get('/', optionalAuth, controller.list);
router.get('/:id', controller.getOne);
router.post('/:id/views', controller.incrementViews);
router.post('/:id/registrations', controller.incrementRegistrations);

// Protected routes (superadmin/admin)
router.post(
  '/',
  requireAuth,
  permit('superadmin', 'admin'),
  controller.create
);
router.put(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  controller.update
);
router.patch(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  controller.update
);
router.delete(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  controller.remove
);

export default router;

