// src/routes/course.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/course.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';
import { scopeByUniversity, validateUniversityAccess } from '../middleware/universityScope.js';
import validate from '../middleware/validate.js';
import { createCourseSchema, updateCourseSchema, courseIdParamSchema } from '../schemas/course.schema.js';

const router = Router();

// Public routes (optionalAuth allows both authenticated and unauthenticated access)
router.get('/', optionalAuth, scopeByUniversity, controller.list);
router.get('/:id', validate(courseIdParamSchema), controller.getOne);

// Protected routes (superadmin/admin)
router.post(
  '/',
  requireAuth,
  permit('superadmin', 'admin'),
  validateUniversityAccess,
  validate(createCourseSchema),
  controller.create
);
router.put(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validateUniversityAccess,
  validate(updateCourseSchema),
  controller.update
);
router.patch(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validateUniversityAccess,
  validate(updateCourseSchema),
  controller.update
);
router.delete(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validateUniversityAccess,
  validate(courseIdParamSchema),
  controller.remove
);

export default router;

