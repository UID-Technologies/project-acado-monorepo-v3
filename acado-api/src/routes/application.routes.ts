// src/routes/application.routes.ts
import { Router } from 'express';
import validate from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';
import { scopeByUniversity } from '../middleware/universityScope.js';
import * as controller from '../controllers/application.controller.js';
import * as schema from '../schemas/application.schema.js';

const router = Router();

// Get application statistics
router.get(
  '/stats',
  requireAuth,
  scopeByUniversity,
  validate(schema.statsSchema),
  controller.stats
);

// List applications (with filters)
router.get(
  '/',
  requireAuth,
  scopeByUniversity,
  validate(schema.queryApplicationsSchema),
  controller.list
);

// Get single application
router.get(
  '/:id',
  requireAuth,
  validate(schema.getApplicationSchema),
  controller.getOne
);

// Create new application (users can create their own)
router.post(
  '/',
  requireAuth,
  validate(schema.createApplicationSchema),
  controller.create
);

// Update application (users can update their own drafts)
router.put(
  '/:id',
  requireAuth,
  validate(schema.updateApplicationSchema),
  controller.update
);

router.patch(
  '/:id',
  requireAuth,
  validate(schema.updateApplicationSchema),
  controller.update
);

// Delete application
router.delete(
  '/:id',
  requireAuth,
  validate(schema.deleteApplicationSchema),
  controller.remove
);

// Submit application (change status from draft to submitted)
router.post(
  '/:id/submit',
  requireAuth,
  validate(schema.getApplicationSchema),
  controller.submit
);

// Withdraw application
router.post(
  '/:id/withdraw',
  requireAuth,
  validate(schema.getApplicationSchema),
  controller.withdraw
);

// Review application (admin/editor only)
router.post(
  '/:id/review',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(schema.reviewApplicationSchema),
  controller.review
);

export default router;

