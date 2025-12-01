// src/routes/courseLevel.routes.ts
import { Router } from 'express';
import * as controller from '../controllers/courseLevel.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { permit } from '../middleware/rbac.js';
import validate from '../middleware/validate.js';
import { createCourseLevelSchema, updateCourseLevelSchema, courseLevelIdParamSchema } from '../schemas/courseLevel.schema.js';

const router = Router();

router.get('/', controller.list);
router.get('/:id', validate(courseLevelIdParamSchema), controller.getOne);

router.post(
  '/',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(createCourseLevelSchema),
  controller.create
);

router.put(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(updateCourseLevelSchema),
  controller.update
);

router.patch(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(updateCourseLevelSchema),
  controller.update
);

router.delete(
  '/:id',
  requireAuth,
  permit('superadmin', 'admin'),
  validate(courseLevelIdParamSchema),
  controller.remove
);

export default router;


