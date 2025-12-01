// src/routes/form.routes.ts
import { Router } from 'express';
import validate from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';
import * as controller from '../controllers/form.controller.js';
import * as schema from '../schemas/form.schema.js';

const router = Router();

// Public routes (view forms)
router.get('/', validate(schema.queryFormsSchema), controller.list);
router.get('/by-course/:courseId', validate(schema.getFormByCourseIdSchema), controller.getFormByCourseId);
router.get('/:id', validate(schema.getFormSchema), controller.getOne);

// Protected routes (require authentication)
router.post(
  '/',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(schema.createFormSchema),
  controller.create
);

router.put(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(schema.updateFormSchema),
  controller.update
);

router.patch(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(schema.updateFormSchema),
  controller.update
);

router.delete(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(schema.deleteFormSchema),
  controller.remove
);

// Form actions
router.post(
  '/:id/publish',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(schema.getFormSchema),
  controller.publish
);

router.post(
  '/:id/archive',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(schema.getFormSchema),
  controller.archive
);

router.post(
  '/:id/duplicate',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(schema.getFormSchema),
  controller.duplicate
);

export default router;

